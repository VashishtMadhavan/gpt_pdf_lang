from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pydantic import BaseModel, Field

from models.extractor import ExtractionModel

## Step 1: Load in data
loader = DirectoryLoader(
    path="examples/", glob="msft_10q_q1_23.pdf", loader_cls=PyPDFLoader
)
docs = loader.load()

## Step 2: Split/Preprocess doc
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=3000, separators=["\n \n", "\n\n", "\n", " ", ""]
)
split_docs = text_splitter.split_documents(docs)

# Step 3: Define a pydantic model for outputs
class CompanyInfo(BaseModel):
    company: str = Field(description="the name of the company")
    ticker: str = Field(description="the ticker for the company")
    address: str = Field(description="the address of the company")


## Step 4: Ask a question against the index using a QA chain
model = ExtractionModel(format_model=CompanyInfo, find_matches=True)
result = model.run(split_docs[:1])
print(result)
