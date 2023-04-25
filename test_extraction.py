from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from pydantic import BaseModel, Field

from models.extractor import ExtractionModel
from vector_store import VectorStoreWrapper

loader = DirectoryLoader(path="examples/", glob="*.pdf", loader_cls=PyPDFLoader)
docs = loader.load()
db = VectorStoreWrapper(load_path="examples_index_test").get_index(docs)

# Step 3: Define a pydantic model for outputs
class CompanyInfo(BaseModel):
    company: str = Field(description="the name of the company")
    ticker: str = Field(description="the ticker for the company")
    address: str = Field(description="the address of the company")


## Step 4: Ask a question against the index using a QA chain
model = ExtractionModel(format_model=CompanyInfo, find_matches=True)
relevant_docs = model.get_similar_docs(db, k=100)
result = model.run(relevant_docs)
print(result)
