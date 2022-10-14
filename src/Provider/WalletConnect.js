import { useEffect, useState, createContext } from 'react';
import Web3 from 'web3';
const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';
export const WalletContext = createContext({});

const WallectConnect = ({ children }) => {
    const [address, setAddress] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [Provider, setProvider] = useState(new Web3(process.env.REACT_APP_RPC_URL));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    /* This effect will fetch wallet address if user has already connected his/her wallet */
    useEffect(() => {
        async function checkConnection() {
            try {
                if (window && window.ethereum) {
                    // Check if web3modal wallet connection is available on storage
                    if (localStorage.getItem(web3modalStorageKey)) {
                        await connectToWallet();
                    }
                } else {
                    console.log('window or window.ethereum is not available');
                }
            } catch (error) {
                console.log(error, 'Catch error Account is not connected');
            }
        }
        checkConnection();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setWalletAddress = async (provider) => {
        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            if (accounts) {
                setAddress(accounts[0]);
                getBalance(accounts[0]);
            }
        } catch (error) {
            console.log(
                'Account not connected; logged from setWalletAddress function'
            );
        }
    };

    const getBalance = async (walletAddress) => {
        const walletBalance = await Provider.eth.getBalance(walletAddress);
        const balanceInEth = await Web3.utils.fromWei(walletBalance, 'ether');
        setBalance(balanceInEth);
    };


    const disconnectWallet = () => {
        setAddress(undefined);
        //web3Modal && web3Modal.clearCachedProvider();
    };

    const checkIfExtensionIsAvailable = () => {
        if (
            (window && window.web3 === undefined) ||
            (window && window.ethereum === undefined)
        ) {
            setError(true);
            alert("You don't have extension wallet");
        }
    };

    const connectToWallet = async () => {
        try {
            setLoading(true);
            checkIfExtensionIsAvailable();
            const connection = window.ethereum;
            const Provider = await new Web3(connection);
            // if (connection.networkVersion !== process.env.REACT_APP_RPC_ID) {
            //     Swal.fire({ title: "error", icon: "error", text: "wrong network, please swicht to Bsc" })
            //     let RequestSend = {
            //         id: 1337,
            //         jsonrpc: "2.0",
            //         method: 'wallet_addEthereumChain',
            //         // Red testnet binance
            //         // params: [{
            //         //     chainId: "0x61",
            //         //     chainName: "Binance Smart Chain TestNet",
            //         //     nativeCurrency: {
            //         //         name: "Binance Coin",
            //         //         symbol: "TBNB", // 2-6 characters long
            //         //         decimals: 18,
            //         //     },
            //         //     rpcUrls: ["https://data-seed-prebsc-2-s3.binance.org:8545"],
            //         //     blockExplorerUrls: ["https://testnet.bscscan.com/"],
            //         // }],

            //         // Red Mainnet Binance
            //         params: [{
            //             chainId: "0x38",
            //             chainName: "Binance Smart Chain Mainnet",
            //             nativeCurrency: {
            //                 name: "Binance Coin",
            //                 symbol: "BNB", // 2-6 characters long
            //                 decimals: 18,
            //             },
            //             rpcUrls: ["https://bsc-dataseed1.binance.org/"],
            //             blockExplorerUrls: ["https://bscscan.com/"],
            //         }],
            //     };
            //     connection.request(RequestSend);
            //     return;
            // }
            await subscribeProvider(connection);
            setProvider(Provider);
            setWalletAddress(connection);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(
                error,
                'got this error on connectToWallet catch block while connecting the wallet'
            );
        }
    };


    const subscribeProvider = async (connection) => {
        connection.on('close', () => {
            disconnectWallet();
        });
        connection.on('accountsChanged', async (accounts) => {
            if (accounts?.length) {
                setAddress(accounts[0]);
                getBalance(accounts[0]);
            } else {
                disconnectWallet();
            }
        });
    };

    return (
        <WalletContext.Provider
            value={{
                address,
                balance,
                loading,
                error,
                Provider,
                connectToWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
export default WallectConnect;
