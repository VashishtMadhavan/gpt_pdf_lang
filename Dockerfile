FROM python:3.9-alpine
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY ./client ./client
COPY ./evaluate ./evaluate
COPY ./examples ./examples
COPY ./models ./models
COPY ./prompt_templates ./prompt_templates
COPY ./main.py .
CMD [ "sh", "-c", "uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}"]