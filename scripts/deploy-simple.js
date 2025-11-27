const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance));

    // Deploy contract
    console.log("Deploying EncryptedMentalHealthDiary...");
    const Contract = await hre.ethers.getContractFactory("EncryptedMentalHealthDiary");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("EncryptedMentalHealthDiary deployed to:", address);
    console.log("\nCopy this address to frontend/.env.local:");
    console.log(`VITE_CONTRACT_ADDRESS=${address}`);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main();
