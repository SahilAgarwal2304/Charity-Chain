# CharityChain 🌐
### Decentralized & Transparent Charity Platform on Ethereum Blockchain
**SPPU Final Year Computer Engineering - Blockchain Technology Mini Project (Option 8)**

---

## 🚀 Quick Start (1-Click Run)

### Option A: The Easiest Way (Double Click)
Just double-click **`start-project.bat`** inside this folder!
It will automatically:
1. Start the local Ethereum Hardhat node (`http://127.0.0.1:8545`).
2. Compile and deploy the `CharityPlatform.sol` smart contract.
3. Seed 3 verified demo campaigns and real-time donations.
4. Launch the web interface automatically in your browser at `http://localhost:3000`.

---

### Option B: Using Command Line (Terminal)
Open Terminal / PowerShell in this directory:
```bash
# 1. Install dependencies (Already done!)
npm install

# 2. Run unit tests
npm test

# 3. Start local node, deploy contract & run web app
node run.js
```
Then open: **`http://localhost:3000`** in your browser.

---

## 🧪 Automated Unit Testing (For College Marks)
Double-click **`run-tests.bat`** or run:
```bash
npm test
```
**Result:** 5 automated tests verifying campaign deployment, donations, event logs, access control, and fund withdrawal pass with 100% green checkmarks!

---

## 🌟 Key Features
1. **Zero Intermediaries:** Donors send Ether directly to the smart contract escrow.
2. **100% Immutable Public Ledger:** Every donation (Donor address, amount, timestamp, note, and transaction hash) is visible to everyone in the world.
3. **Escrow Fund Release:** Funds can only be withdrawn to the verified beneficiary address once the target is met or deadline passes.
4. **Dual Mode (Fail-Proof Demo):**
   - **Web3 Mode:** Connects to MetaMask & Hardhat Local Node (Chain ID 31337).
   - **Lab Sim Mode:** Works seamlessly even if the college computer does not have MetaMask or internet!

---

## 📂 Project Architecture
```
D:\bct be project\
├── contracts/
│   └── CharityPlatform.sol       # Solidity Smart Contract (^0.8.20)
├── scripts/
│   ├── deploy.js                 # Automated deployment script
│   └── seed.js                   # Pre-populates realistic starter campaigns
├── test/
│   └── CharityPlatform.test.js   # Automated unit tests (Chai / Mocha)
├── public/                       # Frontend Web Application
│   ├── index.html                # Modern Tailwind CSS & Responsive UI
│   ├── app.js                    # Web3 Ethers.js v6 & Simulation Engine
│   └── contractData.json         # Deployed contract address & ABI
├── hardhat.config.js             # Hardhat configuration
├── server.js                     # Express web server
├── run.js                        # 1-click all-in-one runner script
├── start-project.bat             # Windows 1-click batch launcher
├── run-tests.bat                 # Windows 1-click unit test runner
├── VIVA_QUESTIONS_AND_ANSWERS.md # 15+ Examiner Viva Q&As (Must Read!)
└── PROJECT_REPORT.md             # Complete report template for submission
```

---

## 🦊 How to connect MetaMask to Localhost (Optional)
If you want to use MetaMask:
1. Open MetaMask -> Networks dropdown -> **Add a network manually**.
2. **Network Name:** Hardhat Local
3. **RPC URL:** `http://127.0.0.1:8545`
4. **Chain ID:** `31337`
5. **Currency Symbol:** `ETH`
6. Click Save and import any private key printed in the console to get **10,000 free test ETH**!
*(Or simply click "Auto-Add to MetaMask" inside the app helper modal).*
