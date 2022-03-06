import React, { Children, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionsContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfTransactionIsConected = async () => {
    try {
      if (!ethereum) return alert("Please connect to Metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // Get all transactions
      } else {
        console.log("No accounts found");
      }

      console.log("accounts :>> ", accounts);
    } catch (error) {
      console.log("error :>> ", error);
      throw new Error("No ethereum object found");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please connect to Metamask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmout = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5200",
            value: parsedAmout._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmout,
        keyword,
        message
      );

      setIsLoading(true);
      console.log(`Loading ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log("error :>> ", error);
      throw new Error("No ethereum object found");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install to Metamask");
      const account = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(account[0]);
    } catch (error) {
      console.log("error :>> ", error);
      throw new Error("No ethereum object found");
    }
  };

  useEffect(() => {
    checkIfTransactionIsConected();
  }, []);
  return (
    <TransactionsContext.Provider
      value={{
        connectWallet,
        currentAccount,
        handleChange,
        formData,
        setFormData,
        sendTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
