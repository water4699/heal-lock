const { ethers } = require("ethers");

async function main() {
  try {
    console.log("🚀 Starting Sepolia deployment with your credentials...");

    const INFURA_API_KEY = "b18fb7e6ca7045ac83c41157ab93f990";
    const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
    const PRIVATE_KEY = "bb264d176e423b4efe15339020f9cd3d42e978303168e050b8746bbd3b256cf6";

    console.log("📡 Connecting to Sepolia via Infura...");
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

    console.log("🔑 Creating wallet...");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("📧 Account address:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.01")) {
      console.error("❌ Insufficient balance. Need at least 0.01 ETH on Sepolia");
      process.exit(1);
    }

    console.log("🏗️  Deploying EncryptedMentalHealthDiary...");

    // We need to get the contract bytecode. Let's try a different approach.
    // Since we have the compiled artifacts, let's try to load them directly.

    console.log("📂 Loading contract artifacts...");
    const fs = require("fs");
    const path = require("path");

    const artifactsPath = path.join(__dirname, "..", "artifacts", "contracts", "EncryptedMentalHealthDiary.sol", "EncryptedMentalHealthDiary.json");

    if (!fs.existsSync(artifactsPath)) {
      console.error("❌ Contract artifacts not found. Please compile the contract first.");
      console.log("Run: npm run compile");
      process.exit(1);
    }

    const artifacts = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
    const abi = artifacts.abi;
    const bytecode = artifacts.bytecode;

    console.log("📜 Contract ABI and bytecode loaded");

    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log("⏳ Sending deployment transaction...");
    const contract = await factory.deploy();

    console.log("🔄 Waiting for deployment confirmation...");
    console.log("Transaction hash:", contract.deploymentTransaction()?.hash);

    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("🎉 SUCCESS! Contract deployed successfully!");
    console.log("📍 Sepolia Contract Address:", address);
    console.log("🔍 View on Etherscan: https://sepolia.etherscan.io/address/" + address);
    console.log("📋 Transaction: https://sepolia.etherscan.io/tx/" + contract.deploymentTransaction()?.hash);

    // Save deployment info
    const deploymentInfo = {
      network: "sepolia",
      contractAddress: address,
      deployer: wallet.address,
      transactionHash: contract.deploymentTransaction()?.hash,
      deployedAt: new Date().toISOString(),
      infuraKey: INFURA_API_KEY
    };

    const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(deploymentPath, "EncryptedMentalHealthDiary.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("💾 Deployment info saved to:", path.join(deploymentPath, "EncryptedMentalHealthDiary.json"));

  } catch (error) {
    console.error("❌ Sepolia deployment failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

main();
