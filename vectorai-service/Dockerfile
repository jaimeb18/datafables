FROM python:3.11-slim

WORKDIR /app

# Download the wheel from the GitHub repo
RUN pip install --no-cache-dir requests && \
    python -c "import requests; r = requests.get('https://github.com/hackmamba-io/actian-vectorAI-db-beta/raw/main/actiancortex-0.1.0b1-py3-none-any.whl'); open('actiancortex-0.1.0b1-py3-none-any.whl','wb').write(r.content)"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir numpy grpcio-tools && \
    pip install --no-cache-dir --no-deps actiancortex-0.1.0b1-py3-none-any.whl && \
    pip install --no-cache-dir "protobuf>=5.31.1"

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
