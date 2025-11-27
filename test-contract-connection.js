const { ethers } = require("ethers");

async function testContractConnection() {
  try {
    console.log("🔍 Testing contract connection...");

    // Sepolia RPC URL
    const INFURA_API_KEY = "b18fb7e6ca7045ac83c41157ab93f990";
    const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
    const CONTRACT_ADDRESS = "0xF6ef3a0D13D0F71cA66e28Ca84e9f23f119B4007";

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    console.log("📡 Connected to Sepolia via Infura");

    // Check if contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      throw new Error("❌ Contract not found at the specified address");
    }
    console.log("✅ Contract code found at address:", CONTRACT_ADDRESS);

    // Get contract balance
    const balance = await provider.getBalance(CONTRACT_ADDRESS);
    console.log("💰 Contract balance:", ethers.formatEther(balance), "ETH");

    // Get latest block
    const blockNumber = await provider.getBlockNumber();
    console.log("📊 Latest block number:", blockNumber);

    console.log("🎉 Contract connection test PASSED!");
    console.log("🔗 Contract is live on Sepolia:", `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`);

  } catch (error) {
    console.error("❌ Contract connection test FAILED:", error.message);
    process.exit(1);
  }
}

testContractConnection();
