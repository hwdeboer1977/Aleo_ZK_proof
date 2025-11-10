# Aleo - Age Verification ZK Proof

A zero-knowledge proof system for privacy-preserving age verification using Aleo blockchain technology.

## Overview

This project demonstrates how to verify that a person is 18 years or older **without revealing their exact age or birth date**. Built on Aleo's zero-knowledge architecture, it ensures complete privacy while maintaining cryptographic proof of eligibility.

## Features

- 🔐 **Zero-Knowledge Proofs**: Verify age ≥ 18 without exposing birth year or exact age
- ⛓️ **Aleo Blockchain**: Leverages Aleo's privacy-first L1 blockchain
- 🔑 **Dynamic Wallet Integration**: Seamless wallet onboarding and authentication
- 🎯 **Privacy-First**: Only verification result (yes/no) is visible to third parties

## Tech Stack

### ZK Proof Layer
- **Aleo** - Privacy-preserving blockchain
- **Leo** - Domain-specific language for zero-knowledge applications

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Dynamic Labs** - Multi-wallet authentication and onboarding

## Project Structure

```
age_check/
├── src/
│   └── main.leo          # Aleo ZK proof program
├── frontend/
│   ├── app/              # Next.js app directory
│   └── package.json
├── program.json          # Leo program configuration
└── README.md
```

## Quick Start

### Prerequisites

- [Leo](https://developer.aleo.org/leo/) installed
- Node.js 18+ and npm

### Run ZK Proof Locally

```bash
# Test the age verification proof
leo run prove_is_adult 2000u16 2025u16
# Output: • true (age ≥ 18)

leo run prove_is_adult 2010u16 2025u16
# Output: • false (age < 18)
```

### Run Frontend Demo

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## How It Works

1. **User connects wallet** via Dynamic authentication
2. **User enters birth year** (private input)
3. **Leo generates ZK proof** comparing birth year to current year
4. **Verification result displayed** (✅ Age ≥ 18 or ❌ Age < 18)
5. **Privacy preserved**: Birth year and exact age remain private

## Zero-Knowledge Verification

The Leo program proves the statement:
```
current_year - birth_year ≥ 18
```

**What's revealed**: Boolean result (true/false)  
**What remains private**: Birth year, exact age

## Use Cases

- 🏥 Healthcare eligibility verification
- 💼 Unemployment insurance claims
- 🏛️ Government benefit programs
- 🔞 Age-restricted services
- 🆔 Privacy-preserving identity systems

## Architecture Vision

This proof-of-concept is part of **InsuranceX**, a larger privacy-preserving identity verification system combining:
- **Aleo**: Zero-knowledge execution layer
- **Dynamic**: Cross-agency authentication
- **Privy**: Encrypted credential storage

Together, they enable "interoperability without exposure" for government agencies and benefit providers.

## Development Status

🚧 **Early Stage / Proof of Concept**

- ✅ Local ZK proof generation working
- ✅ Frontend demo with wallet integration
- ⏳ Testnet deployment (pending network stability)
- 📋 Planned: Privy integration for encrypted storage

## Resources

- [Aleo Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://developer.aleo.org/leo/)
- [Dynamic Labs Docs](https://docs.dynamic.xyz/)

## License

MIT

## Contact

For questions about InsuranceX or privacy-preserving verification systems, please reach out.

---

**Built with privacy at its core** 🔐