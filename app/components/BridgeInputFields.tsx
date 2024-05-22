"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CONFIG from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bridgeInContract from "../contracts/BridgeInContract";
import { isAddress } from 'web3-validator';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface BridgeInputFieldsProps {
    handleTransaction: (id: string, amount: string) => void;
}

interface NetworkConfig {
    [key: string]: any;
}

const BridgeInputFields: React.FC<BridgeInputFieldsProps> = ({ handleTransaction }) => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [polygonBalance, setPolygonBalance] = useState("0");
    const [arbitrumBalance, setArbitrumBalance] = useState("0");
    const [destination, setDestination] = useState("Arbitrum");

    const fetchBalance = async (web3: Web3, networkConfig: NetworkConfig, account: string) => {
        try {
            setLoading(true);
            const currentChainId = await web3.eth.getChainId();
            if (currentChainId !== BigInt(networkConfig.chainId)) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: Web3.utils.toHex(networkConfig.chainId) }],
                });
            }
            const balance = await web3.eth.getBalance(account);
            setLoading(false);
            toast.success(`Successfully fetched balance for ${networkConfig.chainName}`);
            return web3.utils.fromWei(balance, "ether");
        } catch (err: any) {
            setLoading(false);
            toast.error(`Failed to fetch ${networkConfig.chainName} balance: ` + (err?.message || err));
            return "0";
        }
    };

    useEffect(() => {
        const fetchBalances = async () => {
            if (!window.ethereum) {
                toast.error("MetaMask is not installed");
                return;
            }
    
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    if (destination === "Arbitrum") {
                        const polygonBalance = await fetchBalance(web3, CONFIG.polygon, accounts[0]);
                        setPolygonBalance(polygonBalance);
                    } else {
                        const arbitrumBalance = await fetchBalance(web3, CONFIG.arbitrum, accounts[0]);
                        setArbitrumBalance(arbitrumBalance);
                    }
                }
            } catch (err: any) {
                toast.error("Failed to fetch balances: " + (err?.message || err));
            }
        };
    
        fetchBalances();
    }, [destination]);

    const handleNetworkSwitch = async (networkConfig: NetworkConfig) => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: Web3.utils.toHex(networkConfig.chainId) }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: Web3.utils.toHex(networkConfig.chainId),
                                rpcUrls: [networkConfig.rpcUrl],
                                chainName: networkConfig.chainName,
                                nativeCurrency: {...networkConfig.nativeCurrency},
                                blockExplorerUrls: [...networkConfig.blockExplorerUrls],
                            },
                        ],
                    });
                } catch (err: any) {
                    toast.error(`Failed to add the ${networkConfig.chainName} network to MetaMask: ` + (err.message || err));
                    setLoading(false);
                    return;
                }
            } else {
                toast.error(`Failed to switch to the ${networkConfig.chainName} network: ` + (switchError.message || switchError));
                setLoading(false);
                return;
            }
        }
    }

    const handleBridge = async () => {
        if (!window.ethereum) {
            toast.error("MetaMask is not installed");
            return;
        }

        if (!isAddress(recipient, false)) {
            toast.error('Invalid recipient address');
            return;
        }      

        if (amount === "" || parseFloat(amount) <= 0) {
            toast.error("Bridge-in amount must be greater than zero");
            return;
        }

        setLoading(true);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const web3 = new Web3(window.ethereum);
            const polygonConfig = CONFIG.polygon;
            const arbitrumConfig = CONFIG.arbitrum;
            const currentChainId = await web3.eth.getChainId();
            const sourceConfig = destination === "Polygon" ? arbitrumConfig : polygonConfig;
            const destinationConfig = destination === "Polygon" ? polygonConfig : arbitrumConfig;
            
            if (currentChainId !== BigInt(sourceConfig.chainId)) {
                await handleNetworkSwitch(sourceConfig);
            }
            

            const contract = new web3.eth.Contract(
                bridgeInContract,
                polygonConfig.oftContract
            );

            const accounts = await web3.eth.getAccounts();
            const amountInWei = web3.utils.toWei(amount, "ether");
            const toAddress = Web3.utils.toChecksumAddress(recipient);
            const toAddressBytes = web3.utils.padLeft(toAddress, 64);

            const tx = await contract.methods
                .sendFrom(
                    accounts[0],
                    destinationConfig.layerZeroChainId,
                    toAddressBytes,
                    amountInWei,
                    accounts[0],
                    '0x0000000000000000000000000000000000000000',
                    '0x'
                )
                .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });

            handleTransaction(tx.transactionHash, amount);
            toast.success(`Hurray! Bridge-in successful from ${sourceConfig.chainName} to ${sourceConfig.chainName}.`);
        } catch (err: any) {
            toast.error("Bridge-in failed: " + (err.message || err));
        }

        setLoading(false);
    };

    return (
        <>
            <div className='w-[60%] lg:w-[40%] gap-[30px] rounded-[40px] shadow-custom-input py-[38px] px-[30px] flex flex-col justify-between mb-4'>
                <p className="text-white font-bold">Bridge</p>

                <div className="relative w-full h-[102px] bg-[#171717] rounded-[20px] p-[20px] bg-white relative gradient-border text-[24px]">
                    <div>
                    <span className="absolute top-3 left-4 text-[#535353] z-20 text-[12px] pointer-events-none">From</span>
                    <span className="rounded-[10px] py-[2px] px-[10px] absolute top-2 left-14 text-[#fff] z-20 text-[12px] pointer-events-none bg-[#000]">{destination === "Polygon" ? "Arbitrum" : "Polygon"}</span>
                    <button onClick={() => setAmount(destination === "Polygon"? arbitrumBalance: polygonBalance)} className='w-[40px] h-[20px] font-bold absolute z-20 rounded-[4px] text-[#535353] bg-[#fff] top-[40%] hidden md:block md:left-[92%] lg:left-[90%] w-auto text-[12px] px-[4px]'>Max</button>
                    </div>
                    <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-[88%] mt-2 h-full bg-[#171717] rounded-[20px] relative z-10 text-[30px]"
                    />
                </div>

                <p className="text-white font-bold text-sm">Balance: {destination === "Polygon"? arbitrumBalance: polygonBalance} {destination === "Polygon"? 'AETH': 'MATIC'}</p>


                <div className="w-full flex justify-center">
                    <Image src="/icons/arrow_down.svg" onClick={() => setDestination(destination === "Polygon" ? "Arbitrum" : "Polygon")} className="cursor-pointer" height={20} width={20} alt="arrow_down" />
                </div>

                <div className="relative w-full h-[102px] bg-[#171717] rounded-[20px] p-[20px] bg-white relative gradient-border text-[24px]">
                    <div>
                    <span className="absolute top-3 left-4 text-[#535353] z-20 text-[12px] pointer-events-none">To</span>
                    <span className="rounded-[10px] py-[2px] px-[10px] absolute top-2 left-10 text-[#fff] z-20 text-[12px] pointer-events-none bg-[#000]">{destination === "Polygon" ? "Polygon" : "Arbitrum"}</span>
                    </div>
                    <input
                        type="text"
                        placeholder="0"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-[88%] h-full mt-2 bg-[#171717] rounded-[20px] relative z-10 text-[30px] "
                    />
                </div>

                <div className="w-auto">
                    <button
                        onClick={handleBridge}
                        className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex items-center justify-center gap-3 transition duration-300 ease-in-out "
                        disabled={loading}
                    >
                        {loading ? (
                        <span>Loading...</span>
                        ) : (
                        <>
                            <img src="/icons/wallet.svg" alt="wallet" className="h-6 w-6" />
                            Bridge
                        </>
                        )}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>

    );
};

export default BridgeInputFields
