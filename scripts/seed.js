const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("     Seeding CharityPlatform with Demo Data...    ");
  console.log("==================================================");

  const contractDataPath = path.join(__dirname, "../public/contractData.json");
  if (!fs.existsSync(contractDataPath)) {
    throw new Error("contractData.json not found! Run deploy first.");
  }

  const contractData = JSON.parse(fs.readFileSync(contractDataPath, "utf8"));
  const [owner, donor1, donor2, donor3, beneficiary1, beneficiary2, beneficiary3] = await ethers.getSigners();

  const charity = await ethers.getContractAt("CharityPlatform", contractData.address);

  console.log("1. Creating Sample Campaigns...");

  // Campaign 1: Rural Education & Digital Classrooms
  let tx = await charity.connect(owner).createCampaign(
    "Rural Digital Classrooms Project",
    "Providing tablets, solar power, and internet connectivity to 10 remote village schools across Maharashtra.",
    "Education",
    ethers.parseEther("3.0"),
    30,
    beneficiary1.address
  );
  await tx.wait();
  console.log(" -> Campaign 1 created: Rural Digital Classrooms Project (3.0 ETH Goal)");

  // Campaign 2: Pediatric Heart Surgery Support
  tx = await charity.connect(owner).createCampaign(
    "Emergency Heart Surgery for 5-Year-Old Aarav",
    "Urgent open-heart surgery required at Apollo Children's Hospital. Verified medical estimate attached on-chain.",
    "Healthcare",
    ethers.parseEther("5.0"),
    15,
    beneficiary2.address
  );
  await tx.wait();
  console.log(" -> Campaign 2 created: Pediatric Heart Surgery Support (5.0 ETH Goal)");

  // Campaign 3: Monsoon Flood Relief Supplies
  tx = await charity.connect(owner).createCampaign(
    "Kerala Monsoon Flood Relief & Food Kits",
    "Immediate emergency dry rations, clean drinking water filters, and temporary shelter kits for 250 displaced families.",
    "Disaster Relief",
    ethers.parseEther("2.0"),
    20,
    beneficiary3.address
  );
  await tx.wait();
  console.log(" -> Campaign 3 created: Monsoon Flood Relief Supplies (2.0 ETH Goal)");

  console.log("\n2. Simulating Transparent Public Donations...");

  // Donating to Campaign 1
  tx = await charity.connect(donor1).donate(1, "Empower education! Wishing these kids the best.", {
    value: ethers.parseEther("0.75"),
  });
  await tx.wait();
  console.log(" -> Donor 1 donated 0.75 ETH to Campaign 1");

  tx = await charity.connect(donor2).donate(1, "Small contribution towards digital learning.", {
    value: ethers.parseEther("0.50"),
  });
  await tx.wait();
  console.log(" -> Donor 2 donated 0.50 ETH to Campaign 1");

  // Donating to Campaign 2
  tx = await charity.connect(donor2).donate(2, "Praying for little Aarav's fast recovery and strength to the family.", {
    value: ethers.parseEther("1.20"),
  });
  await tx.wait();
  console.log(" -> Donor 2 donated 1.20 ETH to Campaign 2");

  tx = await charity.connect(donor3).donate(2, "From our community group. Stay strong!", {
    value: ethers.parseEther("0.80"),
  });
  await tx.wait();
  console.log(" -> Donor 3 donated 0.80 ETH to Campaign 2");

  // Donating to Campaign 3
  tx = await charity.connect(donor1).donate(3, "Flood relief emergency fund support.", {
    value: ethers.parseEther("0.60"),
  });
  await tx.wait();
  console.log(" -> Donor 1 donated 0.60 ETH to Campaign 3");

  const stats = await charity.getPlatformStats();
  console.log("\n==================================================");
  console.log("SEEDING COMPLETED SUCCESSFULLY!");
  console.log("Total Campaigns Active:", stats.totalCampaigns.toString());
  console.log("Total Donations Count :", stats.totalDonationsCount_.toString());
  console.log("Total Donated (ETH)   :", ethers.formatEther(stats.totalDonatedWei), "ETH");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
