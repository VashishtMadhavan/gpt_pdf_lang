import json
from typing import Any, Dict

from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pydantic import create_model

from models.extractor import ExtractionModel
from models.retrieval import RetrievalModel
from vector_store import VectorStoreWrapper

FAISS_PATH = "examples_index"

loader = DirectoryLoader(path="examples/", glob="*.pdf", loader_cls=PyPDFLoader)
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=3000, separators=["\n \n", "\n\n", "\n", " ", ""]
)
split_docs = text_splitter.split_documents(docs)
db = VectorStoreWrapper(load_path=FAISS_PATH).get_index(split_docs)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Replace with your frontend app's URL
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/pdf")
def get_pdf(url: str) -> Response:
    """Serve a PDF file from a URL.

    Args:
        url (str): The url of the PDF file.

    Returns:
        response: File response for Fast API.
    """
    filename = url.split("/")[-1]
    with open(url, "rb") as f:
        pdf = f.read()
    response = Response(content=pdf, media_type="application/pdf")
    response.headers["Content-Disposition"] = f"attachment;filename={filename}"
    return response


@app.get("/search")
def search(query: str) -> Dict[str, Any]:
    """Run retrieval model on a query.

    Args:
        query (str): The question to ask the LLM

    Returns:
        Dict: The response of search in the db
    """
    qa = RetrievalModel(
        retriever=db.as_retriever(search_kwargs={"k": 5}), with_sources=True
    )
    result = qa.run(query)
    return {
        "answer": result.answer,
        "items": result.source_docs,
    }


@app.get("/extract")
def extract(entity_json: str) -> Dict[str, Any]:
    """Run extraction model on a set of documents

    Args:
        entity_json (str): JSON string outlining entities to extract

    Returns:
        response: File response for Fast API.
    """
    entities = json.loads(entity_json)

    # Creating a new pydantic object from the entity
    format_model = create_model("FormatModel", **entities)

    extractor = ExtractionModel(format_model=format_model)
    results = extractor.run(docs)

    # Generate a CSV file
    csv_file = extractor.generate_csv(entities, results)

    return StreamingResponse(csv_file, media_type="text/csv", headers={
        'Content-Disposition': 'attachment; filename=export.csv'
    })
