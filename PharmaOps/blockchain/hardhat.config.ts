import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  defaultNetwork: 'hardhat',
  networks: {
    besu: {
      url: process.env.BESU_RPC_URL || 'http://127.0.0.1:8545',
      accounts: process.env.BESU_PRIVATE_KEY ? [process.env.BESU_PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;

