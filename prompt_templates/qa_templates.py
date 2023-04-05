SEARCH_PROMPT = """
    Use the following pieces of context to answer the question at the end. 
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Return answers as they appear in the document.

    Context:
    {context}
    Question:
    {question}
    Answer:"""

PER_DOC_PROMPT = """
    Use the following pieces of context to answer the question at the end. 
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    {format_instructions}
    
    Context:
    {context}
    Question:
    {question}
    Answer:"""