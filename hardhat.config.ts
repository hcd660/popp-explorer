import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import dotenv from "dotenv";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "@primitivefi/hardhat-dodoc";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenv.config();

const chainIds = {
  opBNB: 5611,
  hardhat: 31337,
  ganache: 1337,
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  avax: 43114,
  avax_testnet: 43113,
  fantom: 250,
  fantom_testnet: 4002,
  polygon: 137,
  mumbai: 80001,
  optimism: 10,
  optimism_testnet: 69,
  arbitrum: 42161,
  arbitrum_testnet: 421611,
  heco: 128,
};

// Ensure that we have all the environment variables we need.
const testPrivateKey: string = process.env.TEST_PRIVATE_KEY || "";
const alchemyKey: string = process.env.ALCHEMY_KEY || "";
const explorerScanKey: string = process.env.SCAN_API_KEY || "";

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  if (!alchemyKey) {
    throw new Error("Missing ALCHEMY_KEY");
  }

  const polygonNetworkName = network === "polygon" ? "mainnet" : "mumbai";

  let nodeUrl =
      chainIds[network] == 137 || chainIds[network] == 80001
          ? `https://polygon-${polygonNetworkName}.g.alchemy.com/v2/${alchemyKey}`
          : `https://eth-${network}.alchemyapi.io/v2/${alchemyKey}`;

  switch (network) {
    case "optimism":
      nodeUrl = `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`;
      break;
    case "optimism_testnet":
      nodeUrl = `https://opt-kovan.g.alchemy.com/v2/${alchemyKey}`;
      break;
    case "arbitrum":
      nodeUrl = `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`;
      break;
    case "arbitrum_testnet":
      nodeUrl = `https://arb-rinkeby.g.alchemy.com/v2/${alchemyKey}`;
      break;
    case "avax":
      nodeUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "avax_testnet":
      nodeUrl = "https://api.avax-test.network/ext/bc/C/rpc";
      break;
    case "fantom":
      nodeUrl = "https://rpc.ftm.tools";
      break;
    case "fantom_testnet":
      nodeUrl = "https://rpc.testnet.fantom.network";
      break;
    case "heco":
      nodeUrl = "https://http-mainnet.hecochain.com";
      break;
    case "ganache":
      nodeUrl = "http://127.0.0.1:8545";
      break;
    case "opBNB":
      nodeUrl = "https://opbnb-testnet-rpc.bnbchain.org";
      break;
  }

  return {
    chainId: chainIds[network],
    url: nodeUrl,
    accounts: [`${testPrivateKey}`],
  };
}

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.19",
    settings: {
      metadata: {
        bytecodeHash: "ipfs",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 1600,
      },
    },
  },
  abiExporter: {
    flat: true,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || process.env.SCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY || process.env.SCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY || process.env.SCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY || process.env.SCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY || process.env.SCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY || process.env.SCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || process.env.SCAN_API_KEY,
      opera: process.env.FANTOMSCAN_API_KEY || process.env.SCAN_API_KEY,
      ftmTestnet: process.env.FANTOMSCAN_API_KEY || process.env.SCAN_API_KEY,
      avalanche: process.env.SNOWTRACE_API_KEY || process.env.SCAN_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || process.env.SCAN_API_KEY,
      optimisticEthereum: process.env.OPTIMISM_SCAN_API_KEY || process.env.SCAN_API_KEY,
      // optimisticKovan: process.env.OPTIMISM_SCAN_API_KEY || process.env.SCAN_API_KEY,
      arbitrumOne: process.env.ARBITRUM_SCAN_API_KEY || process.env.SCAN_API_KEY,
      arbitrumTestnet: process.env.ARBITRUM_SCAN_API_KEY || process.env.SCAN_API_KEY,
      heco: process.env.ARBITRUM_SCAN_API_KEY || process.env.SCAN_API_KEY,
    },
  },
  gasReporter: {
    coinmarketcap: process.env.REPORT_GAS_COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
  },
  dodoc: {
    runOnCompile: true,
  },
};

if (testPrivateKey) {
  config.networks = {
    opBNB: createTestnetConfig("opBNB"),
    ganache: createTestnetConfig("ganache"),
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    rinkeby: createTestnetConfig("rinkeby"),
    polygon: createTestnetConfig("polygon"),
    mumbai: createTestnetConfig("mumbai"),
    fantom: createTestnetConfig("fantom"),
    fantom_testnet: createTestnetConfig("fantom_testnet"),
    avax: createTestnetConfig("avax"),
    avax_testnet: createTestnetConfig("avax_testnet"),
    arbitrum: createTestnetConfig("arbitrum"),
    arbitrum_testnet: createTestnetConfig("arbitrum_testnet"),
    optimism: createTestnetConfig("optimism"),
    optimism_testnet: createTestnetConfig("optimism_testnet"),
    heco: createTestnetConfig("heco"),
  };
}

config.networks = {
  ...config.networks,
  hardhat: {
    chainId: 1337,
  },
};

const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);

export default config;
