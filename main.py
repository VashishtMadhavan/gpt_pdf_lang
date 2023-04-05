from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from models.retrieval import RetrievalModel
from vector_store import VectorStoreWrapper

loader = DirectoryLoader(path="examples/", glob="*.pdf", loader_cls=PyPDFLoader)
faiss_path = "examples_index/"
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000,  separators=["\n \n","\n\n", "\n", " ", ""])
split_docs = text_splitter.split_documents(docs)
db = VectorStoreWrapper(load_path=faiss_path).get_index(split_docs)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pdf")
def get_pdf(url: str):
    filename = url.split("/")[-1]
    with open(url, "rb") as f:
        pdf = f.read()
    response = Response(content=pdf, media_type="application/pdf")
    response.headers["Content-Disposition"] = f"attachment;filename={filename}"
    return response


@app.get("/search")
def qa(query: str):
    qa = RetrievalModel(retriever=db.as_retriever(search_kwargs={"k": 5}),
                        with_sources=True)
    result = qa.run(query)
    return {"message": result.answer,
            "page_id": result.page_id,
            "char_offset": result.char_offset,
            "items": result.source_docs}


# TODO: Create an upload router for files