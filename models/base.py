
from typing import List, Optional, Union, Dict, Any, Type
from pydantic import BaseModel, Field, Extra
from langchain.schema import BaseRetriever
from langchain.prompts import PromptTemplate
from prompt_templates.qa_templates import SEARCH_PROMPT, PER_DOC_PROMPT
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import RetrievalQA
from langchain import OpenAI
from langchain.chains import LLMChain
from abc import ABC, abstractmethod


class BaseDocQAModel(ABC):
    """A base class for performing document QA"""
    def __init__(self, with_sources: bool = True) -> None:
        self.with_sources = with_sources

    @property
    @abstractmethod
    def prompt(self) -> PromptTemplate:
        """The prompt associated with the specific model"""
        pass