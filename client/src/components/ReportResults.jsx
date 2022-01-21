import React, { useContext } from "react";
import { WalletReputationsContext } from "../context/WalletReputationsContext";

const NoReportsFound = () => {
  return (
    <div className="my-2 w-full rounded-lg p-2 text-white border-2 text-sm green-glassmorphism">
      <p className="text-white justify-center text-center">No reports found!</p>
    </div>
  );
};

const ShowReport = (...oneReport) => {
  return (
    <div className="my-2 w-full rounded-lg p-2 border-2 red-glassmorphism">
      <div className="grid grid-cols-3 gap-1">
        <p className="text-white justify-left text-sm col-span-3 truncate ...">
          To: {oneReport[0].addressTo}
        </p>
        <p className="py-1 text-white justify-left text-sm col-span-3 truncate ...">
          From: {oneReport[0].addressFrom}
        </p>
        <p className="py-1 text-white justify-left text-xs text-center">
          Amount: {oneReport[0].amount / 10 ** 18} {oneReport[0].tokenName}
        </p>
        <p className="py-1 text-white justify-left text-xs text-center">
          Date: {new Date(oneReport[0].timestamp * 1000).toLocaleString()}
        </p>
        <p className="py-1 text-white justify-left text-xs text-center">
          Disputed: {oneReport[0].disputed ? "True" : "False"}
        </p>
        <p className="py-1 text-white justify-left text-xs text-left col-span-3 truncate ...">
          Messages: {oneReport[0].userMessages}
        </p>
        <div className="py-1 text-white justify-left text-xs text-left col-span-3 truncate ...">
          TransactionId:{" "}
          <a
            href={"https://rinkeby.etherscan.io/tx/" + oneReport[0].txnId}
            target="_blank"
          >
            <div className="text-decoration-line: underline">
              {oneReport[0].txnId}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const ReportResults = () => {
  const { specificAddressReputationReports } = useContext(
    WalletReputationsContext
  );
  return (
    <div className="w-full flex flex-col justify-center items-center py-3">
      {specificAddressReputationReports.length == 0 ? (
        <NoReportsFound />
      ) : (
        specificAddressReputationReports.map((reputationReport, i) => (
          <ShowReport key={i} {...reputationReport[0]} />
        ))
      )}
    </div>
  );
};

export default ReportResults;
