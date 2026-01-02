# PharmaOps Platform

Unified pharmaceutical operations stack combining regulatory document control, multi-supplier supply-chain telemetry, AI assistance, and blockchain-backed provenance.

## Repository layout

- `frontend/` – React 18 + TypeScript dashboard with Redux Toolkit, React Query, Material UI, Mapbox, PDF.js
- `backend/` – Node.js (Express + TypeScript) API with PostgreSQL/TypeORM, Redis, Kafka, JWT auth, Swagger, Jest tests
- `ml-service/` – FastAPI microservice placeholder for NLP models (Transformers, MLflow hooks)
- `blockchain/` – Hardhat workspace with Solidity smart contract anchoring document and shipment events on Hyperledger Besu
- `infra/` – Docker Compose baseline for local orchestration (Postgres, Redis, Kafka, services)

## Quick start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# ML service
cd ml-service && python -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt && uvicorn app.main:app --reload

# Blockchain
cd blockchain && npm install && npx hardhat compile
```

Environment variables (API URLs, DB creds, Mapbox token, JWT secret, Kafka brokers, etc.) can be managed via `.env` files in each package. See `infra/docker-compose.yml` for an end-to-end local stack blueprint.

