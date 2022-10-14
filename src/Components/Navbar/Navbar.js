import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { WalletContext } from '../../Provider/WalletConnect';
const Navbar = () => {
    const { address, connectToWallet } = useContext(WalletContext);
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-8" src="https://conquerblocks.com/wp-content/uploads/logo_horizontal_white.svg" alt="Your Company" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" to="/">
                                    Members
                                </NavLink>

                                <NavLink className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/proposals">
                                    Proposals
                                </NavLink>
                                <p href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Treasury: 25 ETH</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative ml-3">
                                {/* <a href="#_" className="py-2 text-pink-500 w-full text-center font-bold">Login</a> */}
                                {address
                                    ? <button type="button" onClick={() => console.log()} className="px-5 py-3 fold-bold text-sm leading-none bg-indigo-700 text-white w-full inline-block text-center relative">
                                        {address.substr(0, 5)}....{address.substr(-5, 5)}
                                    </button>
                                    : <button type="button" onClick={() => connectToWallet()} className="px-5 py-3 fold-bold text-sm leading-none bg-indigo-700 text-white w-full inline-block text-center relative">
                                        Connect Wallet
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    <NavLink className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" to="/">
                        Members
                    </NavLink>

                    <NavLink className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/proposals">
                        Proposals
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default Navbar