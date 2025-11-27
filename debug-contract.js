// Debug script to help diagnose contract connection issues
const { ethers } = require("ethers");

async function debugContract() {
  const INFURA_API_KEY = "b18fb7e6ca7045ac83c41157ab93f990";
  const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
  const CONTRACT_ADDRESS = "0xF6ef3a0D13D0F71cA66e28Ca84e9f23f119B4007";

  console.log("🔧 Contract Connection Debug");
  console.log("============================");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Expected Network: Sepolia (Chain ID: 11155111)");
  console.log("");

  try {
    // Test Infura connection
    console.log("1. Testing Infura connection...");
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const network = await provider.getNetwork();
    console.log("   ✅ Connected to network:", network.name, "(Chain ID:", network.chainId.toString() + ")");

    // Test contract existence
    console.log("\n2. Checking contract deployment...");
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x" || code.length <= 2) {
      console.log("   ❌ Contract NOT found at this address");
      console.log("   📝 Possible issues:");
      console.log("      - Wrong network (should be Sepolia, not mainnet)");
      console.log("      - Contract was not deployed to this network");
      console.log("      - Contract address is incorrect");
    } else {
      console.log("   ✅ Contract found! Bytecode length:", code.length);
      console.log("   🔗 Etherscan: https://sepolia.etherscan.io/address/" + CONTRACT_ADDRESS);
    }

    // Test contract functionality
    console.log("\n3. Testing contract functionality...");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, [
      "function getEntryCount(address user) external view returns (uint256)"
    ], provider);

    try {
      // Try calling a view function (should work without signer)
      const testAddress = "0x0000000000000000000000000000000000000000";
      const count = await contract.getEntryCount(testAddress);
      console.log("   ✅ Contract functions work! Entry count for test address:", count.toString());
    } catch (error) {
      console.log("   ⚠️  Contract call failed:", error.message);
    }

  } catch (error) {
    console.log("❌ Debug failed:", error.message);
  }

  console.log("\n💡 Frontend Troubleshooting:");
  console.log("- Make sure your wallet is connected to Sepolia testnet");
  console.log("- Check browser console for any errors");
  console.log("- Ensure frontend server is restarted after .env changes");
  console.log("- Verify VITE_CONTRACT_ADDRESS in frontend/.env.local");
}

debugContract();
