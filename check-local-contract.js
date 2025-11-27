console.log("🚀 Starting contract check script...");

const { ethers } = require("ethers");

async function checkLocalContract() {
  console.log("📝 Function called...");
  try {
    console.log("🔍 Checking local contract deployment...");
    console.log("🌐 Attempting to connect to localhost:8545...");

    // Connect to local Hardhat node
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    console.log(`📍 Checking contract at: ${contractAddress}`);

    // First check if we can connect to the provider
    console.log("🔗 Testing connection to Hardhat node...");
    const network = await provider.getNetwork();
    console.log(`✅ Connected! Network: ${network.name} (Chain ID: ${network.chainId})`);

    const blockNumber = await provider.getBlockNumber();
    console.log(`📊 Latest block: ${blockNumber}`);

    // Check if contract exists
    console.log("🔍 Checking contract bytecode...");
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.error("❌ Contract not found at this address!");
      console.log("🔄 The contract may need to be redeployed.");
      console.log("Run: node scripts/deploy-local.js");
      return false;
    }

    console.log("✅ Contract found!");
    console.log(`📏 Contract bytecode length: ${code.length} bytes`);

    return true;

  } catch (error) {
    console.error("❌ Check failed:", error.message);

    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      console.error("\n💡 Hardhat node is not running!");
      console.log("Start it with: npx hardhat node");
    } else if (error.code === 'NETWORK_ERROR' || error.message.includes('network')) {
      console.error("\n💡 Cannot connect to local network!");
      console.log("Make sure Hardhat node is running on localhost:8545");
    } else {
      console.error("\n💡 Unknown error occurred");
    }

    return false;
  }
}

checkLocalContract().then((isValid) => {
  if (isValid) {
    console.log("\n🎉 Local contract verification PASSED!");
    console.log("Your frontend should be able to connect to the local contract.");
  } else {
    console.log("\n❌ Local contract verification FAILED!");
    console.log("You may need to redeploy the contract or start the Hardhat node.");
  }
});
