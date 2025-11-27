const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function diagnose() {
  console.log("🔍 Diagnosing HealLock deployment and configuration...\n");

  // Check Hardhat node
  console.log("1️⃣  Checking Hardhat node...");
  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const blockNumber = await provider.getBlockNumber();
    console.log("   ✅ Hardhat node running - Block:", blockNumber);

    const accounts = await provider.listAccounts();
    console.log("   ✅ Available accounts:", accounts.length);
  } catch (error) {
    console.log("   ❌ Hardhat node not accessible:", error.message);
    console.log("   💡 Start with: npx hardhat node");
    return;
  }

  // Check contract deployment
  console.log("\n2️⃣  Checking contract deployment...");

  // Read addresses from Addresses.ts
  const addressesPath = path.join(__dirname, "../frontend/src/abi/Addresses.ts");
  const addressesContent = fs.readFileSync(addressesPath, "utf8");
  const localhostMatch = addressesContent.match(/localhost: "([^"]+)"/);

  if (!localhostMatch) {
    console.log("   ❌ Could not find localhost address in Addresses.ts");
    return;
  }

  const contractAddress = localhostMatch[1];
  console.log("   📍 Contract address:", contractAddress);

  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  try {
    const code = await provider.getCode(contractAddress);
    if (code === "0x" || code.length <= 2) {
      console.log("   ❌ Contract NOT deployed at this address");
      console.log("   💡 Deploy with: npm run deploy:local");
      return;
    }
    console.log("   ✅ Contract deployed - Code length:", code.length);
  } catch (error) {
    console.log("   ❌ Error checking contract:", error.message);
    return;
  }

  // Check .env.local
  console.log("\n3️⃣  Checking configuration files...");
  const envPath = path.join(__dirname, "../frontend/.env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const envMatch = envContent.match(/VITE_CONTRACT_ADDRESS=(.+)/);
    if (envMatch && envMatch[1].trim() === contractAddress) {
      console.log("   ✅ .env.local synchronized");
    } else {
      console.log("   ⚠️  .env.local address mismatch");
      console.log("   Expected:", contractAddress);
      console.log("   Found:", envMatch ? envMatch[1].trim() : "none");
    }
  } else {
    console.log("   ❌ .env.local not found");
  }

  // Test contract interaction
  console.log("\n4️⃣  Testing contract interaction...");
  try {
    const contract = new ethers.Contract(
      contractAddress,
      [
        "function getEntryCount(address user) external view returns (uint256)",
        "function entryExists(address user, uint256 date) external view returns (bool)"
      ],
      provider
    );

    // Test with a dummy address
    const testAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    const count = await contract.getEntryCount(testAddress);
    console.log("   ✅ Contract interaction successful - Entry count:", count.toString());

    const exists = await contract.entryExists(testAddress, Date.now());
    console.log("   ✅ Entry existence check:", exists);

  } catch (error) {
    console.log("   ❌ Contract interaction failed:", error.message);
    if (error.code === "CALL_EXCEPTION") {
      console.log("   💡 This might be a contract ABI mismatch or deployment issue");
    }
  }

  console.log("\n🎯 Diagnosis complete!");
  console.log("If all checks passed, your setup should work correctly.");
  console.log("If you see errors, please share the output above.");
}

diagnose().catch(console.error);


