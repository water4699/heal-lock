const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("Starting deployment to localhost...");

    // Connect to local Hardhat node
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    
    // Get the first account address
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      throw new Error("No accounts found. Make sure Hardhat node is running.");
    }
    
    // Create a signer from the first account
    // Hardhat node uses default private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    const deployerAddress = accounts[0];
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const deployer = new ethers.Wallet(privateKey, provider);
    
    console.log("Deploying contracts with account:", deployer.address);

    // Check balance
    const balance = await provider.getBalance(deployer);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    // Read contract ABI and bytecode
    const contractPath = path.join(__dirname, "../artifacts/contracts/EncryptedMentalHealthDiary.sol/EncryptedMentalHealthDiary.json");
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    
    const contractFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      deployer
    );

    // Deploy contract
    console.log("Deploying EncryptedMentalHealthDiary...");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("\n✅ EncryptedMentalHealthDiary deployed to:", address);

    // Update .env.local file
    const envPath = path.join(__dirname, "../frontend/.env.local");
    let envContent = "";
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    } else {
      envContent = `# Contract Address Configuration
# For local development, deploy the contract first:
# 1. Start Hardhat node: npx hardhat node
# 2. Deploy contract: npm run deploy:local
# 3. Copy the deployed address and replace the value below

`;
    }

    // Update or add VITE_CONTRACT_ADDRESS
    if (envContent.includes("VITE_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /VITE_CONTRACT_ADDRESS=.*/,
        `VITE_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `VITE_CONTRACT_ADDRESS=${address}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated frontend/.env.local with contract address");

    // Update Addresses.ts file
    const addressesPath = path.join(__dirname, "../frontend/src/abi/Addresses.ts");
    let addressesContent = fs.readFileSync(addressesPath, "utf8");

    // Update localhost address
    addressesContent = addressesContent.replace(
      /localhost: "[^"]*"/,
      `localhost: "${address}"`
    );

    fs.writeFileSync(addressesPath, addressesContent);
    console.log("✅ Updated frontend/src/abi/Addresses.ts with contract address");

    console.log("\n📋 Summary:");
    console.log(`   Contract Address: ${address}`);
    console.log(`   Network: localhost:8545`);
    console.log(`   Chain ID: 31337`);
    console.log("\n⚠️  Remember to restart your frontend dev server to load the new address!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Make sure Hardhat node is running:");
      console.error("   npx hardhat node");
    }
    process.exit(1);
  }
}

main();

