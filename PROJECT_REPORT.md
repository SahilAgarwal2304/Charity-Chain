# 📄 Mini Project Report
# CharityChain: A Decentralized and Transparent Charity Platform Using Blockchain Technology

---

## 1. ABSTRACT
Charity and crowdfunding organizations are essential pillars of modern society, providing financial assistance for healthcare, disaster relief, and educational causes. However, existing centralized charity platforms are plagued by severe challenges including lack of transparency, high administrative fees (deducting 3% to 10% of donations), mismanagement of funds, and loss of public donor trust.

This project introduces **CharityChain**, a decentralized application (dApp) built on the Ethereum blockchain that completely eliminates third-party intermediaries. Utilizing Solidity smart contracts running on the Ethereum Virtual Machine (EVM), CharityChain acts as an autonomous escrow system. Funds donated in Ether are locked within the smart contract and can only be released to verified beneficiary addresses upon reaching funding targets or campaign expiry. Furthermore, every donation is logged onto an immutable public transparency ledger, granting donors, regulators, and the public real-time visibility into fund flow. The system is tested using Hardhat and deployed with a responsive, modern Web3 user interface.

---

## 2. PROBLEM STATEMENT & MOTIVATION
In centralized systems (e.g., GoFundMe, PM Cares, traditional NGOs):
- **Opaque Financial Tracking:** Donors are unable to verify whether their contributions actually reached the victims or were consumed by administrative overheads.
- **Vulnerability to Tampering:** Relational databases (MySQL/PostgreSQL) can be manipulated or audited records can be falsified by privileged administrators.
- **Intermediary Fees:** Banking channels and aggregator platforms charge significant transaction and processing fees.

**Motivation:** By deploying an immutable, decentralized public ledger powered by smart contracts, we achieve zero-intermediary trustless philanthropy where mathematical proofs replace blind trust.

---

## 3. OBJECTIVES OF THE PROJECT
1. To develop and deploy an automated, secure Solidity smart contract for crowdfunding and charity on Ethereum.
2. To implement an escrow mechanism that securely locks funds until pre-specified target conditions are met.
3. To build a real-time, tamper-proof **Public Transparency Ledger** exposing all transactions, donor addresses, and cryptographic proof hashes.
4. To create a modern, user-friendly Web3 interface integrated with MetaMask and Ethers.js.
5. To validate smart contract security and functionality via automated unit tests.

---

## 4. SYSTEM ARCHITECTURE & FLOW

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT                                    |
|   (Web Browser + HTML5 / Tailwind CSS + Ethers.js v6 + MetaMask Crypto Wallet)    |
+-----------------------------------------+-----------------------------------------+
                                          |
                        JSON-RPC Protocol | (Transactions Signed with Private Key)
                                          v
+-----------------------------------------------------------------------------------+
|                             ETHEREUM BLOCKCHAIN (EVM)                             |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 Smart Contract: CharityPlatform.sol                         |  |
|  |                                                                             |  |
|  |  [State Variables]                                                          |  |
|  |   - campaigns (mapping: id => Campaign)                                     |  |
|  |   - allDonations (array of public transparency records)                     |  |
|  |   - totalDonatedAmount / totalCampaignsCount                                |  |
|  |                                                                             |  |
|  |  [Core Functions]                                                           |  |
|  |   - createCampaign(title, description, category, targetAmount, deadline)   |  |
|  |   - donate(campaignId, message) [payable]                                   |  |
|  |   - withdrawFunds(campaignId) [only creator/beneficiary]                   |  |
|  |   - getCampaigns() / getAllDonations()                                      |  |
|  |                                                                             |  |
|  |  [Events]                                                                   |  |
|  |   - CampaignCreated / DonationReceived / FundsWithdrawn                     |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 5. HARDWARE & SOFTWARE SPECIFICATIONS

### Hardware Requirements:
- **Processor:** Intel Core i3 / AMD Ryzen 3 or higher
- **RAM:** Minimum 4 GB (8 GB recommended)
- **Disk Space:** 500 MB free space

### Software Requirements:
- **Operating System:** Windows 10/11, Linux, or macOS
- **Development Environment:** Node.js (v18+), npm
- **Blockchain Framework:** Hardhat v2.22+
- **Smart Contract Language:** Solidity `^0.8.20`
- **Crypto Wallet:** MetaMask Browser Extension
- **Client Library:** Ethers.js v6
- **Frontend Technologies:** HTML5, Tailwind CSS, JavaScript ES6

---

## 6. SMART CONTRACT ALGORITHMIC LOGIC

### Algorithm 1: Campaign Creation
1. Input parameters: `_title`, `_description`, `_category`, `_targetAmount`, `_durationInDays`, `_beneficiary`.
2. Validate inputs: `targetAmount > 0`, `duration > 0`, `beneficiary != 0x0`.
3. Increment `campaignCount`.
4. Calculate `deadline = block.timestamp + (_durationInDays * 1 days)`.
5. Store `Campaign` struct in storage mapping `campaigns[campaignCount]`.
6. Emit `CampaignCreated` event.

### Algorithm 2: Donation Execution
1. Input: `_campaignId`, `_message`, `msg.value` (Ether).
2. Validate: `msg.value > 0`, `campaign.active == true`, `block.timestamp <= campaign.deadline`.
3. Add `msg.value` to `campaign.amountRaised` and global `totalDonatedAmount`.
4. Append `Donation` struct to `campaignDonations[_campaignId]` and `allDonations`.
5. Emit `DonationReceived` event.

### Algorithm 3: Fund Disbursal (Escrow Release)
1. Input: `_campaignId`.
2. Validate caller: `msg.sender == campaign.creator || msg.sender == campaign.beneficiary`.
3. Validate state: `!campaign.fundsWithdrawn` and `amountRaised > 0`.
4. Validate trigger condition: `amountRaised >= targetAmount || block.timestamp > deadline`.
5. Set `campaign.fundsWithdrawn = true` and `campaign.active = false` (Reentrancy guard).
6. Transfer accumulated Ether directly to `campaign.beneficiary` via low-level `call{value: amount}("")`.
7. Emit `FundsWithdrawn` event.

---

## 7. RESULTS & SCREENSHOTS DISCUSSION
1. **Interactive Cause Exploration:** Displays real-time progress bars, percentage funded, remaining time, and category filters.
2. **MetaMask Transaction Signing:** Secure user authentication through digital signatures without requiring passwords.
3. **Transparency Ledger:** Complete transaction traceability showing sender addresses and cryptographic transaction hashes.
4. **Unit Test Verification:** 5 automated unit tests passing covering deployment, funding, authorization, and escrow withdrawal.

---

## 8. CONCLUSION & FUTURE ENHANCEMENTS
**CharityChain** successfully demonstrates how blockchain technology and smart contracts provide a trustless, fraud-resistant foundation for social charity. By recording every transaction onto an immutable public ledger and enforcing programmatic fund disbursal, donor confidence is maximized and administrative fees are virtually eliminated.

### Future Enhancements:
1. **Layer-2 Rollup Deployment:** Deploying on Arbitrum or Polygon to minimize gas consumption.
2. **IPFS Document Storage:** Decentralized storage for hospital bills and NGO registration certificates.
3. **Decentralized KYC / WorldID:** Integrating decentralized identity verification for beneficiaries.

---

## 9. REFERENCES
1. Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*.
2. Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger*.
3. Savitribai Phule Pune University (SPPU) BE Computer Engineering Syllabus (#54/128).
4. Solidity Documentation: `https://docs.soliditylang.org/`
5. Hardhat Ethereum Development Environment: `https://hardhat.org/`
