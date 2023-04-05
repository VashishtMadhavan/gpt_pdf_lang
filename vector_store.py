from typing import List, Optional, Any
from pydantic import BaseModel
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
import os

class VectorStoreWrapper(BaseModel):
    """Wrapper for a VectorStore object. This is used to serialize the vector store to disk and load it back in again."""
    embedding_type: str = "openai"
    vector_store_type: str = "faiss"
    load_path: Optional[str] = None

    def _get_embeddings(self):
        if self.embedding_type == "openai":
            return OpenAIEmbeddings()
        else:
            raise ValueError(f"Unknown embedding type {self.embedding_type}")

    def get_index(self, docs: List[Document]) -> Any:
        if self.vector_store_type == "faiss":
            embeddings = self._get_embeddings()
            if self.load_path and os.path.exists(self.load_path):
                return FAISS.load_local(self.load_path, embeddings)
            vector_store = FAISS.from_documents(docs, embeddings)
            vector_store.save_local(self.load_path)
            return vector_store
        else:
            raise ValueError(f"Unknown vector store type {self.vector_store_type}")
        
    