import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import { messagePrefix } from "@ethersproject/hash";

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

  //console.log({
  //  provider,
  //  signer,
  //  walletReputationsContract,
  //});
  return walletReputationsContract;
};

//
// Ugly, but we need to find a way to get the chain name somehow.
// Note that we are actually using the network ID, which could be wrong.
//
const getChainName = (chainId) => {
  let chainName = "";
  if (chainId == 1) {
    chainName = "Mainnet";
  } else {
    if (chainId == 3) {
      chainName = "Ropsten Network";
    } else {
      if (chainId == 4) {
        chainName = "Rinkeby Network";
      } else {
        if (chainId == 5) {
          chainName = "Goerli Network";
        } else {
          if (chainId == 42) {
            chainName = "Kovan Network";
          } else {
            chainName = "Unknown Network (" + chainId + ")";
          }
        }
      }
    }
  }
  return chainName;
};

export const WalletReputationsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressToLookFor: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentChainName, setCurrentChainName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reputationReports, setReputationReports] = useState([]);
  const [reputationReportsCount, setReputationReportsCount] = useState(0);
  const [
    specificAddressReputationReports,
    setSpecificAddressReputationReports,
  ] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getReputationReportsForAddress = async () => {
    try {
      const { addressToLookFor } = formData;
      setIsLoading(true);
      await getAllReputationReports();
      console.log(
        "getReputationReportsForAddress: Number of ReputationReports: " +
          reputationReports.length
      );
      const reputationReportsForAddress = reputationReports.reduce(function (
        filtered,
        reputationReport
      ) {
        if (reputationReport.toAddress == addressToLookFor) {
          filtered.push(reputationReport);
        }
        return filtered;
      },
      []);
      //
      // Debugging: Force some results if the addressToLookFor is zero.
      //
      if (addressToLookFor === "0") {
        let reputationReportForAddress = [
          {
            addressTo: "0x8Bcea6e7F529665A35aBb355D4BeDb2987989805",
            addressFrom: "0xC94Efd022E416CC15C2b8D6935293B9ed099a46f",
            timestamp: 9974592,
            amount: 1000000000000000,
            whoFiled: 0,
            disputed: false,
            txnId:
              "0xe70d92b90e97258612f81630e0927736b0269bce08db248959abd88bb07ec88e",
            userMessages: "I think it's a scam!",
            tokenName: "ETH",
          },
        ];
        reputationReportsForAddress.push(reputationReportForAddress);

        reputationReportForAddress = [
          {
            addressTo: "0xC94Efd022E416CC15C2b8D6935293B9ed099a46f",
            addressFrom: "0x8Bcea6e7F529665A35aBb355D4BeDb2987989805",
            timestamp: 9974592,
            amount: 1000000000000000,
            whoFiled: 0,
            disputed: true,
            txnId:
              "0xe70d92b90e97258612f81630e0927736b0269bce08db248959abd88bb07ec88e",
            userMessages: "It IS a scam!",
            tokenName: "ETH",
          },
        ];
        reputationReportsForAddress.push(reputationReportForAddress);
      }

      console.log(
        "Filtered to " + reputationReportsForAddress.length + " reports"
      );
      setSpecificAddressReputationReports(reputationReportsForAddress);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      throw new Error("getReputationReportsForAddress: No ethereum object");
    }
  };

  const getAllReputationReports = async () => {
    try {
      if (ethereum) {
        const walletReputationsContract = createEthereumContract();

        const availableReputationReports =
          await walletReputationsContract.getAllReputationReports();

        const structuredReputationReports = availableReputationReports.map(
          (reputationReport) => ({
            addressFrom: reputationReport.sender,
            addressTo: reputationReport.receiver,
            timestamp: new Date(
              reputationReport.timestamp.toNumber() * 1000
            ).toLocaleString(),
            amount: parseInt(reputationReport.amount._hex) / 10 ** 18,
            whoFiled: reputationReport.whoFiled,
            disputed: reputationReport.disputed,
            txnId: reputationReport.txnId,
            userMessages: reputationReport.usersMessages,
            tokenName: reputationReport.tokenName,
          })
        );

        console.log(structuredReputationReports);
        setReputationReports(structuredReputationReports);
      } else {
        console.log("getAllReputationReports: Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        const networkName = getChainName(ethereum.networkVersion);
        setCurrentChainName(networkName);
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

      console.log("Metamask network: ", ethereum.networkVersion);
      console.log("Metamask accounts count: ", accounts.length);
      console.log("Metamask accounts[0]: ", accounts[0]);
      console.log("Metamask selectedAddress: ", ethereum.selectedAddress);

      setCurrentAccount(accounts[0]);

      //
      // Now that we know we have an account, find out which
      // chain we are using.  We display this to let the user
      // know which chain they are using (i.e., Mainnet,
      // Rinkeby, Ropstein, etc).
      //
      //console.log("NetworkVersion: ", ethereum.networkVersion);
      const networkName = getChainName(ethereum.networkVersion);
      //console.log("NetworkName: ", networkName);
      setCurrentChainName(networkName);
    } catch (error) {
      console.log(error);
      throw new Error("ConnectWallet: No ethereum object");
    }
  };

  const checkIfReputationReportsCountExists = async () => {
    try {
      if (ethereum) {
        const walletReputationsContract = createEthereumContract();
        const currentReputationReportsCount =
          await walletReputationsContract.getReputationReportsCount();
        setReputationReportsCount(currentReputationReportsCount);
      }
    } catch (error) {
      console.log(error);
      throw new Error("checkIfReputionReportsExists: No ethereum object");
    }
  };

  // Check to see if the wallet is connected, only at the the start
  useEffect(() => {
    checkIfWalletIsConnected();
    //checkIfReputationReportsCountExists();
  }, []);
  //}, [reputationReportsCount]);

  return (
    <WalletReputationsContext.Provider
      value={{
        currentAccount,
        currentChainName,
        connectWallet,
        getAllReputationReports,
        getReputationReportsForAddress,
        formData,
        isLoading,
        reputationReports,
        reputationReportsCount,
        specificAddressReputationReports,
        handleChange,
      }}
    >
      {children}
    </WalletReputationsContext.Provider>
  );
};
