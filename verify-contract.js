const { ethers } = require("ethers");

async function verifyContract() {
  try {
    console.log("🔍 Verifying contract deployment...");

    const INFURA_API_KEY = "b18fb7e6ca7045ac83c41157ab93f990";
    const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
    const CONTRACT_ADDRESS = "0xF6ef3a0D13D0F71cA66e28Ca84e9f23f119B4007";

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

    console.log(`📍 Checking contract at: ${CONTRACT_ADDRESS}`);

    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      console.error("❌ Contract not found at this address!");
      console.log("🔄 The contract may need to be redeployed.");
      return false;
    }

    console.log("✅ Contract found!");
    console.log(`📏 Contract bytecode length: ${code.length} bytes`);
    console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`);

    // Try to get the contract deployment transaction
    try {
      const tx = await provider.getTransaction("0x71af406547cd916910c2006f514136c027fc30958ec7a1b28238a8429503ecba");
      if (tx) {
        console.log("✅ Deployment transaction confirmed!");
        console.log(`📅 Deployed at block: ${tx.blockNumber}`);
      }
    } catch (e) {
      console.log("⚠️  Could not verify deployment transaction");
    }

    return true;

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return false;
  }
}

verifyContract().then((isValid) => {
  if (isValid) {
    console.log("\n🎉 Contract verification PASSED!");
    console.log("Your frontend should now be able to connect to the contract.");
  } else {
    console.log("\n❌ Contract verification FAILED!");
    console.log("You may need to redeploy the contract.");
  }
});