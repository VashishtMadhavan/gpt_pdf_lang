from typing import Any, Dict, List, NamedTuple, Tuple, Type

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.docstore.document import Document
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate
from pydantic import BaseModel as PydanticBaseModel

from models.base import BaseDocQAModel
from models.utils import find_fuzzy_match
from prompt_templates.qa_templates import PER_DOC_PROMPT


class ExtractionResult(NamedTuple):
    """A named tuple for storing the results of an extraction"""

    page_id: int
    source: str
    offsets: List[Tuple[int, int]]
    entities: List[str]

class BaseModel(PydanticBaseModel):
    """Allow arbitrary types in pydantic models"""

    class Config:
        arbitrary_types_allowed = True

class ExtractionModel(BaseDocQAModel):
    """A model for extraction per page"""

    def __init__(
        self,
        format_model: Type[BaseModel],
        find_matches: bool = True,
        **kwargs: Dict[str, Any],
    ) -> None:
        super().__init__(**kwargs)
        self.find_matches = find_matches
        self.format_model = format_model
        self.output_parser = PydanticOutputParser(pydantic_object=format_model)
        self.llm = ChatOpenAI(temperature=0)
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)

    @property
    def prompt(self) -> ChatPromptTemplate:
        prompt_template = PER_DOC_PROMPT
        human_template = HumanMessagePromptTemplate.from_template(prompt_template)
        return ChatPromptTemplate(
            messages=[human_template],
            input_variables=["context", "question"],
            partial_variables={
                "format_instructions": self.output_parser.get_format_instructions()
            },
        )

    def _post_process_answers(
        self, page_content: str, result: Any
    ) -> Tuple[List[Tuple[int, int]], List[str]]:
        offsets = []
        entities = []
        for entity_name in result.__fields__.keys():
            entity_value = getattr(result, entity_name)
            # Could have multiple matches per page
            if self.find_matches:
                match = find_fuzzy_match(entity_value, page_content)
                if match:
                    offsets.append(match)
                    entities.append(entity_value)
            else:
                entities.append(entity_value)
                offsets.append((-1, -1))
        return offsets, entities

    def _get_question(self) -> str:
        """Get a question from the question generator"""
        base_question = "What is the "
        for entity_name in self.format_model.__fields__.keys():
            base_question += f"{entity_name}, "
        base_question += "of the document?"
        return base_question

    def run(self, docs: List[Document]) -> List[ExtractionResult]:
        output = []
        for doc in docs:
            question = self._get_question()
            result = self.chain.run(context=doc.page_content, question=question)
            parsed_result = self.output_parser.parse(result)
            offsets, entities = self._post_process_answers(
                doc.page_content, parsed_result
            )
            if len(entities) != 0:
                output.append(
                    ExtractionResult(
                        page_id=doc.metadata["page"],
                        source=doc.metadata["source"],
                        offsets=offsets,
                        entities=entities,
                    )
                )
        return output
