from abc import ABC, abstractmethod

from langchain.prompts.chat import ChatPromptTemplate


class BaseDocQAModel(ABC):
    """A base class for performing document QA"""

    def __init__(self, with_sources: bool = True) -> None:
        self.with_sources = with_sources

    @property
    @abstractmethod
    def prompt(self) -> ChatPromptTemplate:
        """The prompt associated with the specific model"""
