const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Checking stored entries in EncryptedMentalHealthDiary contract...");

  // Connect to local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  // Load contract artifacts
  const contractPath = path.join(__dirname, "../artifacts/contracts/EncryptedMentalHealthDiary.sol/EncryptedMentalHealthDiary.json");
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));

  // Get contract instance
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  console.log(`🔗 Contract address: ${contractAddress}`);
  const contract = new ethers.Contract(contractAddress, contractArtifact.abi, provider);

  // Get all signers/accounts from Hardhat node
  const accounts = await provider.listAccounts();
  console.log(`👥 Available accounts: ${accounts.length}`);
  accounts.slice(0, 5).forEach((account, index) => {
    console.log(`  ${index}: ${typeof account === 'string' ? account : account.address}`);
  });

  // Check first few accounts
  for (let i = 0; i < Math.min(accounts.length, 3); i++) {
    const account = accounts[i];
    const accountAddress = typeof account === 'string' ? account : account.address;
    console.log(`\n🔍 Checking account ${i}: ${accountAddress}`);

    try {
      const entryCount = await contract.getEntryCount(accountAddress);
      console.log(`📊 Entry count: ${entryCount}`);

      if (entryCount > 0) {
        // Check recent dates
        const today = new Date();
        for (let j = 0; j < 7; j++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - j);

          const epochDate = new Date(1970, 0, 1);
          const daysSinceEpoch = Math.floor((checkDate.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));

          try {
            const exists = await contract.entryExists(accountAddress, daysSinceEpoch);
            if (exists) {
              console.log(`✅ Entry found for date: ${checkDate.toISOString().split('T')[0]} (days: ${daysSinceEpoch})`);
            }
          } catch (e) {
            console.log(`❌ Error checking date ${checkDate.toISOString().split('T')[0]}: ${e.message}`);
          }
        }
      }
    } catch (e) {
      console.log(`❌ Error checking account ${accountAddress}: ${e.message}`);
    }
  }

  // Check entry count
  const entryCount = await contract.getEntryCount(wallet.address);
  console.log(`\n📊 Entry count for ${wallet.address}: ${entryCount}`);

  if (entryCount > 0) {
    console.log("\n🔍 Checking recent dates...");

    // Check last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      // Convert to days since epoch (same logic as frontend)
      const epochDate = new Date(1970, 0, 1);
      const daysSinceEpoch = Math.floor((checkDate.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));

      try {
        const exists = await contract.entryExists(wallet.address, daysSinceEpoch);
        if (exists) {
          console.log(`✅ Entry found for date: ${checkDate.toISOString().split('T')[0]} (days: ${daysSinceEpoch})`);

          // Try to get the entry (will fail due to encryption, but shows structure)
          try {
            const entry = await contract.getEntry(wallet.address, daysSinceEpoch);
            console.log(`   Encrypted mental state: ${entry[0]}`);
            console.log(`   Encrypted stress: ${entry[1]}`);
            console.log(`   Timestamp: ${new Date(Number(entry[2]) * 1000).toISOString()}`);
          } catch (e) {
            console.log(`   (Cannot decrypt without proper signature)`);
          }
        }
      } catch (e) {
        console.log(`❌ Error checking date ${checkDate.toISOString().split('T')[0]}: ${e.message}`);
      }
    }
  } else {
    console.log("❌ No entries found for this address");
  }

  // Check last entry date
  try {
    const lastEntryDate = await contract.getLastEntryDate(wallet.address);
    if (lastEntryDate > 0) {
      const lastEntryDateObj = new Date(1970, 0, 1);
      lastEntryDateObj.setDate(lastEntryDateObj.getDate() + lastEntryDate);
      console.log(`\n📅 Last entry date: ${lastEntryDateObj.toISOString().split('T')[0]} (days: ${lastEntryDate})`);
    } else {
      console.log("\n📅 No last entry date found");
    }
  } catch (e) {
    console.log(`❌ Error getting last entry date: ${e.message}`);
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
