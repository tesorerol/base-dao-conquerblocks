import React, { useContext, useEffect, useState } from 'react'
import { WalletContext } from '../../Provider/WalletConnect'
import GovernanceAbi from '../../artifacts/contracts/Governance.sol/ConquerBlockGovernance.json';
import ModalProposal from '../../Components/Modal/ModalProposal';
import TokenVote20 from '../../artifacts/contracts/Token.sol/ConquerTokenDao.json';
import Swal from 'sweetalert2';
const Proposal = () => {
    const { address, Provider } = useContext(WalletContext);
    const [ProposalList, setProposalList] = useState([]);
    const [ProposalSelect, setProposalSelect] = useState(null);
    const [Open, setOpen] = useState(false);

    useEffect(() => {
        GetProposal()
        // eslint-disable-next-line
    }, [])

    async function GetProposal() {
        const Governance = new Provider.eth.Contract(GovernanceAbi.abi, process.env.REACT_APP_GOVERNANCEADDRESS);
        Governance.getPastEvents("ProposalCreated", { fromBlock: 0, toBlock: 'latest' })
            .then(async (r) => {
                console.log(r)
                let newArray = [];
                for (let index = 0; index < r.length; index++) {
                    const element = r[index];
                    newArray.push(element.returnValues);
                }
                setProposalList(newArray)
            })
            .catch(e => {
                console.log(e)
            })
    }

    async function AsignDelegate() {
        const Token = new Provider.eth.Contract(TokenVote20.abi, process.env.REACT_APP_TOKENVOTE);
        Token.methods.delegate(address).send({ from: address })
            .then(r => {
                Swal.fire({ title: "Success", icon: "success" });
                console.log("delegado", r);
            })
    }

    return (
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="h-96 rounded-lg">
                    <table className="border-collapse border border-slate-400 w-full h-full rounded-lg">
                        <thead>
                            <tr>
                                <th className="border border-slate-300 ...">Proposer</th>
                                <th className="border border-slate-300 ...">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ProposalList.map((proposal, index) => {
                                    return <tr key={index}>
                                        <td className="border border-slate-300 ...">{proposal.proposer}</td>
                                        <td className="border border-slate-300 ...">{proposal.description}</td>
                                        <td className="border border-slate-300 ...">
                                            <button onClick={() => { setProposalSelect(proposal); setOpen(true); }} className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                                View Proposal
                                            </button>

                                            <button onClick={() => { AsignDelegate(); }} className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                                Delegate
                                            </button>
                                        </td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            <ModalProposal open={Open} setOpen={setOpen} proposal={ProposalSelect} />
        </div>
    )
}

export default Proposal