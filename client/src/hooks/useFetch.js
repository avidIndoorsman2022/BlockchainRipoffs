import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { WalletReputationsContext } from "../context/WalletReputationsContext";

const ETHSCAN_URL = "https://api-rinkeby.etherscan.io/api";
const APIKEY = import.meta.env.VITE_ETHSCAN_APIKEY;

const useFetch = () => {
  const [addressToLookFor, setAddressToLookFor] = useState("");
  const [txnSearchResults, setTxnSearchResults] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const { enterFormData, createOneReputationReport } = useContext(
    WalletReputationsContext
  );

  useEffect(() => {
    let {
      addressTo,
      addressFrom,
      timestamp,
      amount,
      whoFiled,
      disputed,
      txnId,
      userMessages,
      tokenName,
    } = enterFormData;
    const fetchData = async () => {
      setIsFetchError(false);
      setIsFetchLoading(true);

      try {
        console.log("addressToLookFor: ", addressToLookFor);
        console.log("addressFrom: ", addressFrom);
        console.log("addressTo: ", addressTo);
        console.log("amount: ", amount);
        if (addressToLookFor != null) {
          if (addressToLookFor != "") {
            const url =
              ETHSCAN_URL +
              "?module=account&action=txlist&address=" +
              addressToLookFor +
              "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&api_key=" +
              APIKEY;
            const response = await axios.get(url);
            console.log("response: ", response);
            console.log("response.data: ", response.data);
            const txnData = response.data.result;
            console.log("txnData: ", txnData);
            console.log("txnData.length: ", txnData.length);
            // Now find the transaction of interest
            for (let i = 0; i < txnData.length; i++) {
              console.log("txnTo: ", txnData[i].to);
              const txnTo = txnData[i].to.toLowerCase();
              if (txnTo == addressTo.toLowerCase()) {
                const txnAmount = txnData[i].value;
                if (txnAmount == amount) {
                  // We found it!
                  // Now we can gather all the items needed for a report.
                  timestamp = txnData[i].timeStamp;
                  whoFiled = 0; // addressFrom by default
                  disputed = false;
                  txnId = txnData[i].hash;
                  //userMessages = userMessages.encode();
                  tokenName = "ETH";

                  //
                  // And now enter the report.
                  //
                  await createOneReputationReport();
                }
              }
            }
          }
        }

        //const { data } = await response.json();
        //console.log("data: ", data);

        // No results
        //{"status":"0","message":"No transactions found","result":[]}

        //
        // Results found:
        // https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=0x8Bcea6e7F529665A35aBb355D4BeDb2987989805&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=7ESF2VVA4BH2HE8G78CZWH6E3Q8YXNWP79
        /*
        {"status":"1",
         "message":"OK",
         "result":[
           {"blockNumber":"9569052",
           "timeStamp":"1635796150",
           "hash":"0x5e84a6e8e6847e6569079cf99a896648d3899fe77cb22431a5d2bff2e39ecabb",
           "nonce":"82790",
           "blockHash":"0xa11ad1c737ba14db8011249319aaf1b24a1e9127419761920677310423440b0b",
           "transactionIndex":"26",
           "from":"0xa7a82dd06901f29ab14af63faf3358ad101724a8",
           "to":"0x8bcea6e7f529665a35abb355d4bedb2987989805",
           "value":"100000000000000000",
           "gas":"60000",
           "gasPrice":"1000000008",
           "isError":"0",
           "txreceipt_status":"1",
           "input":"0x",
           "contractAddress":"",
           "cumulativeGasUsed":"2477772",
           "gasUsed":"21000",
           "confirmations":"502204"},

           {"blockNumber":"9974592",
           "timeStamp":"1641931702",
           "hash":"0xe70d92b90e97258612f81630e0927736b0269bce08db248959abd88bb07ec88e",
           "nonce":"0",
           "blockHash":"0x63b1959ac3d57f184a51b0d403bc58149258fc8a0614f87f659523f9c7e16a74",
           "transactionIndex":"18",
           "from":"0x8bcea6e7f529665a35abb355d4bedb2987989805",
           "to":"0xc94efd022e416cc15c2b8d6935293b9ed099a46f",
           "value":"1000000000000000",
           "gas":"21000",
           "gasPrice":"1500000020",
           "isError":"0",
           "txreceipt_status":"1",
           "input":"0x",
           "contractAddress":"",
           "cumulativeGasUsed":"4799435",
           "gasUsed":"21000",
           "confirmations":"96664"},
           
           {"blockNumber":"9990190",
           "timeStamp":"1642174000",
           "hash":"0xea2cca505c8369c28ae73af80ef44c8f49401cf7322d1f3b47e4f42d47454e91",
           "nonce":"1",
           "blockHash":"0x50fe7822c84075577fdbafb635a064c6e8a15599ca9e0d64ed1bdaf4eb6aba81",
           "transactionIndex":"20",
           "from":"0x8bcea6e7f529665a35abb355d4bedb2987989805",
           "to":"0xbdf49dc284dbeca07f7351bd419cfbdf22c396c3",
           "value":"50000000000000000",
           "gas":"21000",
           "gasPrice":"1500000013",
           "isError":"0",
           "txreceipt_status":"1",
           "input":"0x",
           "contractAddress":"",
           "cumulativeGasUsed":"3533263",
           "gasUsed":"21000",
           "confirmations":"81066"}]}
        */

        console.log("useFetch.results: ", data);
        setTxnSearchResults(data);
      } catch (error) {
        setIsFetchError(true);
        console.log("useFetch.Error occurred: " + error.message);
      }
      setIsFetchLoading(false);
    };
    fetchData();
  }, [addressToLookFor]);

  return [
    { txnSearchResults, isFetchLoading, isFetchError },
    setAddressToLookFor,
  ];
};

export default useFetch;
