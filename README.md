🎥 **Demo Video**: [Watch the HealLock Demo](https://github.com/NathanGunther/heal-lock-chain/blob/main/heal-lock.mp4)

🌐 **Live Demo**: [Try HealLock on Vercel](https://heal-lock.vercel.app/)

---

# HealLock - Encrypted Mental Health Diary

A privacy-preserving mental health tracking application using Fully Homomorphic Encryption (FHE) on the blockchain.

## Features

- 🔒 **Fully Encrypted**: All mental health data is encrypted using FHE before being stored on-chain
- 🔐 **Private**: Only you can decrypt and view your own data
- 📊 **Analytics**: Encrypted computation of weekly averages, stress trends, and abnormal changes
- 🌐 **Decentralized**: Data stored on Ethereum blockchain (Sepolia testnet or local network)

## Tech Stack

- **Smart Contracts**: Solidity with FHEVM integration
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Wallet Integration**: RainbowKit for secure Web3 connection
- **Homomorphic Encryption**: Zama FHEVM for privacy-preserving computations
- **Build Tools**: Hardhat for contract development and testing

## Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- Hardhat with FHEVM plugin
- Rainbow wallet browser extension

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   
   Create `frontend/.env.local`:
   ```env
   VITE_CONTRACT_ADDRESS=your_contract_address_here
   ```

## Development

### 1. Compile Contracts

```bash
npm run compile
```

### 2. Run Tests

**Local tests (with mock FHEVM)**:
```bash
npm test
```

**Sepolia testnet tests**:
```bash
npm run test:sepolia
```

### 3. Deploy Contracts

**Deploy to local network**:
```bash
# First, start Hardhat node with FHEVM support
npx hardhat node

# In another terminal, deploy
npm run deploy
```

**Deploy to Sepolia**:
```bash
npm run deploy:sepolia
```

After deployment, update `frontend/.env.local` with the contract address.

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the top right and connect with Rainbow wallet
2. **Log Entry**: 
   - Select a date
   - Set your mental state score (0-100)
   - Set your stress level (0-100)
   - Click "Log Entry" to encrypt and store on-chain
3. **View & Decrypt**: 
   - Select a date with an existing entry
   - Click "Decrypt Entry" to view your encrypted data

## Contract Functions

### Core Functions
- `addEntry(date, encryptedMentalStateScore, encryptedStressLevel, ...)` - Add a new encrypted entry
- `getEntry(user, date)` - Get encrypted entry data
- `getMentalStateScore(user, date)` - Get encrypted mental state score
- `getStressLevel(user, date)` - Get encrypted stress level
- `entryExists(user, date)` - Check if entry exists

### Analytics Functions (Encrypted Computation)
- `calculateWeeklyAverage(user, startDate)` - Calculate weekly average mental health score
- `isStressIncreased(user, currentDate, previousDate)` - Check if stress increased
- `isAbnormalChange(user, currentDate, previousDate)` - Detect abnormal changes (>20 difference)

## Security & Privacy

- **End-to-End Encryption**: All mental health data is encrypted using FHE before blockchain storage
- **Decentralized Control**: Users maintain full ownership and decryption rights over their data
- **Zero-Knowledge Proofs**: FHE enables privacy-preserving analytics without exposing raw data
- **Wallet-Based Security**: Private keys remain securely managed by user wallets
- **Audit Trail**: All transactions are immutably recorded on the blockchain

## License

MIT

