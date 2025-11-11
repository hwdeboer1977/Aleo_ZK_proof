# ProofOfCare - Zero-Knowledge Identity Verification

A privacy-preserving identity verification system for humanitarian aid organizations using zero-knowledge proofs and encrypted credential storage.

## Overview

ProofOfCare enables refugees and displaced persons to prove their eligibility for humanitarian aid **without revealing their sensitive personal information**. Built on Aleo's zero-knowledge architecture with secure backend storage, it ensures complete privacy while maintaining cryptographic proof of eligibility.

## Features

- 🔐 **Zero-Knowledge Proofs**: Verify age, region, displacement status without exposing personal data
- ⛓️ **Aleo Blockchain**: Leverages Aleo's privacy-first L1 blockchain for ZK execution
- 🔑 **Dynamic Wallet Integration**: Seamless wallet onboarding and authentication
- 🗄️ **Secure Backend Storage**: Encrypted PII storage with access control
- 🎯 **Privacy-First**: Only verification results visible to aid organizations
- 🌍 **Humanitarian Focus**: Designed for refugee and IDP verification

## Tech Stack

### ZK Proof Layer

- **Aleo** - Privacy-preserving blockchain for zero-knowledge execution
- **Leo** - Domain-specific language for zero-knowledge applications

### Authentication & Identity

- **Dynamic Labs** - Multi-wallet authentication and onboarding
- **Backend API** - Secure PII storage with validation

### Future Integrations (Planned)

- **Privy** - End-to-end encrypted credential storage
- **Polygon ID** - Verifiable credentials and decentralized identity
- **Other providers** - Extensible architecture for additional storage solutions

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

## Project Structure

```
ProofOfCare/
├── leo/
│   └── zk_humanity_link_all_checks/
│       ├── src/
│       │   └── main.leo              # Aleo ZK proof program
│       └── program.json
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── prove/                # ZK proof API
│   │   │   └── store/                # PII storage API
│   │   ├── page.tsx                  # Main UI
│   │   └── providers.tsx             # Dynamic provider
│   └── constants/
│       └── humanity-link-codes.js    # Status code mappings
└── README.md
```

## Quick Start

### Prerequisites

- [Leo](https://developer.aleo.org/leo/) installed
- Node.js 18+ and npm

### Run ZK Proofs Locally

```bash
cd leo/zk_humanity_link_all_checks

# Test age verification (≥18)
leo run prove_age 2000u16 2025u16 18u16
# Output: • true

# Test region verification (Netherlands = 528)
leo run prove_region 528u16 528u16
# Output: • true

# Test displacement status (Refugee = 3)
leo run prove_displacement_status 3u16 3u16
# Output: • true
```

### Run Frontend Application

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

### User Flow

1. **Authentication**: User connects wallet via Dynamic
2. **ZK Proof Generation**:
   - User enters private characteristics (age, region, status)
   - Leo generates zero-knowledge proofs
   - Only boolean results (✅/❌) are revealed
3. **PII Storage**:
   - User optionally stores contact info (name, phone, address)
   - Data encrypted and stored via secure backend API
   - User controls who can access this data
4. **Verification**:
   - Aid organizations see: "Anonymous user is eligible refugee"
   - Organizations cannot see identity until user grants permission

## Zero-Knowledge Verification

The Leo program proves statements like:

```
age ≥ 18
region = Netherlands
displacement_status = refugee
```

**What's revealed**: Boolean verification results  
**What remains private**: Exact age, birth year, precise location, identity

## Available Verification Checks

### Identity Checks

- ✅ Age verification (≥ minimum age)
- ✅ Region/country verification (ISO 3166-1 codes)
- ✅ Multi-region checks

### Humanitarian Checks

- ✅ Displacement status (IDP, refugee, asylum seeker, etc.)
- ✅ Household size verification
- ✅ Vulnerability status (elderly, disabled, unaccompanied minor, etc.)
- ✅ Housing status (homeless, camp, shelter, etc.)
- ✅ Food security level
- ✅ Time-based eligibility (anti-fraud)

### Employment & Income

- ✅ Employment status verification
- ✅ Income range verification
- ✅ Work history verification

## PII Storage Architecture

### Current Implementation (MVP)

```
Frontend → Backend API → In-Memory Storage
                      ↓
                   (Demo only - data lost on restart)
```

**Backend API Features:**

- ✅ POST /api/store - Store encrypted PII
- ✅ GET /api/store?wallet=... - Retrieve PII
- ✅ PUT /api/store - Update PII
- ✅ DELETE /api/store?wallet=... - Delete PII (GDPR)
- ✅ Input validation & error handling

### Future Production Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                 │
│  - Dynamic (wallet auth)            │
│  - Aleo (ZK proofs)                 │
└────────────┬────────────────────────┘
             │
             │ Encrypted API calls
             ▼
┌─────────────────────────────────────┐
│  Backend API (Next.js)              │
│  - Validation                       │
│  - Access control                   │
│  - Rate limiting                    │
└────────────┬────────────────────────┘
             │
             │ Multiple storage options
             ▼
┌─────────────────────────────────────┐
│  Storage Layer (Choose One)         │
│                                     │
│  Option 1: Privy                    │
│  - End-to-end encryption            │
│  - Built-in key management          │
│                                     │
│  Option 2: Polygon ID               │
│  - Verifiable credentials           │
│  - Self-sovereign identity          │
│                                     │
│  Option 3: Supabase + Encryption    │
│  - PostgreSQL database              │
│  - Row-level security               │
│  - Custom encryption layer          │
└─────────────────────────────────────┘
```

**Integration Status:**

- ✅ Backend API working (in-memory demo)
- 🚧 Privy integration (planned - encrypted vault)
- 🚧 Polygon ID integration (planned - verifiable credentials)
- 🚧 Database migration (planned - Supabase/PostgreSQL)

## Use Cases

### Humanitarian Aid

- 🏕️ Refugee camp registration without identity exposure
- 🍲 Food distribution eligibility verification
- 🏠 Housing assistance qualification
- 💰 Emergency cash transfers
- 🏥 Medical aid eligibility

### Privacy Benefits

- Anonymous eligibility screening
- Cross-organization coordination without data sharing
- Protection for vulnerable populations
- GDPR-compliant data handling

## Architecture Vision

ProofOfCare combines three layers for "interoperability without exposure":

### 1. Zero-Knowledge Execution (Aleo)

Proves eligibility claims without revealing underlying data

### 2. Authentication & Coordination (Dynamic)

Manages wallet-based authentication across multiple aid organizations

### 3. Encrypted Storage (Future: Privy/Polygon ID)

Stores sensitive PII with user-controlled access:

- **Privy**: Server-side encrypted vault with key management
- **Polygon ID**: Self-sovereign identity with verifiable credentials
- **Custom**: Database with application-level encryption

## Development Roadmap

### ✅ Phase 1: MVP (Current)

- [x] Basic ZK proof generation (age)
- [x] Frontend with wallet integration
- [x] Backend API for PII storage
- [x] In-memory storage (demo)

### 🚧 Phase 2: Enhanced Proofs

- [x] Multi-attribute verification (region, status, etc.)
- [x] Humanitarian-specific checks
- [x] Status code mappings (ISO standards)
- [ ] Testnet deployment

### 📋 Phase 3: Production Storage

- [ ] Integrate Privy encrypted vault
- [ ] OR integrate Polygon ID credentials
- [ ] Database migration (Supabase/PostgreSQL)
- [ ] Encryption layer
- [ ] Access control system

### 📋 Phase 4: Multi-Organization

- [ ] Organization onboarding
- [ ] Access request workflows
- [ ] Time-limited permissions
- [ ] Audit logging
- [ ] Analytics dashboard

## Environment Setup

```bash
# Frontend
cd frontend
cp .env.example .env.local

# Required variables:
NEXT_PUBLIC_DYNAMIC_ENV_ID=your_dynamic_env_id

# Future (when integrated):
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
# OR
POLYGON_ID_ISSUER=your_polygon_id_issuer
```

## Security Considerations

### Current Demo

⚠️ In-memory storage - data lost on restart  
⚠️ No encryption at rest  
⚠️ No rate limiting  
⚠️ No authentication on API endpoints

### Production Requirements

✅ Database persistence (Supabase/PostgreSQL)  
✅ End-to-end encryption (Privy/Polygon ID/Custom)  
✅ API authentication & authorization  
✅ Rate limiting & DDoS protection  
✅ GDPR compliance (data deletion, access logs)  
✅ Audit trails for sensitive operations

## Resources

- [Aleo Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://developer.aleo.org/leo/)
- [Dynamic Labs Docs](https://docs.dynamic.xyz/)
- [Privy Documentation](https://docs.privy.io/)
- [Polygon ID Documentation](https://devs.polygonid.com/)

## Contributing

This project is in active development. Contributions, suggestions, and feedback are welcome!

## License

MIT

## Contact

For questions about ProofOfCare or privacy-preserving verification systems for humanitarian aid, please reach out.

---

**Privacy-First Aid Distribution** 🔐  
**Empowering Dignity Through Zero-Knowledge** 🌍
