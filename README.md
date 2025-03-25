# MLM DApp

A decentralized Multi-Level Marketing (MLM) application built with Next.js, Ethers.js, and Solidity. This DApp allows users to participate in a referral system where they can earn rewards for bringing in new members.

## Features

- Wallet Connection via MetaMask
- Account Activation with BNB
- Referral System
- Earnings Tracking
- Referral Link Generation and Sharing
- Real-time Updates

## Prerequisites

- Node.js v23 or later
- MetaMask wallet extension
- BNB for activation (on Binance Smart Chain)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mlm
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your configuration:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_CHAIN_ID=56 # BSC Mainnet
```

4. Start the development server:
```bash
npm run dev
```

## Smart Contract Integration

The DApp interacts with a Solidity smart contract deployed on the Binance Smart Chain. The contract handles:

- Account activation
- Referral tracking
- Reward distribution
- User status management

## Usage

1. Connect your MetaMask wallet
2. If you have a referral link, use it to join
3. Activate your account by paying the activation fee (0.1 BNB)
4. Share your referral link with others
5. Earn rewards when your referrals join and activate their accounts

## Development

The project uses:

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Ethers.js for blockchain interactions
- MetaMask for wallet connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
