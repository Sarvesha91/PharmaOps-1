import { ethers } from 'ethers';

import { getEnv } from '../config/env';

const getProviderAndWallet = () => {
  const rpcUrl = getEnv('BESU_RPC_URL', 'http://127.0.0.1:8545');
  const privateKey = getEnv('BESU_PRIVATE_KEY', '');
  if (!privateKey) {
    throw new Error('BESU_PRIVATE_KEY is not configured');
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return { provider, wallet };
};

const getContract = () => {
  const { wallet } = getProviderAndWallet();
  const address = getEnv('PROVENANCE_CONTRACT_ADDRESS');
  const abi = [
    'function anchorDocument(bytes32 documentHash, string versionId) external',
    'function recordShipment(bytes32 shipmentId, string eventType) external',
  ];
  return new ethers.Contract(address, abi, wallet);
};

export const anchorApprovedDocument = async (documentId: string, version: string) => {
  try {
    const contract = getContract();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(documentId + ':' + version));
    const tx = await contract.anchorDocument(hash, version);
    await tx.wait();
    return tx.hash as string;
  } catch {
    // In early phases we don't fail the business flow if anchoring fails
    return null;
  }
};

export const recordShipmentEventOnChain = async (shipmentId: string, eventType: string) => {
  try {
    const contract = getContract();
    const idHash = ethers.keccak256(ethers.toUtf8Bytes(shipmentId));
    const tx = await contract.recordShipment(idHash, eventType);
    await tx.wait();
    return tx.hash as string;
  } catch {
    return null;
  }
};


