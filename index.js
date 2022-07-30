const { providers, Contract } = require("ethers");
const player = require("play-sound")((opts = {}));

const rpcURL = "https://cloudflare-eth.com";
const provider = new providers.JsonRpcProvider(rpcURL);

const CONTRACT_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const CONTRACT_ABI = require("./ERC20-abi.json");
const contract = new Contract(CONTRACT_ADDR, CONTRACT_ABI, provider);

// USDC use 6 decimals
const TRANSFER_THRESHOLD = 100000000000;

const playSound = () => {
  player.play("./ding.mp3", function (err) {
    if (err) throw err;
  });
};

const main = async () => {
  const name = await contract.name();
  console.log(
    "Whale tracker started!\n Listening for large transfers on: " + name
  );

  contract.on("Transfer", (from, to, amount, data) => {
    if (amount.gte(TRANSFER_THRESHOLD)) {
      playSound();
      console.log(
        `New big transfer for ${name}: https://etherscan.io/tx/${data.transactionHash}`
      );
    }
  });
};

main();
