console.log("Testing basic Node.js execution...");
console.log("Current directory:", process.cwd());
console.log("Node version:", process.version);

try {
  console.log("Testing ethers import...");
  const { ethers } = require("ethers");
  console.log("✅ Ethers imported successfully");

  console.log("Testing provider connection...");
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  console.log("✅ Provider created");

} catch (error) {
  console.error("❌ Error:", error.message);
}
