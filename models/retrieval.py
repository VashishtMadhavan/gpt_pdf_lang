from typing import NamedTuple, List, Tuple
from models.base import BaseDocQAModel
from models.utils import find_fuzzy_match
from prompt_templates.qa_templates import SEARCH_PROMPT

from langchain.prompts import PromptTemplate
from langchain.prompts.chat import HumanMessagePromptTemplate, ChatPromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import RetrievalQA
from langchain.schema import BaseRetriever
from langchain.docstore.document import Document
from langchain.chat_models import ChatOpenAI

class RetrievalResult(NamedTuple):
    """A named tuple for storing the results of a retrieval-based QA"""
    answer: str
    context: str
    source: str
    page_id: int
    char_offset: Tuple[int, int]
    source_docs: List[Document]


class RetrievalModel(BaseDocQAModel):
    """A model for performing document QA using a retrieval-based approach"""

    def __init__(self, retriever: BaseRetriever, **kwargs) -> None:
        super().__init__(**kwargs)
        self.retriever = retriever
        self.llm = ChatOpenAI(temperature=0)
        self.qa_chain = load_qa_chain(llm=self.llm, chain_type="stuff", prompt=self.prompt)
        self.qa_model = RetrievalQA(combine_documents_chain=self.qa_chain, retriever=self.retriever, return_source_documents=self.with_sources)
    
    @property
    def prompt(self) -> PromptTemplate:
        human_template = HumanMessagePromptTemplate.from_template(SEARCH_PROMPT)
        return ChatPromptTemplate.from_messages([human_template])
    
    def _find_matches_in_docs(self, docs: List[Document], answer: str) -> RetrievalResult:
        """Find the offsets of the answer in the documents"""
        context = self.qa_model.combine_documents_chain._get_inputs(docs)["context"]
        for doc in docs:
            page_id = doc.metadata["page"]
            src_file = doc.metadata["source"]
            match = find_fuzzy_match(answer, doc.page_content)
            if match:
                return RetrievalResult(answer=answer, 
                                       context=context, 
                                       source=src_file,
                                       page_id=page_id,
                                       source_docs=docs,
                                       char_offset=(match[0], match[1]))
        return RetrievalResult(answer=answer, 
                               context=context, 
                               source="", 
                               page_id=-1,
                               char_offset=(-1, -1),
                               source_docs=docs)
    

    def run(self, question: str) -> RetrievalResult:
        result = self.qa_model({"query": question})
        answer = result["result"].strip()
        return self._find_matches_in_docs(result["source_documents"], answer)

