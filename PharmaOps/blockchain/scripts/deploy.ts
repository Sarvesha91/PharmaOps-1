import { ethers } from 'hardhat';

async function main() {
  const Contract = await ethers.getContractFactory('PharmaProvenance');
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  console.log(`PharmaProvenance deployed to ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

