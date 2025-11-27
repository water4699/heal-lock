const { ethers } = require("ethers");

async function main() {
  try {
    console.log("Checking Sepolia balance...");

    const INFURA_API_KEY = "b18fb7e6ca7045ac83c41157ab93f990";
    const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

    const privateKey = "bb264d176e423b4efe15339020f9cd3d42e978303168e050b8746bbd3b256cf6";
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Account address:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.01")) {
      console.log("\n❌ Insufficient balance. Need at least 0.01 ETH on Sepolia");
      console.log("Get test ETH from: https://sepoliafaucet.com/");
    } else {
      console.log("\n✅ Sufficient balance for deployment");
    }

  } catch (error) {
    console.error("Error checking balance:", error.message);
  }
}

main();
