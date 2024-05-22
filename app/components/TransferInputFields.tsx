"use client"
import React, { useState } from "react";
import Web3 from "web3";
import CONFIG from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAddress } from 'web3-validator';
import contractABI from "../contracts/ContractABI";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface TransferInputFieldsProps {
  handleTransaction: (id: string, amount: string) => void;
}

interface NetworkConfig {
  [key: string]: any;
}

const TransferInputFields: React.FC<TransferInputFieldsProps> = ({ handleTransaction }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

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
              CONFIG.polygon
            ],
          });
        } catch (error: any) {
          toast.error("Failed to add the network to MetaMask: " + (error.message || error));
          setLoading(false);
          return;
        }
      } else {
        toast.error("Failed to switch the network: " + (switchError.message || switchError));
        setLoading(false);
        return;
      }
    }
  };

  const handleTransfer = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed"); // Display error if MetaMask is not installed
      return;
    }

    if (!isAddress(recipient, false)) {
      toast.error('Invalid recipient address');
      return;
    }

    if (amount === "" || parseFloat(amount) <= 0) {
      toast.error("Transfer amount is too less"); // Display error if transfer amount is invalid
      return;
    }

    setLoading(true);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3 = new Web3(window.ethereum);
      const networkConfig = CONFIG["polygon"];

      const currentChainId = await web3.eth.getChainId();
      if (currentChainId !== BigInt(networkConfig.chainId)) {
        await handleNetworkSwitch(networkConfig);
      }

      const contract = new web3.eth.Contract(
        contractABI,
        networkConfig.oftContract
      );

      const accounts = await web3.eth.getAccounts();
      const amountInWei = web3.utils.toWei(amount, "ether");

      const tx = await contract.methods.transfer(recipient, amountInWei).send({ from: accounts[0] });

      handleTransaction(tx.transactionHash, amount);
      toast.success("Transfer successful!");
    } catch (err: any) {
      toast.error("Transfer failed: " + (err.message || err));
    }

    setLoading(false);
  };

  return (
    <>
      <div className='w-[60%] lg:w-[40%] gap-[30px] rounded-[40px] shadow-custom-input py-[38px] px-[30px] flex flex-col justify-between mb-4'>
        <p className="text-white font-bold">Transfer</p>
        <div className="relative w-full h-[102px] bg-[#171717] rounded-[20px] p-[20px] bg-white relative gradient-border text-[24px]">
          <div>
            <span className="absolute top-3 left-4 text-[#535353] z-20 text-[12px] pointer-events-none">Total Amount to transfer</span>
          </div>
          <input
            type="number"
            placeholder="Amount"
            value={amount || ''}
            onChange={(e) => setAmount(e.target.value)}
            className="w-[88%] h-full mt-2 bg-[#171717] rounded-[20px] relative z-10 text-[30px] mt-[10px]"
          />
        </div>

        <div className="relative w-full h-[102px] bg-[#171717] rounded-[20px] p-[20px] bg-white relative gradient-border text-[24px]">
          <div>
            <span className="absolute top-3 left-4 text-[#535353] z-20 text-[12px] pointer-events-none">User Address</span>
          </div>
          <input
            type="text"
            placeholder="User Address"
            value={recipient || ''}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-[88%] h-full mt-2 bg-[#171717] rounded-[20px] relative z-10 text-[30px] mt-[10px]"
          />
        </div>

        <div className="mt-2 w-auto">
          <button
            onClick={handleTransfer}
            className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex items-center justify-center gap-3 transition duration-300 ease-in-out "
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <img src="/icons/wallet.svg" alt="wallet" className="h-6 w-6" />
                Transfer
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TransferInputFields;
