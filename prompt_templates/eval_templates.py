from langchain.prompts import PromptTemplate

template = """You are a teacher grading a quiz.
You are given a question, the student's answer, and the context the question is about. You are asked to score it as either CORRECT or INCORRECT.

Example Format:
QUESTION: question here
CONTEXT: context the question is about here
STUDENT ANSWER: student's answer here
GRADE: CORRECT or INCORRECT here

Please remember to grade them based on being factually accurate. Begin!

QUESTION: {query}
CONTEXT: {context}
STUDENT ANSWER: {result}
GRADE:"""
PROMPT = PromptTemplate(
    input_variables=["query", "context", "result"], template=template
)