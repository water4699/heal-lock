// Contract addresses for different networks
// This file is automatically updated after deployment

export const CONTRACT_ADDRESSES = {
  // Local Hardhat network (chainId: 31337) - Updated with FHE permissions
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",

  // Sepolia testnet (chainId: 11155111)
  sepolia: "0xF6ef3a0D13D0F71cA66e28Ca84e9f23f119B4007",
} as const;

// Get contract address for current network
export function getContractAddress(chainId: number): string | undefined {
  switch (chainId) {
    case 31337:
      return CONTRACT_ADDRESSES.localhost;
    case 11155111:
      return CONTRACT_ADDRESSES.sepolia;
    default:
      return undefined;
  }
}

// Export default address (will be set by environment variable or from above)
export const DEFAULT_CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  getContractAddress(31337) ||
  CONTRACT_ADDRESSES.sepolia;
