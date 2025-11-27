const { ethers } = require("ethers");

async function main() {
  try {
    console.log("Starting Sepolia deployment...");

    // Sepolia RPC URL - you might need to get this from environment variables
    const INFURA_API_KEY = process.env.INFURA_API_KEY || "b18fb7e6ca7045ac83c41157ab93f990";
    const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;

    // Create provider
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    console.log("Connected to Sepolia");

    // Get private key from environment
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("No private key found. Please set SEPOLIA_PRIVATE_KEY or PRIVATE_KEY environment variable.");
    }

    // Create wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Using account:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.01")) {
      console.error("Insufficient balance. Need at least 0.01 ETH on Sepolia");
      console.error("Get test ETH from: https://sepoliafaucet.com/");
      process.exit(1);
    }

    // Contract bytecode and ABI - we'll need to get these
    console.log("Note: This script needs contract bytecode. Please use Hardhat for full deployment.");
    console.log("For now, please deploy manually using:");
    console.log("npx hardhat deploy --network sepolia");

  } catch (error) {
    console.error("Sepolia deployment failed:", error);
    process.exit(1);
  }
}

main();
