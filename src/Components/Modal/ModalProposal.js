import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import GovernanceAbi from '../../artifacts/contracts/Governance.sol/ConquerBlockGovernance.json';
import { WalletContext } from '../../Provider/WalletConnect';
import Swal from 'sweetalert2';
const ModalProposal = ({ open, setOpen, proposal }) => {
    const { address, Provider } = useContext(WalletContext);
    const cancelButtonRef = useRef();
    const [Vote, setVote] = useState("");

    useEffect(() => {

    }, [])


    async function EmitVote() {
        if (!Vote) {
            Swal.fire({ title: "You need selecte option", icon: "error" });
        }
        const Governance = new Provider.eth.Contract(GovernanceAbi.abi, process.env.REACT_APP_GOVERNANCEADDRESS);
        Governance.methods.castVote(proposal.proposalId, Vote).send({ from: address })
            .then(r => {
                Swal.fire({ title: "You voted", icon: "success" });
                setOpen(false)
                console.log(r)
            })
            .catch(e => {
                console.log("error", e)
            })
    }


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                Proposal
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    {proposal?.description}
                                                </p>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-everything"
                                                            name="push-notifications"
                                                            type="radio"
                                                            value="0"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            onChange={(e) => setVote(e.target.value)}
                                                        />
                                                        <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Againts
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-email"
                                                            name="push-notifications"
                                                            type="radio"
                                                            value="1"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            onChange={(e) => setVote(e.target.value)}
                                                        />

                                                        <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                                            For
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-nothing"
                                                            name="push-notifications"
                                                            type="radio"
                                                            value="2"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            onChange={(e) => setVote(e.target.value)}
                                                        />
                                                        <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Abstain
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => EmitVote()}
                                    >
                                        Submit Vote
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-base font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalProposal