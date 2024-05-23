'use client';
import Web3 from "web3";
import { toast } from "react-toastify";
import CONFIG from "../../config";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface NetworkConfig {
  [key: string]: any;
}

const useWeb3 = () => {
  const web3 = new Web3(window.ethereum);

  const switchNetwork = async (networkConfig: NetworkConfig) => {
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
            params: [CONFIG.polygon],
          });
        } catch (error: any) {
          toast.error("Failed to add the network to MetaMask: " + (error.message || error));
          throw error;
        }
      } else {
        toast.error("Failed to switch the network: " + (switchError.message || switchError));
        throw switchError;
      }
    }
  };

  return { web3, switchNetwork };
};

export default useWeb3;
