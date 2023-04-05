from __future__ import annotations

from typing import Any, List

from langchain import PromptTemplate
from langchain.chains.llm import LLMChain
from langchain.llms.base import BaseLLM

from prompt_templates.eval_templates import PROMPT


class QAOpenEvalChain(LLMChain):
    """LLM Chain specifically for evaluating question answering w/out GT"""

    @classmethod
    def from_llm(
        cls, llm: BaseLLM, prompt: PromptTemplate = PROMPT, **kwargs: Any
    ) -> QAOpenEvalChain:
        expected_input_vars = {"query", "context", "result"}
        if expected_input_vars != set(prompt.input_variables):
            raise ValueError(
                f"Input variables should be {expected_input_vars}, "
                f"but got {prompt.input_variables}"
            )
        return cls(llm=llm, prompt=prompt, **kwargs)

    def evaluate(
        self,
        examples: List[dict],
        question_key: str = "query",
        context_key: str = "context",
        prediction_key: str = "result",
    ) -> List[dict]:
        """Evaluate question answering examples and predictions."""
        inputs = [
            {
                "query": example[question_key],
                "context": example[context_key],
                "result": example[prediction_key],
            }
            for example in examples
        ]

        return self.apply(inputs)
