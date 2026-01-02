# PharmaOps Platform

A comprehensive pharmaceutical operations management system that integrates regulatory compliance, supply chain tracking, AI-powered analytics, and blockchain-based provenance to ensure end-to-end transparency and efficiency in pharmaceutical distribution.

##  Features

- **Regulatory Document Management**: Secure handling and tracking of all regulatory documents with audit trails
- **Multi-Supplier Supply Chain Telemetry**: Real-time monitoring of shipments across multiple vendors
- **AI-Powered Analytics**: Machine learning models for predictive analytics and document processing
- **Blockchain Provenance**: Immutable tracking of drug provenance using smart contracts
- **Role-Based Access Control**: Separate dashboards for Admins, Vendors, Auditors, and QA teams
- **Real-time Notifications**: Event-driven architecture with Kafka for instant updates
- **Interactive Dashboards**: Modern React-based UI with maps, charts, and document viewers

## Architecture

### Frontend

- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit + React Query
- **UI Library**: Material UI
- **Maps**: Mapbox integration
- **Document Viewer**: PDF.js

### Backend

- **Runtime**: Node.js with Express + TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis for session and data caching
- **Message Queue**: Kafka for event streaming
- **Authentication**: JWT-based auth with role management
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest for unit and integration tests

### ML Service

- **Framework**: FastAPI (Python)
- **Models**: Transformers for NLP tasks
- **MLflow**: Experiment tracking and model management

### Blockchain

- **Framework**: Hardhat
- **Smart Contracts**: Solidity
- **Network**: Hyperledger Besu compatibility
- **Features**: Document anchoring and shipment event tracking

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose for local development
- **Databases**: PostgreSQL, Redis
- **Message Broker**: Kafka

## Repository Structure

```
PharmaOps/
├── frontend/          # React TypeScript dashboard
├── backend/           # Node.js API server
├── ml-service/        # Python ML microservice
├── blockchain/        # Solidity smart contracts
├── infra/            # Docker orchestration
├── .gitignore        # Git ignore rules
├── package.json      # Root package management
└── README.md         # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)
- Kafka (or use Docker)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sarvesha91/PharmaOps-1.git
   cd PharmaOps
   ```

2. **Environment Setup**

   ```bash
   # Copy environment files and configure
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp ml-service/.env.example ml-service/.env
   ```

3. **Start Infrastructure**

   ```bash
   cd infra
   docker-compose up -d
   ```

4. **Install Dependencies & Start Services**

   **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Backend:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   **ML Service:**

   ```bash
   cd ml-service
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

   **Blockchain:**

   ```bash
   cd blockchain
   npm install
   npx hardhat compile
   npx hardhat node  # For local development
   ```

## 🔧 Configuration

Environment variables are managed via `.env` files in each service directory. Key configurations include:

- Database connection strings
- JWT secrets
- API keys (Mapbox, external services)
- Kafka broker URLs
- Redis connection details
- ML model endpoints

## 📊 Usage

### User Roles & Dashboards

1. **Admin Dashboard**: System-wide oversight, user management, compliance monitoring
2. **Vendor Dashboard**: Order management, document submission, shipment tracking
3. **Auditor Dashboard**: Document verification, audit trail review
4. **QA Dashboard**: Quality control checks, approval workflows

### API Documentation

Once the backend is running, visit `http://localhost:3001/api-docs` for Swagger documentation.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Integration tests
cd backend && npm run test:integration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

## 🔄 CI/CD

The project includes GitHub Actions workflows for:

- Automated testing
- Code quality checks
- Docker image building
- Deployment pipelines

---

**Built with ❤️ for transparent and efficient pharmaceutical operations**
