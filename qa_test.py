from vector_store import VectorStoreWrapper
from models.retrieval import RetrievalModel
from evaluate.open_eval_chain import QAOpenEvalChain

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain import OpenAI
from langchain.document_loaders import PyPDFLoader, DirectoryLoader

## Step 1: Load in data
filepath = "/Users/vashishtmadhavan/Downloads/sample-layout-1.pdf"
faiss_path = "fass_index_msft"
loader = DirectoryLoader(path="examples/", glob="*.pdf", loader_cls=PyPDFLoader)
docs = loader.load()

## Step 2: Split/Preprocess doc
text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, separators=["\n \n","\n\n", "\n", " ", ""])
split_docs = text_splitter.split_documents(docs)

## Step 3: Embed docs and create index
db = VectorStoreWrapper(load_path=faiss_path).get_index(split_docs)

## Step 5: Ask a question against the index using a QA chain
query = "What is the name of the company?"
qa = RetrievalModel(retriever=db.as_retriever(k=5), with_sources=True)
result = qa.run(query)

# Step 6: Evaluate the result
eval_chain = QAOpenEvalChain.from_llm(llm=OpenAI(temperature=0))
example = {"query": query, "context": result.context, "result": result.answer}
eval_result = eval_chain.evaluate([example])
