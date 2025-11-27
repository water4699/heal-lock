console.log("🚀 Starting data check script...");
const { ethers } = require("ethers");

async function checkStoredData() {
  console.log("📝 Function called...");
  try {
    console.log("🔍 Checking stored data in contract...");

    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Contract ABI (minimal)
    const abi = [
      "function getEntryCount(address user) view returns (uint256)",
      "function getEntry(address user, uint256 date) view returns (bytes32, bytes32, uint256)",
      "function entryExists(address user, uint256 date) view returns (bool)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Check entry count for a test address
    const testAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // From logs
    console.log(`Checking data for address: ${testAddress}`);

    const entryCount = await contract.getEntryCount(testAddress);
    console.log(`Entry count: ${entryCount}`);

    if (entryCount > 0) {
      // Check the most recent entry (date = 1 from logs)
      const exists = await contract.entryExists(testAddress, 1);
      console.log(`Entry exists for date 1: ${exists}`);

      if (exists) {
        const [mentalHandle, stressHandle, timestamp] = await contract.getEntry(testAddress, 1);
        console.log("Retrieved data:");
        console.log(`  Mental state handle: ${mentalHandle}`);
        console.log(`  Stress handle: ${stressHandle}`);
        console.log(`  Timestamp: ${timestamp}`);

        // Check if handles are valid (not zero)
        const isMentalValid = mentalHandle !== "0x0000000000000000000000000000000000000000000000000000000000000000";
        const isStressValid = stressHandle !== "0x0000000000000000000000000000000000000000000000000000000000000000";

        console.log(`  Mental handle valid: ${isMentalValid}`);
        console.log(`  Stress handle valid: ${isStressValid}`);
      }
    }

  } catch (error) {
    console.error("❌ Check failed:", error.message);
  }
}

checkStoredData();
