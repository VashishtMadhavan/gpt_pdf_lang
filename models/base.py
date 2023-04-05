from langchain.prompts import PromptTemplate
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