import Web3 from "web3";
import contractABI from "../contracts/TransferContract";
import { toast } from "react-toastify";

const useContract = () => {
  const transfer = async (recipient: string, amount: string, networkConfig: any) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, networkConfig.oftContract);
    const accounts = await web3.eth.getAccounts();
    const amountInWei = web3.utils.toWei(amount, "ether");

    try {
      const tx = await contract.methods.transfer(recipient, amountInWei).send({ from: accounts[0] });
      return tx.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };

  return { transfer };
};

export default useContract;
