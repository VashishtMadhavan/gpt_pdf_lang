import os
from typing import Any, List, Optional

from langchain.docstore.document import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from pydantic import BaseModel


class VectorStoreWrapper(BaseModel):
    """Wrapper for a VectorStore object. This is used to serialize the vector store to disk and load it back in again."""

    embedding_type: str = "openai"
    vector_store_type: str = "faiss"
    load_path: Optional[str] = None

    def _get_embeddings(self) -> Any:
        if self.embedding_type == "openai":
            return OpenAIEmbeddings()
        else:
            raise ValueError(f"Unknown embedding type {self.embedding_type}")

    def get_index(self, docs: List[Document]) -> Any:
        if self.vector_store_type == "faiss":
            embeddings = self._get_embeddings()
            if self.load_path and os.path.exists(self.load_path):
                return FAISS.load_local(self.load_path, embeddings)
            db = FAISS.from_documents(docs, embeddings)
            if self.load_path:
                db.save_local(self.load_path)
            return db
        else:
            raise ValueError(f"Unknown vector store type {self.vector_store_type}")
