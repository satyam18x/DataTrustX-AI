# DataTrustX: High-Veracity AI Data Marketplace 🛡️📊

DataTrustX is a sophisticated, end-to-end marketplace designed for the secure exchange of high-veracity AI training datasets. It combines a professional negotiation "Handshake" protocol with autonomous ML-based veracity validation to ensure that buyers only pay for high-quality, verified data assets.

---

### 🌐 Live Demo
**Frontend:** https://datatrusx-ai.vercel.app/  
**Backend API:** https://datatrustx-ai-y6ze.onrender.com  
**API Documentation:** https://datatrustx-ai-y6ze.onrender.com/docs

## 🚀 Key Features

### 🛡️ Autonomous Veracity Validation
Datasets are automatically audited by our **Neural Veracity Engine** before payment is released.
- **Deep-Scan Pipeline**: Checks for duplicate IDs, missing values, data type consistency, and statistical outliers.
- **Twin Validation**: Compares candidate datasets against reference benchmarks to detect behavior matching and risk levels.
- **Trust Score**: Every asset is assigned a real-time veracity percentage to guide buyer confidence.

### 🤝 Strategic Handshake Protocol
A multi-stage negotiation lifecycle for custom data requests:
- **RFPs (Request for Proposals)**: Buyers post specific data needs.
- **Offers & Counter-Offers**: Sellers propose data assets with custom pricing.
- **Escrow-Gated Delivery**: Secure "Pay-to-Unlock" mechanism ensures fair exchange.

### 📈 Neural Veracity Hub
A professional, enterprise-grade AI analytics dashboard for buyers to inspect dataset quality:
- **Interactive Gauges**: Real-time visualization of trust scores.
- **Breakdown Analytics**: Detailed reports on schema drift, redundancy, and data quality.
- **AI Recommendations**: Actionable insights provided by the validation engine.

### 🔐 Secure Escrow Lifecycle
- **Verify-Before-Buy**: Buyers can view comprehensive ML audit reports before committing funds.
- **Encrypted Delivery**: Raw assets remain locked until the escrow payment is confirmed.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Python, FastAPI, Pydantic |
| **ML Engine** | Pandas, Scikit-learn, Custom Statistical Validators |
| **Database** | SQLite (Development), SQLAlchemy ORM |
| **API** | RESTful Architecture with JWT Authentication |

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```bash
   # The database (datatrustx.db) will be auto-created on first run
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture Overview

The system operates on a **De-coupled Validation Architecture**:
1. **Seller** uploads a dataset to a secure staging area.
2. **ML Validator** runs an isolated audit and generates a `validation_result` JSON.
3. **Buyer** reviews the **Veracity Dashboard** generated from the audit logs.
4. **Escrow Service** handles the transaction and unlocks the secure download link upon successful payment.

---

## 🤝 Contributing

DataTrustX is built for the future of decentralized AI data exchange. We welcome contributions to our validation modules and UI/UX components.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by the DataTrustX Team for Code Nakshatra II*
