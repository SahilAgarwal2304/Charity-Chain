# 🎓 CharityChain - Viva Preparation & Examiner Q&A Guide
> **Subject:** Blockchain Technology (BCT) Mini Project  
> **Topic:** Mini Project Option 8 - Develop a Blockchain based application for transparent and genuine charity  
> **University:** Savitribai Phule Pune University (SPPU) - Final Year Computer Engineering

---

## 📌 Top 15 Must-Know Viva Questions with Exact Answers

### Q1. What is the problem with existing traditional charity systems?
* **Answer:** Traditional charity systems and NGOs suffer from **lack of transparency, high administrative overheads (3% to 10% fee cut), fund misappropriation, and opaque accounting**. Donors have zero real-time visibility into whether their donated funds actually reached the intended beneficiary or were siphoned off by intermediaries.
* *Hinglish tip:* Bolna ki traditional NGOs me middlemen aur admins paisa kha jate hain ya misuse karte hain, aur donor ko kabhi pata nahi chalta uska paisa kahan gaya.

---

### Q2. Why did you choose Blockchain for this? Why not a standard SQL/NoSQL database (like MySQL or MongoDB)?
* **Answer (Crucial!):** In a traditional centralized database (like MySQL), the Database Administrator (DBA) or server owner possesses root privileges and can easily execute `UPDATE` or `DELETE` queries to alter donation records, fake balances, or erase transaction logs without detection.
* Blockchain provides:
  1. **Immutability:** Once a transaction is mined in a block, it cannot be tampered with or deleted.
  2. **Decentralized Consensus:** No single entity controls the ledger.
  3. **Smart Contract Escrow:** Funds are locked in autonomous code and released strictly when predefined conditions are met (e.g., target achieved or verified beneficiary withdrawal).

---

### Q3. What is a Smart Contract, and where is it used in your project?
* **Answer:** A smart contract is self-executing code with terms of agreement directly written into lines of code, running deterministically on the Ethereum Virtual Machine (EVM).
* In our project, `CharityPlatform.sol` is the smart contract. It handles:
  - `createCampaign(...)`: Registers causes with funding targets and deadlines.
  - `donate(...)`: Accepts Ether from donors, updates balances, and records on-chain donation notes.
  - `withdrawFunds(...)`: Restricts withdrawal strictly to the verified creator or beneficiary address once the target is reached or deadline passes.

---

### Q4. What is the role of MetaMask in your project?
* **Answer:** MetaMask functions as a non-custodial Web3 wallet and key management tool. It:
  - Injects the `window.ethereum` API into the browser.
  - Holds the user's private and public cryptographic keys securely.
  - Digitally signs transactions (using ECDSA - Elliptic Curve Digital Signature Algorithm) before broadcasting them to the Ethereum node via JSON-RPC.

---

### Q5. What is Gas, Gas Limit, and Gas Price?
* **Answer:**
  - **Gas:** The unit measuring the computational effort required to execute specific operations on the EVM (e.g., SSTORE, ADD, SHA3).
  - **Gas Limit:** The maximum amount of gas the sender is willing to consume for a transaction to prevent infinite loops.
  - **Gas Price:** The amount of Ether (in Gwei) the sender pays per unit of gas to prioritize transaction inclusion by validators.

---

### Q6. Which Solidity version and development framework did you use?
* **Answer:**
  - **Solidity Version:** `^0.8.20` (features built-in arithmetic overflow/underflow protection, removing the need for legacy SafeMath).
  - **Framework:** **Hardhat** (for compiling, automated Chai unit testing, and running local EVM nodes).
  - **Client Library:** **Ethers.js (v6)** for communicating between JavaScript frontend and the Solidity smart contract.

---

### Q7. How does your contract prevent unauthorized fund theft?
* **Answer:** Inside `withdrawFunds(uint256 _campaignId)`, we implement strict `require` access control statements:
  ```solidity
  require(
      msg.sender == campaign.creator || msg.sender == campaign.beneficiary,
      "Only creator or beneficiary can withdraw funds"
  );
  require(!campaign.fundsWithdrawn, "Funds have already been withdrawn");
  require(
      campaign.amountRaised >= campaign.targetAmount || block.timestamp > campaign.deadline,
      "Target not reached yet and deadline is still active"
  );
  ```
  An attacker cannot withdraw because the EVM verifies `msg.sender` against the cryptographic address stored at campaign creation time.

---

### Q8. What is Reentrancy Attack and does this contract prevent it?
* **Answer:** A reentrancy attack occurs when an external malicious contract calls back into the withdrawing contract before the state variable is updated (Checks-Effects-Interactions pattern).
* In our contract, we set:
  ```solidity
  campaign.fundsWithdrawn = true;
  campaign.active = false;
  ```
  **before** transferring Ether via `(bool sent, ) = campaign.beneficiary.call{value: amountToTransfer}("")`. Hence, the state is updated prior to external interaction, preventing reentrancy exploits.

---

### Q9. What are Events in Solidity and why are they used here?
* **Answer:** Events (like `event DonationReceived(...)` and `event CampaignCreated(...)`) allow smart contracts to write logs to the Ethereum blockchain's transaction receipts.
* They are computationally cheap (cost much less gas than contract storage) and enable our web frontend to listen in real time to donations and populate the **Public Transparency Ledger**.

---

### Q10. What is the difference between `call`, `send`, and `transfer` in Solidity for sending Ether?
* **Answer:**
  - `transfer()`: Caps gas to 2300; throws an error on failure (deprecated in modern Solidity).
  - `send()`: Caps gas to 2300; returns a boolean false on failure.
  - `call{value: amount}("")`: Recommended modern method in Solidity `>=0.8.0`. It forwards all available gas or specified gas, and returns a boolean status flag checked via `require(sent, "Ether transfer failed")`.

---

### Q11. What consensus mechanism does Ethereum use?
* **Answer:** Ethereum transitioned from **Proof of Work (PoW)** to **Proof of Stake (PoS)** during "The Merge" (EIP-3675). In PoS, validators stake 32 ETH to propose and validate blocks instead of running energy-intensive cryptographic mining hardware.

---

### Q12. How does the Public Transparency Ledger work in your project?
* **Answer:** Every donation made via the dApp calls the `donate()` function. It pushes the donor's address, timestamp, amount, and custom message into the on-chain array `allDonations`. The frontend fetches this array and displays a real-time ledger complete with verified transaction hashes that anyone in the public can inspect.

---

### Q13. Can someone fake their identity or donate anonymously?
* **Answer:** Blockchain provides **pseudonymity**. A donor is identified by their public cryptographic address (`0x...`), not their real name, preserving donor privacy while providing 100% mathematical certainty that the donation was executed.

---

### Q14. What happens if the funding deadline passes and the target was not reached?
* **Answer:** Our contract allows disbursal if either `amountRaised >= targetAmount` OR `block.timestamp > deadline`. This ensures that even if a campaign only raised 60% of the goal, whatever funds were genuinely collected can still be withdrawn to help the patient or school, preventing funds from being permanently trapped in the smart contract.

---

### Q15. How would you scale this in production?
* **Answer:**
  1. Deploy on Ethereum Layer-2 rollups (e.g., **Arbitrum, Optimism, or Polygon**) to reduce gas fees to less than \$0.01 per transaction.
  2. Integrate **The Graph Protocol** for fast sub-graph indexing and querying of historical donation events.
  3. Integrate **Chainlink Oracles** or decentralized KYC verification (Soulbound Tokens / WorldID) for hospital vendor credentialing.

---

## 🎯 Step-by-Step Live Demo Script for the Examiner

1. **Step 1:** Open `http://localhost:3000` in Google Chrome. Show the stats bar at the top (Total Raised, Active Causes, Verified On-Chain badge).
2. **Step 2:** Point out the active campaigns (e.g. *Emergency Heart Surgery for 5-Year-Old Aarav*).
3. **Step 3:** Click **"Donate Ether"**, choose `0.5 ETH`, write a short note *"Wishing speedy recovery"*, and click **"Confirm & Send ETH"**.
4. **Step 4:** Show the progress bar dynamically update in real time.
5. **Step 5:** Click on the **"Public Ledger"** tab and show the new entry with Donor address, ETH amount, and transaction hash.
6. **Step 6:** Click on the **"Architecture & Viva"** tab to show the Examiner the comparative breakdown between Centralized vs Decentralized charity models!
7. **Step 7:** Run `run-tests.bat` in terminal to show **5 passing automated unit tests** in front of the teacher!
