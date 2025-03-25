export const config = {
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '56'),
  chainName: 'Binance Smart Chain',
  activationFee: '0.1', // BNB
  rpcUrls: {
    56: 'https://bsc-dataseed.binance.org',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // Testnet
  },
  blockExplorers: {
    56: 'https://bscscan.com',
    97: 'https://testnet.bscscan.com',
  },
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
}; 