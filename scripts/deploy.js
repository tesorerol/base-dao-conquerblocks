const hre = require("hardhat");

async function main() {
  const [executor, proposer, voter1, voter2, voter3, voter4, voter5] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("ConquerTokenDao");
  const Treasury = await ethers.getContractFactory("Treasury");
  const TimeLock = await ethers.getContractFactory("TimeLockConquerDao");
  const Governance = await ethers.getContractFactory("ConquerBlockGovernance");

 
  const supply = web3.utils.toWei('1000', 'ether'); // 1000 tokens

  const EtherPerUser = web3.utils.toWei('50', 'ether');

  const token = await Token.deploy("ConquerVote", "CQV", supply);
  console.log("Contract TokenVote20:", token.address);
  // transferimos tokens a los votantes

  await token.transfer(voter1.address, EtherPerUser, { from: executor.address });
  await token.transfer(voter2.address, EtherPerUser, { from: executor.address });
  await token.transfer(voter3.address, EtherPerUser, { from: executor.address });
  await token.transfer(voter4.address, EtherPerUser, { from: executor.address });
  await token.transfer(voter5.address, EtherPerUser, { from: executor.address });
  await token.transfer(proposer.address, EtherPerUser, { from: executor.address });

  /********* Deploy Timelock ************/
  const minDelay = 1; // How long do we have to wait until we can execute after a passed proposal


  // In addition to passing minDelay, we also need to pass 2 arrays.
  // The 1st array contains addresses of those who are allowed to make a proposal.
  // The 2nd array contains addresses of those who are allowed to make executions.
  const timelock = await TimeLock.deploy(minDelay, [proposer.address], [executor.address]);
  console.log("Contract timelock address:", timelock.address);

  /********* Deploy Governance ************/

  const Quorum = 5 // Percentage of total supply of tokens needed to aprove proposals (5%)
  const VotingDelay = 1 // How many blocks after proposal until voting becomes active
  const VotingPeriod = 50400 // How many blocks to allow voters to vote ( 50400-> 1 week )

  const governance = await Governance.deploy(token.address, timelock.address, Quorum, VotingDelay, VotingPeriod);

  console.log("Contract governance address:", governance.address);
  /********* Deploy Treasury ************/

  // Timelock contract will be the owner of our treasury contract.
  // In the provided example, once the proposal is successful and executed,
  // timelock contract will be responsible for calling the function.

  const fondos = web3.utils.toWei('0.002', 'ether');

  const treasury = await Treasury.deploy(executor.address, { value: fondos });

  console.log("Contract treasury address:", treasury.address);

  await treasury.transferOwnership(timelock.address, { from: executor.address })

  // isRelease = await treasury.isRelease(); // true - false

  // Assign roles

  const proposerRole = await timelock.PROPOSER_ROLE()
  const executorRole = await timelock.EXECUTOR_ROLE()

  await timelock.grantRole(proposerRole, governance.address, { from: executor.address })
  await timelock.grantRole(executorRole, governance.address, { from: executor.address })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
