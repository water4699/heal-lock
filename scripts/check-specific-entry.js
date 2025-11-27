const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Checking specific entry for address 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199...");

  // Connect to local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  // Load contract artifacts
  const contractPath = path.join(__dirname, "../artifacts/contracts/EncryptedMentalHealthDiary.sol/EncryptedMentalHealthDiary.json");
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));

  // Get contract instance
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const contract = new ethers.Contract(contractAddress, contractArtifact.abi, provider);

  // Target address and date
  const targetAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  const targetDate = 20418; // 2025-11-26

  console.log(`🔍 Checking address: ${targetAddress}`);
  console.log(`📅 Checking date: ${targetDate} (2025-11-26)`);

  try {
    // Check entry count
    const entryCount = await contract.getEntryCount(targetAddress);
    console.log(`📊 Entry count for address: ${entryCount}`);

    // Check if entry exists
    const exists = await contract.entryExists(targetAddress, targetDate);
    console.log(`✅ Entry exists: ${exists}`);

    if (exists) {
      console.log("🎉 Entry found! Trying to get encrypted data...");

      // Try to get the encrypted entry
      const entry = await contract.getEntry(targetAddress, targetDate);
      console.log("🔐 Encrypted mental state:", entry[0]);
      console.log("🔐 Encrypted stress:", entry[1]);
      console.log("⏰ Timestamp:", new Date(Number(entry[2]) * 1000).toISOString());

      // Try individual getters
      const mentalState = await contract.getMentalStateScore(targetAddress, targetDate);
      const stress = await contract.getStressLevel(targetAddress, targetDate);
      console.log("🧠 Mental state handle:", mentalState);
      console.log("💭 Stress handle:", stress);

    } else {
      console.log("❌ Entry does not exist");

      // Check last entry date
      const lastEntryDate = await contract.getLastEntryDate(targetAddress);
      console.log(`📅 Last entry date: ${lastEntryDate}`);

      if (lastEntryDate > 0) {
        const lastEntryDateObj = new Date(1970, 0, 1);
        lastEntryDateObj.setDate(lastEntryDateObj.getDate() + lastEntryDate);
        console.log(`📅 Last entry date formatted: ${lastEntryDateObj.toISOString().split('T')[0]}`);
      }
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
