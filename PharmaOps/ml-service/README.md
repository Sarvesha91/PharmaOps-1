# PharmaOps ML Service

Lightweight FastAPI microservice that will host NLP models responsible for document classification, key field extraction, and supply risk predictions.

## Local development

```bash
python -m venv .venv
.venv\Scripts\activate  # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

MLflow tracking URIs, model artifact paths, and GPU-specific dependencies will be added as the modeling workstream progresses.

