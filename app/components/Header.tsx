"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { usePathname } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

declare global {
    interface Window {
        ethereum: any;
    }
}

const Header: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const connectWallet = async () => {
        setLoading(true);
        if (!window.ethereum) {
            toast.error("MetaMask is not installed");
            return;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setLoading(false)
                setWalletAddress(accounts[0]);
            }
        } catch (err: any) {
            setLoading(false)
            toast.error("Failed to connect wallet: " + (err.message || err));
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setLoading(false)
                    setWalletAddress(accounts[0]);
                }
            }
        };
        checkConnection();
    }, []);

    if (pathname !== "/transfer" && pathname !== "/bridge") {
        return null;
    }

    return (
        <div className="w-full fixed top-5 h-20 ">
            <div className="w-full px-10 h-full flex items-center justify-between">
                <span className="-ml-28">
                    <Image src="/icons/neobase_logo.svg" width={300} height={300} alt="neobase_logo" />
                </span>
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex gap-3 items-center transition duration-300 ease-in-out "
                >
                    {walletAddress ? (
                        <div className="flex items-center gap-2">
                            <span className="mb-1 h-2 w-2 bg-[#FF00E1] rounded-full"></span>
                            <span>{`${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
                        </div>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <Image src="/icons/wallet.svg" alt="wallet" height={18} width={18} />
                            <p className="text-xs lg:text-base">Connect Wallet</p>
                        </>
                    )}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Header;
