from fastapi import FastAPI
from pydantic import BaseModel


class DocumentPayload(BaseModel):
    content: str
    language: str = "en"


class ClassificationResponse(BaseModel):
    category: str
    confidence: float


class ExtractFieldsResponse(BaseModel):
    country: str | None = None
    product: str | None = None
    expiry_date: str | None = None


class ShipmentPayload(BaseModel):
    product: str
    origin: str
    destination: str
    status: str


class ShipmentRiskResponse(BaseModel):
    riskScore: float
    explanation: str | None = None


app = FastAPI(title="PharmaOps ML Service", version="0.1.0")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/classify", response_model=ClassificationResponse)
async def classify_document(payload: DocumentPayload):
    # Placeholder: real model would be loaded via transformers + MLflow tracking
    mock_category = "submission" if "submission" in payload.content.lower() else "sop"
    return {"category": mock_category, "confidence": 0.78}


@app.post("/extract-fields", response_model=ExtractFieldsResponse)
async def extract_fields(payload: DocumentPayload):
    # Stub implementation; real version would run NER/regex over the content
    return ExtractFieldsResponse(country=None, product=None, expiry_date=None)


@app.post("/predict-risk", response_model=ShipmentRiskResponse)
async def predict_risk(payload: ShipmentPayload):
    # Stub implementation; later this will use a trained model
    base_risk = 0.2
    if payload.status.lower() == "delayed":
        base_risk = 0.7
    elif payload.status.lower() == "exception":
        base_risk = 0.9
    return ShipmentRiskResponse(riskScore=base_risk, explanation="Heuristic risk score based on status")

