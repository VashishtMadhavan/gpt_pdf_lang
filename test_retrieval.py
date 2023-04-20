from langchain import OpenAI
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from evaluate.open_eval_chain import QAOpenEvalChain
from models.retrieval import RetrievalModel
from vector_store import VectorStoreWrapper

## Step 1: Load in data
faiss_path = "examples_index"
loader = DirectoryLoader(path="examples/", glob="*.pdf", loader_cls=PyPDFLoader)
docs = loader.load()

## Step 2: Split/Preprocess doc
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=3000, separators=["\n \n", "\n\n", "\n", " ", ""]
)
split_docs = text_splitter.split_documents(docs)

## Step 3: Embed docs and create index
db = VectorStoreWrapper(load_path=faiss_path).get_index(split_docs)

## Step 5: Ask a question against the index using a QA chain
query = "What is the name of the company?"
model = RetrievalModel(
    retriever=db.as_retriever(search_kwargs={"k": 5}), with_sources=True
)
result = model.run(query)
print(f"Result: {result}")


# Step 6: Evaluate the result
eval_chain = QAOpenEvalChain.from_llm(llm=OpenAI(temperature=0))
example = {"query": query, "context": result.context, "result": result.answer}
eval_result = eval_chain.evaluate([example])
print(f"Eval Result: {eval_result}")
