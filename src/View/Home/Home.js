import React, { useContext, useEffect, useState } from 'react'
import { WalletContext } from '../../Provider/WalletConnect';
import GovernanceABi from '../../artifacts/contracts/Governance.sol/ConquerBlockGovernance.json';
import TokenVote20 from '../../artifacts/contracts/Token.sol/ConquerTokenDao.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';
const Home = () => {
    const { address, Provider, connectToWallet } = useContext(WalletContext);
    const [Community, setCommunity] = useState([]);
    const [Proposal, setProposal] = useState("");
    useEffect(() => {
        GetCommunity()
        // eslint-disable-next-line
    }, [])

    async function GetCommunity() {
        const contract = new Provider.eth.Contract(TokenVote20.abi, process.env.REACT_APP_TOKENVOTE);
        // 5000 Limit for call events
        // obtener el bloque actual - 5000;
        contract.getPastEvents("Transfer", { fromBlock: 0, toBlock: 'latest' }).then(async (r) => {
            console.log(r)
            let newArray = [];
            for (let index = 0; index < r.length; index++) {
                const element = r[index];
                const WalletBalance = await contract.methods.balanceOf(element.returnValues.to).call();
                newArray.push({ address: element.returnValues.to, balance: WalletBalance });
            }
            setCommunity(newArray)
        })
    }

    async function EmitProposal() {
        const Governance = new Provider.eth.Contract(GovernanceABi.abi, process.env.REACT_APP_GOVERNANCEADDRESS);
        Governance.methods.propose([process.env.REACT_APP_TREASURY], [0], [0], Proposal).send({ from: address })
            .then(r => {
                console.log(r)
                Swal.fire({
                    title: "Create Propose",
                    icon: "success"
                })
                setProposal("")
            })
            .catch(e => {
                console.log(e)
            })
    }
    return (
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0 grid grid-cols-2 md:grid-cols-2">
                <div className="h-96 rounded-lg">
                    <table className="border-collapse border border-slate-400 w-full h-full rounded-lg">
                        <thead>
                            <tr>
                                <th className="border border-slate-300 ...">Address</th>
                                <th className="border border-slate-300 ...">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Community.map((user, index) => {
                                    return <tr key={index}>
                                        <td className="border border-slate-300 ...">{Web3.utils.fromWei(user.address, "ether")}</td>
                                        <td className="border border-slate-300 ...">{Web3.utils.fromWei(user.balance, "ether")}</td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
                <div className='h-96 rounded-lg p-2'>
                    <div className='mt-10 sm:mt-0'>
                        <div className='overflow-hidden shadow sm:rounded-md'>
                            <h3 className='text-lg text-center font-medium text-gray-900 p-4'>Proposal</h3>
                            <div className='bg-white px-4 py-5 sm:p-6'>
                                <label className='block text-sm font-medium text-gray-700'>Description</label>
                                <div className='mt-1'>
                                    <textarea onChange={(e) => setProposal(e.target.value)} rows="3" className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' defaultValue={Proposal}></textarea>
                                </div>
                                <div className='bg-gray-50 px-4 py-3 text-right sm:px-4'>
                                    <button onClick={() => address ? EmitProposal() : connectToWallet()} className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>{address ? "Submit" : "Connect Wallet"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home