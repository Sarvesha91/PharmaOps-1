## PharmaOps Provenance Contracts

Hardhat workspace targeting Hyperledger Besu to anchor hashes of approved regulatory documents and critical shipment events.

### Quick start

```bash
cd blockchain
npx hardhat compile
npx hardhat test
# Deploy to local Besu
npx hardhat run scripts/deploy.ts --network besu
```

Set `BESU_RPC_URL` and `BESU_PRIVATE_KEY` to point at your permissioned Besu network. Contract artifacts can be ingested by the backend for anchoring workflows via web3.js or ethers.

