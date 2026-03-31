FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip3 install fastapi uvicorn

CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]