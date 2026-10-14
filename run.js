/**
 * CharityChain - 1-Click All-in-One Automated Runner
 * 1. Starts Local Hardhat Node
 * 2. Deploys Smart Contract
 * 3. Seeds Sample Campaigns & Donations
 * 4. Starts Web Server & Opens Browser
 */

const { spawn, execSync } = require("child_process");
const http = require("http");
const path = require("path");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForNode() {
  console.log("Waiting for Hardhat local blockchain node to start on port 8545...");
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: "127.0.0.1",
            port: 8545,
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
          (res) => resolve(res)
        );
        req.on("error", reject);
        req.write(JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }));
        req.end();
      });
      console.log("Local Ethereum Node is ONLINE!\n");
      return true;
    } catch (err) {
      await sleep(1000);
    }
  }
  throw new Error("Hardhat node failed to start within 30 seconds.");
}

async function main() {
  console.log("==========================================================");
  console.log("     Starting CharityChain Decentralized Application      ");
  console.log("==========================================================\n");

  // Step 1: Start Hardhat Node
  console.log("[1/4] Spawning Hardhat Ethereum Node...");
  const hardhatCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const nodeProcess = spawn(hardhatCmd, ["hardhat", "node"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  process.on("exit", () => nodeProcess.kill());
  process.on("SIGINT", () => {
    nodeProcess.kill();
    process.exit();
  });

  await waitForNode();

  // Step 2: Deploy Contract
  console.log("[2/4] Deploying CharityPlatform Smart Contract to localhost...");
  try {
    execSync(`${hardhatCmd} hardhat run scripts/deploy.js --network localhost`, {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    });
  } catch (err) {
    console.error("Deploy failed:", err.message);
  }

  // Step 3: Seed Campaigns
  console.log("[3/4] Seeding demo campaigns and transparent donations...");
  try {
    execSync(`${hardhatCmd} hardhat run scripts/seed.js --network localhost`, {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    });
  } catch (err) {
    console.error("Seed failed:", err.message);
  }

  // Step 4: Start Express Frontend Server on Port 5000
  console.log("[4/4] Starting Web Frontend Server on http://localhost:5000...");
  require("./server.js");

  // Automatically open browser
  const startCmd =
    process.platform === "win32"
      ? "start http://localhost:5000"
      : process.platform === "darwin"
      ? "open http://localhost:5000"
      : "xdg-open http://localhost:5000";

  setTimeout(() => {
    try {
      execSync(startCmd);
    } catch (e) {
      // ignore
    }
  }, 1500);

  console.log("\n==========================================================");
  console.log(">> APP READY AT: http://localhost:5000");
  console.log(">> Press Ctrl + C to stop the application.");
  console.log("==========================================================\n");
}

main().catch(console.error);
