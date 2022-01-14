import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const WalletReputationsContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const walletReputationsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    walletReputationsContract,
  });
  return walletReputationsContract;
};

export const WalletReputationsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  //const [reputationReportCount, setReputationReportCount] = useState(
  //  localStorage.getItem("reputationReportCount")
  //);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("checkIfWalletIsConnected: No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("ConnectWallet: No ethereum object");
    }
  };

  // Check to see if the wallet is connected, only at the the start
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  //}, [reputationReportCount]);

  return (
    <WalletReputationsContext.Provider
      value={{ connectWallet, currentAccount }}
    >
      {children}
    </WalletReputationsContext.Provider>
  );
};
