const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("   Deploying CharityPlatform Smart Contract...    ");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const CharityPlatform = await ethers.getContractFactory("CharityPlatform");
  const charity = await CharityPlatform.deploy();
  await charity.waitForDeployment();

  const contractAddress = await charity.getAddress();
  console.log("SUCCESS! CharityPlatform deployed to:", contractAddress);

  // Read ABI from hardhat artifacts
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CharityPlatform.sol/CharityPlatform.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const contractData = {
    address: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    abi: artifact.abi,
  };

  // Save to public frontend directory
  const frontendDir = path.join(__dirname, "../public");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const outputPath = path.join(frontendDir, "contractData.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2));
  console.log("Contract data & ABI automatically written to:", outputPath);
  console.log("==================================================");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
