# SAVITRIBAI PHULE PUNE UNIVERSITY
### DEPARTMENT OF COMPUTER ENGINEERING
**ACADEMIC YEAR 2025–2026**

---

# MINI PROJECT REPORT
ON

## **"CharityChain: Decentralized and Transparent Charity Platform Using Blockchain Technology"**

**Course:** Blockchain Technology (BCT) Laboratory  
**Syllabus Reference:** Fourth Year of Computer Engineering, Page #54/128, **Problem No. 8**  
*“Develop a Blockchain based application for transparent and genuine charity”*

---

### **Submitted By:**
- **Student Name:** Sahil Agarwal  
- **Branch:** Computer Engineering  
- **Institution:** Savitribai Phule Pune University (SPPU)  

---

## TABLE OF CONTENTS
1. [Abstract](#1-abstract)
2. [Introduction & Motivation](#2-introduction--motivation)
3. [Problem Statement & Objectives](#3-problem-statement--objectives)
4. [Complete Technology Stack](#4-complete-technology-stack)
5. [System Architecture & Design](#5-system-architecture--design)
6. [Smart Contract Implementation Details](#6-smart-contract-implementation-details)
7. [Algorithmic Workflow](#7-algorithmic-workflow)
8. [Security & Vulnerability Analysis](#8-security--vulnerability-analysis)
9. [Automated Testing & Test Results](#9-automated-testing--test-results)
10. [User Interface & Simulation Mode](#10-user-interface--simulation-mode)
11. [Comparative Analysis (Centralized vs Blockchain Charity)](#11-comparative-analysis)
12. [Conclusion & Future Scope](#12-conclusion--future-scope)
13. [References](#13-references)

---

## 1. ABSTRACT
Charity and crowdfunding organizations are essential pillars of modern society, providing vital financial assistance for emergency medical treatments, rural school infrastructure, and disaster rehabilitation. However, existing traditional centralized charity platforms are plagued by significant operational issues including lack of transparency, high administrative fees (deducting 3% to 10% of total donations), fund misappropriation, and declining public donor trust.

This project introduces **CharityChain**, a decentralized application (dApp) built on the Ethereum blockchain that eliminates third-party intermediaries. Powered by Solidity smart contracts (`CharityPlatform.sol`) executed deterministically on the Ethereum Virtual Machine (EVM), CharityChain acts as an autonomous cryptographic escrow. Funds contributed in Ether are locked in the smart contract and can only be withdrawn to verified beneficiary addresses once predefined conditions (funding target reached or deadline elapsed) are satisfied. Furthermore, every donation is permanently recorded onto an immutable public transparency ledger, granting donors, auditors, and regulators full mathematical visibility into fund flow. The system includes an automated unit testing suite in Hardhat and a modern Web3 responsive user interface with an offline simulation fallback for university laboratory demonstrations.

---

## 2. INTRODUCTION & MOTIVATION
In centralized donation platforms (such as GoFundMe, Ketto, Milaap, or traditional NGOs), funds are routed through centralized banking accounts and managed via proprietary relational databases. Donors are left with no mathematical or auditable proof that their money was genuinely delivered to the needy.

### Key Motivations for Blockchain Integration:
1. **Mathematical Trust over Institutional Trust:** Traditional systems rely on trust in human managers. Blockchain enforces trust via deterministic code execution ("Code is Law").
2. **Elimination of Administrative Intermediaries:** Peer-to-peer smart contract transfers eliminate 5%–10% middleman fees.
3. **Data Immutability:** Once a donation transaction is mined into an Ethereum block, it is cryptographically sealed by cryptographic hashes (Keccak-256) and cannot be deleted or manipulated.
4. **Conditional Escrow:** Funds are protected against fraudulent early withdrawal by unauthorized organizers.

---

## 3. PROBLEM STATEMENT & OBJECTIVES

### Problem Statement:
> *"Develop a Blockchain-based decentralized application (dApp) for transparent and genuine charity that eliminates middlemen, guarantees verifiable donation tracking, enforces smart contract escrow disbursal, and provides public transparency."*

### Key Objectives:
- **Objective 1:** Design, compile, and deploy a secure Solidity smart contract (`CharityPlatform.sol`) on Ethereum (EVM).
- **Objective 2:** Implement an automated escrow mechanism ensuring funds can only be withdrawn by verified beneficiary addresses under target or expiry conditions.
- **Objective 3:** Build an on-chain **Public Transparency Ledger** logging donor public addresses, timestamps, donation values, and custom transparency messages.
- **Objective 4:** Develop a responsive Web3 frontend using HTML5, Tailwind CSS, and Ethers.js (v6) with MetaMask wallet connectivity.
- **Objective 5:** Provide a fail-safe **Lab Simulation Mode** allowing seamless demonstration on college laboratory computers without requiring internet connectivity or browser extensions.
- **Objective 6:** Validate the smart contract through 100% passing automated unit tests using the Hardhat testing framework.

---

## 4. COMPLETE TECHNOLOGY STACK

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Smart Contract** | **Solidity** | `^0.8.20` | Core smart contract language. Built-in arithmetic overflow/underflow protection. |
| **Blockchain Engine** | **Hardhat** | `^2.22.2` | Local Ethereum node simulation (`127.0.0.1:8545`), compiler, and deployment framework. |
| **Client Web3 Library**| **Ethers.js** | `v6.11.1` | Facilitates JSON-RPC communication between browser and Ethereum node; handles BigInt and Wei conversions. |
| **Crypto Wallet** | **MetaMask** | Browser Ext | Non-custodial Web3 wallet for signing transactions using user private keys (ECDSA). |
| **Frontend UI** | **HTML5 / Tailwind CSS** | CDN | Responsive, dark-themed, glassmorphic user interface. |
| **Iconography** | **FontAwesome** | `v6.5.1` | Visual cues, badges, progress bars, and modal indicators. |
| **Local Web Server** | **Node.js / Express** | `v4.19.2` | Lightweight static asset server serving frontend and auto-generated `contractData.json`. |
| **Unit Testing** | **Mocha & Chai** | Bundled | Automated assertions for smart contract validation. |
| **Automation Scripts** | **Windows Batch (`.bat`)**| Windows | 1-click launcher (`start-project.bat`) and test runner (`run-tests.bat`). |

---

## 5. SYSTEM ARCHITECTURE & DESIGN

### 5.1 Architecture Block Diagram
```
+-------------------------------------------------------------------------------+
|                             CLIENT / USER LAYER                               |
|   - Web Browser (Chrome / Edge / Firefox)                                     |
|   - Frontend GUI (Tailwind CSS, Glassmorphic UI, Dual Mode Switcher)          |
|   - MetaMask Crypto Wallet (Private Key Security & ECDSA Digital Signatures)  |
+---------------------------------------+---------------------------------------+
                                        |
                 JSON-RPC Over HTTP / WebSocket (Port 8545)
                                        |
+---------------------------------------v---------------------------------------+
|                    DECENTRALIZED BLOCKCHAIN LAYER (EVM)                       |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                  CharityPlatform.sol Smart Contract                   |   |
|   |                                                                       |   |
|   |  - State Storage: mappings (campaigns, campaignDonations), arrays     |   |
|   |  - Modifiers: campaignExists, authorization checks                    |   |
|   |  - Core Functions: createCampaign(), donate(), withdrawFunds()         |   |
|   |  - View Functions: getCampaigns(), getAllDonations(), getStats()      |   |
|   |  - Events: CampaignCreated, DonationReceived, FundsWithdrawn           |   |
|   +-----------------------------------+-----------------------------------+   |
|                                       |                                       |
|               Funds Escrow Release    v    Direct Transfer                     |
|                   +---------------------------------------+                   |
|                   | Verified Beneficiary Wallet (0x...)   |                   |
|                   +---------------------------------------+                   |
+-------------------------------------------------------------------------------+
```

### 5.2 Transaction Flow Sequence
1. **Campaign Creation:** Creator inputs Title, Goal (ETH), Duration, and Beneficiary Address -> MetaMask prompts for signature -> Transaction mined -> `CampaignCreated` event fired.
2. **Donation:** Donor enters ETH amount -> Calls `donate()` with payable `msg.value` -> Ether enters contract escrow -> Record stored in `allDonations` array -> `DonationReceived` event emitted -> UI updates progress bar.
3. **Escrow Disbursal:** Once goal reached or deadline passed, Creator or Beneficiary calls `withdrawFunds()` -> Contract sends entire balance via `.call{value: amount}("")` to Beneficiary wallet -> Contract marks `fundsWithdrawn = true`.

---

## 6. SMART CONTRACT IMPLEMENTATION DETAILS

### 6.1 Data Structures (`CharityPlatform.sol`)
```solidity
struct Campaign {
    uint256 id;
    address payable creator;
    address payable beneficiary;
    string title;
    string description;
    string category;
    uint256 targetAmount; // in wei
    uint256 deadline;     // unix timestamp
    uint256 amountRaised; // in wei
    bool fundsWithdrawn;
    bool active;
}

struct Donation {
    uint256 campaignId;
    address donor;
    uint256 amount;
    uint256 timestamp;
    string message;
}
```

### 6.2 Key Functions:
* `createCampaign(...)`: Instantiates a new campaign, checks that title is not empty, target > 0, duration > 0, and beneficiary != `address(0)`.
* `donate(uint256 _campaignId, string memory _message) external payable`: Accepts Ether via `msg.value`, checks that campaign deadline is active, updates `amountRaised`, and appends donation to transparency arrays.
* `withdrawFunds(uint256 _campaignId) external`: Enforces that only creator or beneficiary can trigger payout, ensures funds were not already withdrawn, checks target or deadline condition, sets state variables first (preventing reentrancy), and transfers Ether to the beneficiary.

---

## 7. ALGORITHMIC WORKFLOW

### Algorithm 1: Smart Contract Escrow Disbursal
```
Input: campaignId, msg.sender
Output: Boolean (Success / Revert)

1. Fetch campaign from storage: C = campaigns[campaignId]
2. Assert C.active == true, else revert "Campaign not active"
3. Assert (msg.sender == C.creator OR msg.sender == C.beneficiary), else revert "Unauthorized"
4. Assert C.fundsWithdrawn == false, else revert "Funds already withdrawn"
5. Assert (C.amountRaised >= C.targetAmount OR block.timestamp > C.deadline), else revert "Condition not met"
6. Set C.fundsWithdrawn = true
7. Set C.active = false
8. Transfer C.amountRaised to C.beneficiary via call{value: C.amountRaised}("")
9. Assert transfer returned true, else revert "Ether transfer failed"
10. Emit FundsWithdrawn(campaignId, C.beneficiary, C.amountRaised, block.timestamp)
11. Return true
```

---

## 8. SECURITY & VULNERABILITY ANALYSIS

1. **Reentrancy Protection:**
   The contract strictly follows the **Checks-Effects-Interactions** architectural pattern. The state variables `campaign.fundsWithdrawn = true` and `campaign.active = false` are updated *before* invoking the external low-level transfer `campaign.beneficiary.call{value: ...}("")`.
2. **Integer Overflow & Underflow:**
   Built using Solidity `^0.8.20`, which automatically reverts on arithmetic overflow/underflow at the compiler level.
3. **Zero Address Protection:**
   `createCampaign()` explicitly requires `require(_beneficiary != address(0))` to prevent burning or losing donated funds to the burn address.
4. **Access Control:**
   Strict cryptographic address matching prevents third parties from initiating fund withdrawal.

---

## 9. AUTOMATED TESTING & TEST RESULTS

Automated tests were written using **Mocha and Chai** in `test/CharityPlatform.test.js`.

| Test No. | Test Case Description | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Initial contract deployment verification | Initial campaigns, donations, and total raised equal 0 | Counters initialized to 0 | **PASS ✅** |
| **TC-02** | Create a new campaign with 2.0 ETH goal | Campaign created, active flag set to true, correct beneficiary mapped | Campaign ID #1 created with matching values | **PASS ✅** |
| **TC-03** | Process multi-donor donations and ledger logging | Balances update correctly, donation notes logged in transparency array | Balance = 1.5 ETH, donor addresses logged | **PASS ✅** |
| **TC-04** | Prevent unauthorized caller from withdrawing funds | Transaction reverts with message "Only creator or beneficiary can withdraw funds" | Transaction reverted as expected | **PASS ✅** |
| **TC-05** | Authorized beneficiary withdraws funds after target met | Beneficiary receives balance, `fundsWithdrawn` set to true | Balance transferred, state updated | **PASS ✅** |

**Execution Result:** `5 passing (2s)` across all test cases.

---

## 10. USER INTERFACE & SIMULATION MODE

### Features:
1. **Interactive Cause Cards:** Dynamic progress bars illustrating funding percentage (`amountRaised / targetAmount`), time remaining counter, category tags, and verified beneficiary address.
2. **Donation Modal:** Preset quick-selection buttons (0.1 ETH, 0.5 ETH, 1.0 ETH), custom ETH input, and donor message field.
3. **Public Transparency Ledger:** Real-time data table listing campaign title, donor wallet address, timestamp, message, and transaction hash.
4. **Dual Mode Architecture (Lab Simulation Mode):** 
   A dedicated toggle in the header allows the dApp to run in **"Lab Sim Mode"**. If the college PC lacks MetaMask or internet connectivity, the application switches to a client-side simulation engine that mimics Ethereum transactions, block mining, and ledger updates without throwing browser errors.

---

## 11. COMPARATIVE ANALYSIS

| Feature | Centralized Charity (GoFundMe / PM Cares / NGOs) | CharityChain (Our Project) |
| :--- | :--- | :--- |
| **Trust Model** | Centralized, based on human reputation | Decentralized, mathematical ("Code is Law") |
| **Data Storage** | Relational Database (can be modified/deleted) | Ethereum Distributed Ledger (100% Immutable) |
| **Intermediary Fees** | 3% to 10% platform and banking cuts | 0% platform fee; minimal network gas fee |
| **Fund Release** | Manual admin approval; opaque criteria | Automated Smart Contract Escrow |
| **Transparency** | Donors cannot track money flow in real time | Public transparency ledger with on-chain hashes |
| **Single Point of Failure** | Server crash or database corruption stops system | Distributed across thousands of Ethereum nodes |

---

## 12. CONCLUSION & FUTURE SCOPE

### Conclusion:
**CharityChain** demonstrates how blockchain technology effectively eliminates corruption and administrative inefficiency in social fundraising. By replacing human middlemen with deterministic smart contracts, every Ether donated is accounted for, and funds can only reach the intended beneficiaries. The application fulfills all technical requirements of Savitribai Phule Pune University (SPPU) BE Computer Engineering Syllabus Problem No. 8.

### Future Scope:
1. **Layer-2 Rollups:** Migration to Arbitrum or Polygon to reduce transaction gas fees to sub-cent levels.
2. **IPFS / Filecoin Integration:** Decentralized storage for medical diagnostic reports, hospital cost estimates, and NGO registration proofs.
3. **Decentralized Identity (DID):** Implementing Soulbound Tokens (SBT) or WorldID for tamper-proof beneficiary KYC verification.

---

## 13. REFERENCES
1. Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*.
2. Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger*.
3. Savitribai Phule Pune University (SPPU) BE Computer Engineering Syllabus (#54/128).
4. Solidity Documentation (v0.8.20): `https://docs.soliditylang.org/`
5. Hardhat Ethereum Development Environment: `https://hardhat.org/`
6. Ethers.js v6 Library Documentation: `https://docs.ethers.org/v6/`
