"use client"
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CONFIG from "../../config";
import { isAddress } from 'web3-validator';
import useWeb3 from "../hooks/useWeb3";
import useContract from "../hooks/useContract";

interface TransferFormProps {
  onTransactionComplete: (txHash: string, amount: string) => void;
}

const TransferInputFields: React.FC<TransferFormProps> = ({ onTransactionComplete }) => {
  const [receiver, setReceiver] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { web3, switchNetwork } = useWeb3();
  const { transfer } = useContract();

  const handleTransfer = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      return;
    }

    if (!isAddress(receiver, false)) {
      toast.error('Invalid recipient address');
      return;
    }

    if (transferAmount === "" || parseFloat(transferAmount) <= 0) {
      toast.error("Transfer amount is too low");
      return;
    }

    setIsLoading(true);

    try {
      await web3.eth.requestAccounts();

      const networkConfig = CONFIG["polygon"];
      const currentChainId = await web3.eth.getChainId();
      if (currentChainId !== BigInt(networkConfig.chainId)) {
        await switchNetwork(networkConfig);
      }

      const txHash = await transfer(receiver, transferAmount, networkConfig);
      onTransactionComplete(txHash, transferAmount);
      toast.success("Transfer successful!");
    } catch (err: any) {
      toast.error("Transfer failed: " + (err.message || err));
    }

    setIsLoading(false);
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
            placeholder="0"
            value={transferAmount || ''}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-[88%] h-full mt-2 bg-[#171717] rounded-[20px] relative z-10 text-[30px] mt-[10px]"
          />
        </div>

        <div className="relative w-full h-[102px] bg-[#171717] rounded-[20px] p-[20px] bg-white relative gradient-border text-[24px]">
          <div>
            <span className="absolute top-3 left-4 text-[#535353] z-20 text-[12px] pointer-events-none">User Address</span>
          </div>
          <input
            type="text"
            placeholder="0"
            value={receiver || ''}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-[88%] h-full mt-2 bg-[#171717] rounded-[20px] relative z-10 text-[30px] mt-[10px]"
          />
        </div>

        <div className="mt-2 w-auto">
          <button
            onClick={handleTransfer}
            className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex items-center justify-center gap-3 transition duration-300 ease-in-out "
            disabled={isLoading}
          >
            {isLoading ? (
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
