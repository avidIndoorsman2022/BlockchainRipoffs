import React, { Component, useContext } from "react";
import { WalletReputationsContext } from "../context/WalletReputationsContext";
import useFetch from "../hooks/useFetch";
import { Loader } from ".";

const DividerWithText = ({ theText }) => {
  return (
    <div className="flex items-center w-5/6">
      <div className="flex-grow bg bg-gray-400 h-[1px]"></div>
      <div className="flex-grow-0 mx-5 text text-white">OR</div>
      <div className="flex-grow bg bg-gray-400 h-[1px]"></div>
    </div>
  );
};

const Input = ({ placeholder, name, type, value, handleEnterReportChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleEnterReportChange(e, name)}
    className="my-2 w-full rounded-lg p-2 outline-none bg-transparent text-white border-2 text-sm white-glassmorphism"
  />
);

const EnterReport = () => {
  const {
    currentAccount,
    getReputationReportsForAddress,
    handleEnterReportChange,
    enterFormData,
    isLoading,
  } = useContext(WalletReputationsContext);
  const [
    { txnSearchResults, isFetchLoading, isFetchError },
    setAddressToLookFor,
  ] = useFetch();

  const handleEnterReportSubmit = (e) => {
    const { addressFrom, addressTo, amount, txnId, userMessages } =
      enterFormData;

    try {
      //e.preventDefault(); // prevent browser refresh
      //
      // Make sure that either the addressFrom or addressTo
      // are one of the connected accounts.
      //
      const lcAddressFrom = addressFrom.toLowerCase();
      const lcAddressTo = addressTo.toLowerCase();
      console.log("handleEnterReportSubmit.currentAccount: ", currentAccount);
      console.log("handleEnterReportSubmit.addressFrom: ", lcAddressFrom);
      console.log("handleEnterReportSubmit.addressTo: ", lcAddressTo);
      console.log("handleEnterReportSubmit.amount: ", amount);
      if (currentAccount == lcAddressFrom || currentAccount == lcAddressTo) {
        //
        // If we have a transaction Id, then we look it up to verify
        // that one of the two addresses provided is involved with
        // the transaction.
        //
        if (txnId != null && txnId != "") {
          console.log("handleEnterReportSubmit: Using txnId: ", txnId);
        } else {
          //
          // Otherwise, get a list from the blockchain of all transactions
          // with these two addresses and the correct amount.
          //
          console.log("handleEnterReportSubmit: Fetching");
          setAddressToLookFor(lcAddressFrom);
        }
      } else {
        window.alert(
          "You must connect with the account that you are reporting."
        );
        return; // throw?
      }
    } catch (error) {
      console.log("handleEnterReportSubmit: Error occurred. Reason: ", error);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gradient-bg-services">
      <DividerWithText theText="OR" />
      <div className="flex mf:flex-row flex-col justify-center items-center w-4/5 md:p-5 py-5 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Enter a Scam/Fraud Report
          </h1>
          <p className="text-left mt-5 text-white font-light w-full text-base">
            Connect your wallet, then fill out the fields. You must connect your
            wallet with one of the two addresses involved.
          </p>
        </div>
        <form className="p-5 mt-5 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <Input
            placeholder="From Address"
            name="addressFrom"
            type="text"
            handleEnterReportChange={handleEnterReportChange}
          />
          <Input
            placeholder="To Address"
            name="addressTo"
            type="text"
            handleEnterReportChange={handleEnterReportChange}
          />
          <Input
            placeholder="Amount"
            name="amount"
            type="text"
            handleEnterReportChange={handleEnterReportChange}
          />
          <Input
            placeholder="Transaction Id (optional)"
            name="txnId"
            type="text"
            handleEnterReportChange={handleEnterReportChange}
          />
          <textarea
            className="my-2 w-full rounded-lg p-2 outline-none bg-transparent text-white border-2 text-sm white-glassmorphism"
            placeholder="Describe what happened (URLs, etc) - optional)"
            name="userMessages"
            type="text"
          />
          <button
            type="button"
            onClick={handleEnterReportSubmit}
            className="text-white bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            Submit Report
          </button>
        </form>

        {isFetchLoading ? (
          <Loader />
        ) : (
          <div></div>
          /* <div className="text-white">FetchDisplayResults:</div>
          <ReportResults
            reputationResults={specificAddressReputationReports}
          />*/
        )}
      </div>
    </div>
  );
};

export default EnterReport;
