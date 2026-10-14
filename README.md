# 🌐 CharityChain
### Decentralized & Transparent Charity Platform on Ethereum Blockchain
**Savitribai Phule Pune University (SPPU) - Final Year Computer Engineering**  
*Course: Blockchain Technology (BCT) Laboratory | Syllabus Reference: Problem No. 8 (Page #54/128)*  
*“Develop a Blockchain based application for transparent and genuine charity”*

---

## 🌟 Key Highlights
- **100% Immutable Public Ledger:** Every donation (Donor address, amount, timestamp, custom note, and transaction hash) is publicly auditable on the blockchain.
- **Zero Middlemen / 0% Admin Cut:** Peer-to-peer donation directly to the smart contract escrow; eliminates platform fee cuts.
- **Smart Contract Escrow:** Funds are autonomously locked and can only be withdrawn to the verified beneficiary address once target is met or deadline passes.
- **Dual Mode (Lab Sim & Web3):** Works seamlessly both with MetaMask on local/testnet EVM, as well as an offline simulation mode for college lab computers without internet or browser extensions.
- **Automated Unit Testing:** 5 passing unit tests written in Mocha & Chai.

---

## 🚀 How to Run the Project (Step-by-Step)

### Option 1: The 1-Click Way (Easiest for Demo)
Inside the project root folder `D:\bct be project\`:
1. **Double-click `start-project.bat`**
   - Starts the local Hardhat Ethereum node (`http://127.0.0.1:8545`).
   - Automatically compiles and deploys `CharityPlatform.sol`.
   - Seeds 3 demo campaigns with realistic donations.
   - Starts the web server and opens **`http://localhost:5000`** in your browser!
2. If the local blockchain is already running in one terminal, simply double-click **`start-frontend-only.bat`** to start and open the web app.

---

### Option 2: Running via Terminal / Command Prompt
Open your terminal inside `D:\bct be project`:

```bash
# Step 1: Install dependencies (if not already installed)
npm install

# Step 2: Start the local Ethereum Blockchain Node
npx hardhat node

# Step 3: In a NEW terminal tab, deploy and seed the smart contract
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/seed.js --network localhost

# Step 4: Start the Web Application Server
node server.js
```
Now open your browser and visit:  
👉 **`http://localhost:5000`**

---

## 🧪 How to Run Automated Unit Tests (For Examiner Marks)

Double-click **`run-tests.bat`** OR run in terminal:
```bash
npm test
```
### Expected Output:
```text
  CharityPlatform Smart Contract Tests
    ✔ 1. Should deploy successfully with initial zero stats
    ✔ 2. Should create a new campaign correctly
    ✔ 3. Should accept donations, update campaign balance, and record transparency log
    ✔ 4. Should reject unauthorized withdrawal
    ✔ 5. Should allow beneficiary to withdraw once target is reached

  5 passing (2s)
```
*(Show this terminal output to the examiner during practical oral evaluation).*

---

## 🦊 How to Connect MetaMask (Local Network)

1. Open your **MetaMask** extension.
2. Go to **Settings** -> **Networks** -> **Add Network Manually**:
   - **Network Name:** `Hardhat Local`
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Click **Save**.
4. To get **10,000 Free Test ETH**:
   - In MetaMask, click **Import Account**.
   - Paste Account #0 private key printed in the Hardhat terminal:
     `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - You now have 10,000 ETH to donate and test live on-chain!

> 💡 *Note: You can also click the **"Local Network Helper"** button in the web app header to auto-add the network to MetaMask in 1 click!*

---

## 🏫 Offline / College Lab Demonstration Mode

If the college laboratory PC has:
- Restrictive firewall blocking RPC ports
- No MetaMask extension installed
- No internet access

**Solution:** Simply click the **"Web3 Mode / Lab Sim Mode"** toggle button in the top-right corner of the website navbar.  
The application seamlessly switches to a local simulation engine that records donations, increments progress bars, and generates realistic Ethereum transaction hashes without throwing any errors!

---

## 📂 Project Structure
```text
Charity-Chain/
├── contracts/
│   └── CharityPlatform.sol       # Solidity Smart Contract (^0.8.20)
├── scripts/
│   ├── deploy.js                 # Contract deployment script
│   └── seed.js                   # Pre-populates 3 active causes & donations
├── test/
│   └── CharityPlatform.test.js   # Automated unit tests (Chai / Mocha)
├── public/                       # Frontend Web UI
│   ├── index.html                # Tailwind CSS responsive interface
│   ├── app.js                    # Web3 Ethers.js v6 & Simulation Engine
│   └── contractData.json         # Deployed contract ABI & address
├── hardhat.config.js             # Hardhat EVM network configuration
├── server.js                     # Express web server (port 5000)
├── run.js                        # All-in-one runner script
├── start-project.bat             # 1-Click Master Launcher
├── start-frontend-only.bat       # 1-Click Web App Launcher
├── run-tests.bat                 # 1-Click Unit Test Runner
├── push-to-github.bat            # 1-Click Git Push to GitHub
├── VIVA_QUESTIONS_AND_ANSWERS.md # 15+ Examiner Viva Q&As with answers
├── PROJECT_REPORT.md             # Complete Academic Project Report (Markdown)
└── report.html                   # Formatted Printable PDF Project Report
```

---

## 📚 Viva Preparation & Academic Report
- **Viva Questions & Answers:** See [`VIVA_QUESTIONS_AND_ANSWERS.md`](./VIVA_QUESTIONS_AND_ANSWERS.md) for top 15 external examiner questions, including "Why Blockchain instead of MySQL?", "What is Gas?", and "Reentrancy Protection".
- **Printable Project Report:** Open [`report.html`](./report.html) in your browser and click **"Print / Save as PDF"** for a ready-to-submit project report.

---

## 👨‍💻 Author
- **Student Name:** Sahil Agarwal  
- **Course:** BE Computer Engineering, Savitribai Phule Pune University (SPPU)
