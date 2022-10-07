const { time, loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const Treasuryabi = require("../artifacts/contracts/Treasury.sol/Treasury.json");

describe("Governance Test", function () {

    async function SaveStaticVars() {
        const [executor, proposer, voter1, voter2, voter3, voter4, voter5] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("ConquerTokenDao");
        const Treasury = await ethers.getContractFactory("Treasury");
        const TimeLock = await ethers.getContractFactory("TimeLockConquerDao");
        const Governance = await ethers.getContractFactory("ConquerBlockGovernance");
        let isRelease, funds, blockNumber, proposalState, vote;

        const supply = web3.utils.toWei('1000', 'ether'); // 1000 tokens

        const EtherPerUser = web3.utils.toWei('50', 'ether');

        const token = await Token.deploy("ConquerVote", "CQV", supply);

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


        /********* Deploy Governance ************/

        const Quorum = 5 // Percentage of total supply of tokens needed to aprove proposals (5%)
        const VotingDelay = 0 // How many blocks after proposal until voting becomes active
        const VotingPeriod = 5 // How many blocks to allow voters to vote

        const governance = await Governance.deploy(token.address, timelock.address, Quorum, VotingDelay, VotingPeriod);

        await token.connect(voter1).delegate(voter1.address);
        await token.connect(voter2).delegate(voter2.address);
        await token.connect(voter3).delegate(voter3.address);
        await token.connect(voter4).delegate(voter4.address);
        await token.connect(voter5).delegate(voter5.address);


        /********* Deploy Treasury ************/

        // Timelock contract will be the owner of our treasury contract.
        // In the provided example, once the proposal is successful and executed,
        // timelock contract will be responsible for calling the function.

        const fondos = web3.utils.toWei('25', 'ether');

        const treasury = await Treasury.deploy(executor.address, { value: fondos });

        await treasury.transferOwnership(timelock.address, { from: executor.address })

        // isRelease = await treasury.isRelease(); // true - false

        // Assign roles

        const proposerRole = await timelock.PROPOSER_ROLE()
        const executorRole = await timelock.EXECUTOR_ROLE()

        await timelock.grantRole(proposerRole, governance.address, { from: executor.address })
        await timelock.grantRole(executorRole, governance.address, { from: executor.address })


        return { token, timelock, governance, treasury, executor, proposer, voter1, voter2, voter3, voter4, voter5 }

    }



    it("Init Proposal and vote", async function () {
        const { token, timelock, governance, treasury, executor, proposer, voter1, voter2, voter3, voter4, voter5 } = await loadFixture(SaveStaticVars);

        funds = await web3.eth.getBalance(treasury.address)
        console.log(`Funds inside of treasury: ${web3.utils.fromWei(funds.toString(), 'ether')} ETH\n`)

        let iface = new ethers.utils.Interface(Treasuryabi.abi)
        const encodedFunction = iface.encodeFunctionData("releaseFunds")

        const description = "Release Funds from Treasury"

        const sendPropose = await governance.connect(proposer).propose([treasury.address], [0], [encodedFunction], description)
        const tx = await sendPropose.wait()
        const id = tx.events[0].args.proposalId // 1

        console.log(`Created Proposal: ${id.toString()}\n`)

        proposalState = await governance.state(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Pending) \n`);

        const snapshot = await governance.proposalSnapshot(id)
        console.log(`Proposal created on block ${snapshot.toString()}`)

        const deadline = await governance.proposalDeadline(id)
        console.log(`Proposal deadline on block ${deadline.toString()}\n`)

        blockNumber = await web3.eth.getBlockNumber() // 8000 -> 2000
        console.log(`Current blocknumber: ${blockNumber}\n`)

        const quorum = await governance.quorum(blockNumber - 1)
        console.log(`Number of votes required to pass: ${web3.utils.fromWei(quorum.toString(), 'ether')}\n`)

        vote = await governance.connect(voter1).castVote(id, 1)
        vote = await governance.connect(voter2).castVote(id, 1)
        vote = await governance.connect(voter3).castVote(id, 1)
        vote = await governance.connect(voter4).castVote(id, 0)
        vote = await governance.connect(voter5).castVote(id, 2)

        proposalState = await governance.state(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Active) \n`)

        const { againstVotes, forVotes, abstainVotes } = await governance.proposalVotes(id)
        console.log(`Votes For: ${web3.utils.fromWei(forVotes.toString(), 'ether')}`)
        console.log(`Votes Against: ${web3.utils.fromWei(againstVotes.toString(), 'ether')}`)
        console.log(`Votes Neutral: ${web3.utils.fromWei(abstainVotes.toString(), 'ether')}\n`)

        blockNumber = await web3.eth.getBlockNumber()
        console.log(`Current blocknumber: ${blockNumber}\n`)

        proposalState = await governance.state(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Succeeded) \n`)

        const hash = web3.utils.sha3("Release Funds from Treasury")
        await governance.queue([treasury.address], [0], [encodedFunction], hash, { from: executor.address })

        proposalState = await governance.state(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Queued) \n`)

        await governance.execute([treasury.address], [0], [encodedFunction], hash, { from: executor.address })

        proposalState = await governance.state(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Executed) \n`)

        isReleased = await treasury.isReleased()
        console.log(`Funds released? ${isReleased}`)

        funds = await ethers.provider.getBalance(treasury.address)
        console.log(`Funds inside of treasury: ${web3.utils.fromWei(funds.toString(), 'ether')} ETH\n`)
    })

})