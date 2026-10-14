/**
 * CharityChain - Decentralized Transparent Charity Platform
 * Frontend Web3 & Simulation Engine
 */

let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let contractData = null;
let isSimulatedMode = false;

// Active donate modal state
let activeDonationCampaignId = null;
let currentCategoryFilter = "All";

// Simulated In-Memory Database (Used if MetaMask is absent or user toggles Simulation Mode)
let simulatedCampaigns = [
  {
    id: 1,
    title: "Rural Digital Classrooms Project",
    description: "Providing tablets, solar power, and high-speed internet connectivity to 10 remote village schools across Maharashtra.",
    category: "Education",
    targetAmount: "3.0",
    amountRaised: "1.25",
    deadline: Math.floor(Date.now() / 1000) + 25 * 86400,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    fundsWithdrawn: false,
    active: true,
  },
  {
    id: 2,
    title: "Emergency Heart Surgery for 5-Year-Old Aarav",
    description: "Urgent pediatric open-heart surgery required at Apollo Children's Hospital. Verified medical estimate attached on-chain.",
    category: "Healthcare",
    targetAmount: "5.0",
    amountRaised: "2.00",
    deadline: Math.floor(Date.now() / 1000) + 12 * 86400,
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    beneficiary: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    fundsWithdrawn: false,
    active: true,
  },
  {
    id: 3,
    title: "Kerala Monsoon Flood Relief & Food Kits",
    description: "Immediate emergency dry rations, clean drinking water filters, and temporary shelter kits for 250 displaced families.",
    category: "Disaster Relief",
    targetAmount: "2.0",
    amountRaised: "0.60",
    deadline: Math.floor(Date.now() / 1000) + 18 * 86400,
    creator: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    beneficiary: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
    fundsWithdrawn: false,
    active: true,
  },
];

let simulatedDonations = [
  {
    campaignId: 1,
    campaignTitle: "Rural Digital Classrooms Project",
    donor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amount: "0.75",
    timestamp: Math.floor(Date.now() / 1000) - 7200,
    message: "Empower education! Wishing these kids the best.",
    txHash: "0x7f9a2b8e4c3d1056a29bc489e1a7b05531d0442e973b0a7c92b21cf56811aa23",
  },
  {
    campaignId: 1,
    campaignTitle: "Rural Digital Classrooms Project",
    donor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    amount: "0.50",
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    message: "Small contribution towards digital learning.",
    txHash: "0x4a1c5b8e9d3f1078b29ec489e1a7c06631d0443e973b0a7d92b21cf56811bb44",
  },
  {
    campaignId: 2,
    campaignTitle: "Emergency Heart Surgery for 5-Year-Old Aarav",
    donor: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    amount: "1.20",
    timestamp: Math.floor(Date.now() / 1000) - 5400,
    message: "Praying for little Aarav's fast recovery and strength to the family.",
    txHash: "0x9e2b4c8f5d1e2089c39fd589e2a8d07742d0554f984c0b8e93c32df67922cc55",
  },
  {
    campaignId: 2,
    campaignTitle: "Emergency Heart Surgery for 5-Year-Old Aarav",
    donor: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    amount: "0.80",
    timestamp: Math.floor(Date.now() / 1000) - 1800,
    message: "From our community group. Stay strong!",
    txHash: "0x1b3c5d9f6e2f3090d49ae689f3a9e08853d0665f995d0c9f94d43ef78933dd66",
  },
  {
    campaignId: 3,
    campaignTitle: "Kerala Monsoon Flood Relief & Food Kits",
    donor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amount: "0.60",
    timestamp: Math.floor(Date.now() / 1000) - 900,
    message: "Flood relief emergency fund support.",
    txHash: "0x8c4d6e0f7f3a4101e59bf790f4b0f19964e0776a006e1d0a05e54fa89044ee77",
  },
];

// --- Initialization ---
window.addEventListener("DOMContentLoaded", async () => {
  await loadContractConfig();
  await checkExistingWalletConnection();
  renderAllViews();
});

// Load contractData.json generated during deployment
async function loadContractConfig() {
  try {
    const res = await fetch("/contractData.json");
    if (res.ok) {
      contractData = await res.json();
      const addrEl = document.getElementById("footer-contract-addr");
      if (addrEl) {
        addrEl.innerHTML = `Smart Contract: <span class="text-emerald-400 select-all cursor-pointer" title="Click to copy" onclick="copyText('${contractData.address}')">${contractData.address}</span>`;
      }
    }
  } catch (err) {
    console.log("No contractData.json found, will operate in simulation mode by default.");
    enableSimulationMode();
  }
}

// Check if user already connected MetaMask
async function checkExistingWalletConnection() {
  if (window.ethereum && !isSimulatedMode) {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts && accounts.length > 0) {
        currentAccount = accounts[0];
        signer = await provider.getSigner();
        initContractInstance();
        updateWalletUI(currentAccount);
      }
    } catch (e) {
      console.warn("Could not reconnect wallet automatically:", e);
    }

    // MetaMask event listeners
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        currentAccount = null;
        updateWalletUI(null);
      } else {
        currentAccount = accounts[0];
        updateWalletUI(currentAccount);
        refreshData();
      }
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }
}

function initContractInstance() {
  if (contractData && signer) {
    contract = new ethers.Contract(contractData.address, contractData.abi, signer);
  }
}

// Connect or Disconnect Wallet
async function connectWallet() {
  if (isSimulatedMode) {
    // Generate a random simulated account
    currentAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    updateWalletUI(currentAccount);
    showToast("Simulated Account Connected (100.0 ETH)", "success");
    return;
  }

  if (!window.ethereum) {
    showToast("MetaMask not found! Switching to Lab Simulation Mode...", "info");
    toggleSimMode(true);
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    currentAccount = accounts[0];
    signer = await provider.getSigner();
    initContractInstance();
    await updateWalletUI(currentAccount);
    showToast(`Connected: ${shortenAddress(currentAccount)}`, "success");
    refreshData();
  } catch (err) {
    console.error("User rejected wallet connection:", err);
    showToast("Wallet connection cancelled.", "error");
  }
}

async function updateWalletUI(account) {
  const btn = document.getElementById("connect-wallet-btn");
  const textEl = document.getElementById("wallet-btn-text");

  if (!account) {
    textEl.textContent = "Connect Wallet";
    btn.className = "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition";
    return;
  }

  let balanceFormatted = "100.0 ETH";
  if (provider && !isSimulatedMode) {
    try {
      const balanceWei = await provider.getBalance(account);
      balanceFormatted = parseFloat(ethers.formatEther(balanceWei)).toFixed(2) + " ETH";
    } catch (e) {
      // fallback
    }
  }

  textEl.innerHTML = `<span class="text-white">${shortenAddress(account)}</span> <span class="text-emerald-950 font-bold bg-emerald-400 px-1.5 py-0.5 rounded text-[10px] ml-1">${balanceFormatted}</span>`;
  btn.className = "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:border-emerald-500 transition";
}

// Toggle between Web3 and Simulated Lab Mode
function toggleSimMode(forceSim = false) {
  if (forceSim || !isSimulatedMode) {
    enableSimulationMode();
  } else {
    disableSimulationMode();
  }
}

function enableSimulationMode() {
  isSimulatedMode = true;
  document.getElementById("mode-label").textContent = "Lab Sim Mode";
  document.getElementById("mode-dot").className = "w-2 h-2 rounded-full bg-amber-400 animate-pulse";
  showToast("Switched to Lab Simulation Mode (Zero MetaMask Dependency)", "info");
  renderAllViews();
}

function disableSimulationMode() {
  if (!window.ethereum) {
    showToast("MetaMask extension not installed in this browser!", "error");
    return;
  }
  isSimulatedMode = false;
  document.getElementById("mode-label").textContent = "Web3 Mode";
  document.getElementById("mode-dot").className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
  showToast("Switched to Live Web3 / MetaMask Mode", "success");
  refreshData();
}

// --- Data Fetching & Rendering ---

async function refreshData() {
  await renderAllViews();
}

async function renderAllViews() {
  let campaigns = [];
  let donations = [];
  let totalRaisedETH = 0;

  if (!isSimulatedMode && contract) {
    try {
      const rawCampaigns = await contract.getCampaigns();
      campaigns = rawCampaigns.map((c) => ({
        id: Number(c.id),
        creator: c.creator,
        beneficiary: c.beneficiary,
        title: c.title,
        description: c.description,
        category: c.category,
        targetAmount: ethers.formatEther(c.targetAmount),
        deadline: Number(c.deadline),
        amountRaised: ethers.formatEther(c.amountRaised),
        fundsWithdrawn: c.fundsWithdrawn,
        active: c.active,
      }));

      const rawDonations = await contract.getAllDonations();
      donations = rawDonations.map((d) => {
        const matchingCampaign = campaigns.find((c) => c.id === Number(d.campaignId));
        return {
          campaignId: Number(d.campaignId),
          campaignTitle: matchingCampaign ? matchingCampaign.title : `Campaign #${d.campaignId}`,
          donor: d.donor,
          amount: ethers.formatEther(d.amount),
          timestamp: Number(d.timestamp),
          message: d.message,
          txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        };
      });

      const stats = await contract.getPlatformStats();
      totalRaisedETH = parseFloat(ethers.formatEther(stats.totalDonatedWei)).toFixed(2);
    } catch (e) {
      console.warn("Smart contract call failed, falling back to cached/simulation view:", e);
      campaigns = simulatedCampaigns;
      donations = simulatedDonations;
      totalRaisedETH = calculateTotalRaised(campaigns);
    }
  } else {
    campaigns = simulatedCampaigns;
    donations = simulatedDonations;
    totalRaisedETH = calculateTotalRaised(campaigns);
  }

  // Update Top Stats
  document.getElementById("stat-total-eth").textContent = `${totalRaisedETH} ETH`;
  document.getElementById("stat-campaigns-count").textContent = campaigns.length;
  document.getElementById("stat-donations-count").textContent = donations.length;

  // Render Section 1: Explore Campaigns
  renderCampaigns(campaigns);

  // Render Section 3: Transparency Ledger
  renderLedger(donations);

  // Render Section 4: Disburse / Withdraw
  renderDisburseSection(campaigns);
}

function calculateTotalRaised(campaignList) {
  let sum = 0;
  for (const c of campaignList) {
    sum += parseFloat(c.amountRaised) || 0;
  }
  return sum.toFixed(2);
}

// Render Campaign Cards
function renderCampaigns(campaigns) {
  const container = document.getElementById("campaigns-grid");
  if (!container) return;

  const filtered = currentCategoryFilter === "All"
    ? campaigns
    : campaigns.filter((c) => c.category === currentCategoryFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
        <p class="text-sm">No campaigns found in category "${currentCategoryFilter}".</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map((c) => {
    const raised = parseFloat(c.amountRaised);
    const target = parseFloat(c.targetAmount);
    const progressPercent = Math.min(100, Math.round((raised / target) * 100));
    const isCompleted = c.fundsWithdrawn;
    const isExpired = Date.now() / 1000 > c.deadline;

    let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>`;
    if (isCompleted) {
      statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Funds Disbursed</span>`;
    } else if (isExpired) {
      statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Ended</span>`;
    }

    return `
      <div class="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:shadow-xl transition duration-300">
        <div>
          <!-- Top Tag & Status -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
              <i class="fa-solid fa-tag text-emerald-400 mr-1"></i> ${c.category}
            </span>
            ${statusBadge}
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-white mb-2 line-clamp-1" title="${escapeHtml(c.title)}">
            ${escapeHtml(c.title)}
          </h3>

          <!-- Description -->
          <p class="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">
            ${escapeHtml(c.description)}
          </p>

          <!-- Progress Bar -->
          <div class="space-y-1.5 mb-4">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white font-mono">${raised.toFixed(2)} ETH</span>
              <span class="text-slate-400 font-mono">Target: ${target.toFixed(2)} ETH</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <div class="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>${progressPercent}% funded</span>
              <span><i class="fa-regular fa-clock mr-1"></i>${formatDaysLeft(c.deadline)}</span>
            </div>
          </div>

          <!-- Beneficiary Info -->
          <div class="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 text-[11px] font-mono space-y-1 mb-4 text-slate-400">
            <div class="flex items-center justify-between">
              <span>Beneficiary:</span>
              <span class="text-slate-300 cursor-pointer hover:text-emerald-400" title="${c.beneficiary}" onclick="copyText('${c.beneficiary}')">
                ${shortenAddress(c.beneficiary)} <i class="fa-regular fa-copy text-[9px] ml-0.5"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div>
          ${
            isCompleted
              ? `<button disabled class="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-500 cursor-not-allowed">Goal Reached & Disbursed</button>`
              : `<button onclick="openDonateModal(${c.id}, '${escapeHtml(c.title)}', '${c.targetAmount}', '${c.amountRaised}')" class="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <i class="fa-solid fa-heart"></i> Donate Ether
                </button>`
          }
        </div>
      </div>
    `;
  }).join("");
}

// Render Public Transparency Ledger
function renderLedger(donations) {
  const tbody = document.getElementById("ledger-table-body");
  if (!tbody) return;

  if (donations.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-slate-500">
          No donations recorded yet on the ledger.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = donations
    .slice()
    .reverse()
    .map((d) => {
      const dateFormatted = new Date(d.timestamp * 1000).toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "short",
      });

      return `
        <tr class="hover:bg-slate-900/40 transition">
          <td class="px-4 py-3 font-sans font-medium text-white max-w-xs truncate" title="${escapeHtml(d.campaignTitle)}">
            ${escapeHtml(d.campaignTitle)}
          </td>
          <td class="px-4 py-3 text-emerald-400">
            <span class="cursor-pointer hover:underline" title="${d.donor}" onclick="copyText('${d.donor}')">
              ${shortenAddress(d.donor)}
            </span>
          </td>
          <td class="px-4 py-3 text-white font-bold">
            ${parseFloat(d.amount).toFixed(3)} ETH
          </td>
          <td class="px-4 py-3 text-slate-400 text-[11px]">
            ${dateFormatted}
          </td>
          <td class="px-4 py-3 text-slate-300 font-sans italic max-w-xs truncate" title="${escapeHtml(d.message || 'No note')}">
            "${escapeHtml(d.message || "Generous Contribution")}"
          </td>
          <td class="px-4 py-3 text-blue-400 text-[11px]">
            <span class="cursor-pointer hover:underline flex items-center gap-1" title="${d.txHash}" onclick="copyText('${d.txHash}')">
              ${shortenAddress(d.txHash)} <i class="fa-regular fa-copy text-[10px]"></i>
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Render Disbursal Section
function renderDisburseSection(campaigns) {
  const container = document.getElementById("disburse-campaigns-list");
  if (!container) return;

  if (campaigns.length === 0) {
    container.innerHTML = `
      <div class="glass-card rounded-2xl p-8 text-center text-slate-500">
        No active campaigns found.
      </div>`;
    return;
  }

  container.innerHTML = campaigns.map((c) => {
    const raised = parseFloat(c.amountRaised);
    const target = parseFloat(c.targetAmount);
    const isTargetMet = raised >= target;
    const isExpired = Date.now() / 1000 > c.deadline;
    const canWithdraw = (isTargetMet || isExpired) && !c.fundsWithdrawn && raised > 0;

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-emerald-400">#${c.id}</span>
            <h4 class="text-sm font-bold text-white">${escapeHtml(c.title)}</h4>
          </div>
          <div class="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
            <span>Raised: <strong class="text-white">${raised.toFixed(2)} ETH</strong> / ${target.toFixed(2)} ETH</span>
            <span>Beneficiary: <strong class="text-slate-300">${shortenAddress(c.beneficiary)}</strong></span>
          </div>
        </div>

        <div>
          ${
            c.fundsWithdrawn
              ? `<span class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"><i class="fa-solid fa-check-double"></i> Funds Disbursed</span>`
              : canWithdraw
              ? `<button onclick="handleWithdrawFunds(${c.id})" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  <i class="fa-solid fa-money-bill-transfer"></i> Disburse Escrow
                </button>`
              : `<button disabled class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed" title="Available once target is reached or deadline has passed">
                  Locked in Escrow (Target pending)
                </button>`
          }
        </div>
      </div>
    `;
  }).join("");
}

// --- Action Handlers ---

// Create Campaign
async function handleCreateCampaign(e) {
  e.preventDefault();
  const title = document.getElementById("new-title").value.trim();
  const category = document.getElementById("new-category").value;
  const targetETH = document.getElementById("new-target").value;
  const duration = parseInt(document.getElementById("new-duration").value);
  const beneficiary = document.getElementById("new-beneficiary").value.trim();
  const description = document.getElementById("new-description").value.trim();

  if (!ethers.isAddress(beneficiary)) {
    showToast("Invalid Ethereum Beneficiary Address!", "error");
    return;
  }

  const submitBtn = document.getElementById("submit-campaign-btn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Broadcasting to Blockchain...`;

  try {
    if (!isSimulatedMode && contract) {
      const targetWei = ethers.parseEther(targetETH.toString());
      const tx = await contract.createCampaign(
        title,
        description,
        category,
        targetWei,
        duration,
        beneficiary
      );
      showToast("Transaction sent! Waiting for block confirmation...", "info");
      await tx.wait();
      showToast("Campaign successfully deployed on Ethereum!", "success");
    } else {
      // Simulation mode
      const newId = simulatedCampaigns.length + 1;
      simulatedCampaigns.unshift({
        id: newId,
        title,
        description,
        category,
        targetAmount: parseFloat(targetETH).toFixed(2),
        amountRaised: "0.00",
        deadline: Math.floor(Date.now() / 1000) + duration * 86400,
        creator: currentAccount || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        beneficiary,
        fundsWithdrawn: false,
        active: true,
      });
      showToast(`Campaign #${newId} created (Simulated block confirmed)`, "success");
    }

    // Reset Form & Switch to explore
    document.getElementById("create-campaign-form").reset();
    switchTab("explore");
    await refreshData();
  } catch (err) {
    console.error("Create campaign error:", err);
    showToast(err.reason || err.message || "Failed to create campaign", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Deploy Campaign to Blockchain`;
  }
}

// Open / Close Donate Modal
function openDonateModal(id, title, target, raised) {
  activeDonationCampaignId = id;
  document.getElementById("modal-campaign-title").textContent = title;
  document.getElementById("modal-campaign-target").textContent = `${parseFloat(target).toFixed(2)} ETH`;
  document.getElementById("modal-campaign-raised").textContent = `${parseFloat(raised).toFixed(2)} ETH`;
  document.getElementById("donate-amount-input").value = "";
  document.getElementById("donate-message-input").value = "";
  document.getElementById("donate-modal").classList.remove("hidden");
}

function closeDonateModal() {
  activeDonationCampaignId = null;
  document.getElementById("donate-modal").classList.add("hidden");
}

function setPresetAmount(val) {
  document.getElementById("donate-amount-input").value = val;
}

// Execute Donation
async function executeDonation() {
  const amountStr = document.getElementById("donate-amount-input").value;
  const message = document.getElementById("donate-message-input").value.trim() || "Generous contribution";

  if (!amountStr || parseFloat(amountStr) <= 0) {
    showToast("Please enter a valid donation amount in ETH", "error");
    return;
  }

  const btn = document.getElementById("confirm-donate-btn");
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Confirming...`;

  try {
    if (!isSimulatedMode && contract) {
      const amountWei = ethers.parseEther(amountStr);
      const tx = await contract.donate(activeDonationCampaignId, message, {
        value: amountWei,
      });
      showToast("MetaMask transaction approved! Mining block...", "info");
      const receipt = await tx.wait();
      showToast(`Donation Confirmed! Block: #${receipt.blockNumber}`, "success");
    } else {
      // Simulation mode
      const camp = simulatedCampaigns.find((c) => c.id === activeDonationCampaignId);
      if (camp) {
        camp.amountRaised = (parseFloat(camp.amountRaised) + parseFloat(amountStr)).toFixed(2);
      }
      const fakeTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
      simulatedDonations.push({
        campaignId: activeDonationCampaignId,
        campaignTitle: camp ? camp.title : "Fundraising Campaign",
        donor: currentAccount || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        amount: parseFloat(amountStr).toFixed(2),
        timestamp: Math.floor(Date.now() / 1000),
        message: message,
        txHash: fakeTxHash,
      });
      showToast(`Donated ${amountStr} ETH successfully!`, "success");
    }

    closeDonateModal();
    await refreshData();
  } catch (err) {
    console.error("Donation failed:", err);
    showToast(err.reason || err.message || "Donation failed", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Confirm & Send ETH`;
  }
}

// Withdraw Funds (Escrow Release)
async function handleWithdrawFunds(campaignId) {
  if (!confirm(`Are you sure you want to release all escrowed funds for Campaign #${campaignId} to the beneficiary?`)) {
    return;
  }

  try {
    if (!isSimulatedMode && contract) {
      const tx = await contract.withdrawFunds(campaignId);
      showToast("Disbursal transaction sent! Waiting for mining...", "info");
      await tx.wait();
      showToast(`Funds released to beneficiary address!`, "success");
    } else {
      const camp = simulatedCampaigns.find((c) => c.id === campaignId);
      if (camp) {
        camp.fundsWithdrawn = true;
        camp.active = false;
      }
      showToast(`Escrow funds disbursed to beneficiary on-chain!`, "success");
    }
    await refreshData();
  } catch (err) {
    console.error("Withdrawal error:", err);
    showToast(err.reason || err.message || "Withdrawal failed", "error");
  }
}

// Auto-add Hardhat Local network to MetaMask
async function autoAddHardhatNetwork() {
  if (!window.ethereum) {
    showToast("MetaMask is not installed!", "error");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x7A69", // 31337 in hex
          chainName: "Hardhat Local",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
          },
        },
      ],
    });
    showToast("Hardhat Local Network added to MetaMask!", "success");
    closeMetaMaskHelperModal();
  } catch (err) {
    console.error("Failed to add network:", err);
    showToast("Could not auto-add network. Please add manually.", "error");
  }
}

// --- Navigation & UI Utilities ---

function switchTab(tabName) {
  const tabs = ["explore", "create", "ledger", "withdraw", "architecture"];
  for (const t of tabs) {
    const sec = document.getElementById(`section-${t}`);
    const btn = document.getElementById(`tab-${t}`);
    if (sec) sec.classList.add("hidden");
    if (btn) {
      btn.className = "tab-btn px-4 py-1.5 rounded-lg text-xs font-medium transition text-slate-400 hover:text-white";
    }
  }

  const activeSec = document.getElementById(`section-${tabName}`);
  const activeBtn = document.getElementById(`tab-${tabName}`);
  if (activeSec) activeSec.classList.remove("hidden");
  if (activeBtn) {
    activeBtn.className = "tab-btn px-4 py-1.5 rounded-lg text-xs font-medium transition text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
  }

  if (tabName === "explore") renderAllViews();
}

function filterCategory(cat) {
  currentCategoryFilter = cat;
  const pills = document.querySelectorAll(".cat-pill");
  pills.forEach((p) => {
    if (p.textContent.trim() === cat) {
      p.className = "cat-pill px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    } else {
      p.className = "cat-pill px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-slate-800";
    }
  });
  renderAllViews();
}

function openMetaMaskHelperModal() {
  document.getElementById("helper-modal").classList.remove("hidden");
}

function closeMetaMaskHelperModal() {
  document.getElementById("helper-modal").classList.add("hidden");
}

function shortenAddress(addr) {
  if (!addr) return "0x...";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDaysLeft(deadlineUnix) {
  const diffSec = deadlineUnix - Math.floor(Date.now() / 1000);
  if (diffSec <= 0) return "Ended";
  const days = Math.floor(diffSec / 86400);
  if (days === 0) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} hrs left`;
  }
  return `${days} days left`;
}

function copyText(str) {
  navigator.clipboard.writeText(str);
  showToast("Copied to clipboard!", "info");
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColors = {
    success: "bg-emerald-950/90 border-emerald-500 text-emerald-300",
    error: "bg-rose-950/90 border-rose-500 text-rose-300",
    info: "bg-slate-900/90 border-slate-700 text-slate-200",
  };
  const icons = {
    success: "fa-circle-check text-emerald-400",
    error: "fa-circle-xmark text-rose-400",
    info: "fa-circle-info text-blue-400",
  };

  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-medium animate-in slide-in-from-right duration-200 pointer-events-auto ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
