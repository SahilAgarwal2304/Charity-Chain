const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharityPlatform Smart Contract Tests", function () {
  let charityPlatform;
  let owner, donor1, donor2, beneficiary;

  beforeEach(async function () {
    [owner, donor1, donor2, beneficiary] = await ethers.getSigners();

    const CharityPlatformFactory = await ethers.getContractFactory("CharityPlatform");
    charityPlatform = await CharityPlatformFactory.deploy();
    await charityPlatform.waitForDeployment();
  });

  it("1. Should deploy successfully with initial zero stats", async function () {
    const stats = await charityPlatform.getPlatformStats();
    expect(stats.totalCampaigns).to.equal(0n);
    expect(stats.totalDonatedWei).to.equal(0n);
    expect(stats.totalDonationsCount_).to.equal(0n);
  });

  it("2. Should create a new campaign correctly", async function () {
    const targetAmount = ethers.parseEther("2.0");
    const durationDays = 30;

    const tx = await charityPlatform.createCampaign(
      "Rural School Library",
      "Building a library with computers for children in need",
      "Education",
      targetAmount,
      durationDays,
      beneficiary.address
    );
    await tx.wait();

    const campaigns = await charityPlatform.getCampaigns();
    expect(campaigns.length).to.equal(1);
    expect(campaigns[0].title).to.equal("Rural School Library");
    expect(campaigns[0].targetAmount).to.equal(targetAmount);
    expect(campaigns[0].beneficiary).to.equal(beneficiary.address);
    expect(campaigns[0].creator).to.equal(owner.address);
    expect(campaigns[0].active).to.be.true;
  });

  it("3. Should accept donations, update campaign balance, and record transparency log", async function () {
    const target = ethers.parseEther("2.0");
    await charityPlatform.createCampaign(
      "Flood Relief",
      "Providing dry food and medicines to affected families",
      "Disaster Relief",
      target,
      15,
      beneficiary.address
    );

    const donationAmount1 = ethers.parseEther("0.5");
    const donationAmount2 = ethers.parseEther("1.0");

    // Donor 1 donates
    await charityPlatform.connect(donor1).donate(1, "Stay strong, hope this helps!", {
      value: donationAmount1,
    });

    // Donor 2 donates
    await charityPlatform.connect(donor2).donate(1, "Praying for quick recovery", {
      value: donationAmount2,
    });

    const campaign = await charityPlatform.getCampaign(1);
    expect(campaign.amountRaised).to.equal(ethers.parseEther("1.5"));

    // Check transparency ledger for campaign 1
    const donations = await charityPlatform.getDonations(1);
    expect(donations.length).to.equal(2);
    expect(donations[0].donor).to.equal(donor1.address);
    expect(donations[0].amount).to.equal(donationAmount1);
    expect(donations[0].message).to.equal("Stay strong, hope this helps!");

    expect(donations[1].donor).to.equal(donor2.address);
    expect(donations[1].amount).to.equal(donationAmount2);

    // Check global stats
    const stats = await charityPlatform.getPlatformStats();
    expect(stats.totalDonatedWei).to.equal(ethers.parseEther("1.5"));
    expect(stats.totalDonationsCount_).to.equal(2n);
  });

  it("4. Should reject unauthorized withdrawal", async function () {
    const target = ethers.parseEther("1.0");
    await charityPlatform.createCampaign(
      "Heart Surgery",
      "Emergency surgery funding",
      "Healthcare",
      target,
      10,
      beneficiary.address
    );

    await charityPlatform.connect(donor1).donate(1, "Donation", {
      value: target,
    });

    // Random unauthorized donor attempts withdrawal
    await expect(
      charityPlatform.connect(donor2).withdrawFunds(1)
    ).to.be.revertedWith("Only creator or beneficiary can withdraw funds");
  });

  it("5. Should allow beneficiary to withdraw once target is reached", async function () {
    const target = ethers.parseEther("1.0");
    await charityPlatform.createCampaign(
      "Cancer Patient Care",
      "Chemotherapy support",
      "Healthcare",
      target,
      10,
      beneficiary.address
    );

    await charityPlatform.connect(donor1).donate(1, "Get well soon!", {
      value: target,
    });

    const initialBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);

    // Beneficiary withdraws funds
    const tx = await charityPlatform.connect(beneficiary).withdrawFunds(1);
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const finalBeneficiaryBalance = await ethers.provider.getBalance(beneficiary.address);
    
    // Beneficiary balance should increase by target minus gas
    expect(finalBeneficiaryBalance).to.equal(
      initialBeneficiaryBalance + target - gasUsed
    );

    const campaign = await charityPlatform.getCampaign(1);
    expect(campaign.fundsWithdrawn).to.be.true;
    expect(campaign.active).to.be.false;
  });
});
