//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transactions {
  uint public ripoffReportCount;

  event NewRipoffReport(address sender, address receiver, uint256 timestamp, uint amount, uint whoFiled, string txnId, string messages, string tokenName);
  
  struct RipoffReportStruct {
      address sender;  
      address receiver;      
      uint256 timestamp;   // when the ripoff took place
      uint amount;         // units are denoted in 'blockchain' (below)
      uint whoFiled;       // 0=sender, 1=receiver
      bool disputed;       // true if opposing party has lodged a dispute
      string txnId;        // transaction Id of ripoff
      string usersMessages; // text of messages left by originator and disputer, if any
      string tokenName;   // unit of amount (above)
  }

  RipoffReportStruct[] public ripoffReports;
  //
  // This mapping is for quickly updating an existing
  // report.  Given a transaction Id, we can lookup the
  // index into the RipoffReportStruct to quickly find
  // the exact RipoffReport.
  // I.e, txnId => RipoffReportStruct[index]
  //
  mapping(string => uint) public lookupIndexByTransactionId; 

  function createRipoffReport(address _sender, 
                              address _receiver, 
                              uint256 _timestamp,
                              uint _amount,        
                              uint _whoFiled,
                              bool _disputed,
                              string memory _txnId,
                              string memory _usersMessages,
                              string memory _tokenName) public {
        ripoffReportCount += 1;
        ripoffReports.push(RipoffReportStruct(_sender,
                                              _receiver, 
                                              _timestamp,
                                              _amount, 
                                              _whoFiled,
                                              _disputed,
                                              _txnId,
                                              _messages, 
                                              _tokenName));

        emit NewRipoffReport(address sender, address receiver, uint256 timestamp, uint amount, uint whoFiled, string txnId, string messages, string tokenName);
    }

    function getAllRipoffReports() public view returns (RipoffReportStruct[] memory) {
        return ripoffReports;
    }

    function getRipoffReportsCount() public view returns (uint256) {
        return ripoffReportsCount;
    }

    //
    // Allows originators to update the report, either cancelling it or
    // adding to the messages.  Also allows opponents to dispute.
    //
    function updateRipoffReport(string memory _txnId, 
                                bool _disputed,
                                string memory _messages) returns (string memory _returnCode) public payable {
        uint index = lookupIndexByTransactionId(txnId);
        RipoffReportStruct ripoffReport = ripoffReports(index);
        if (txnId == ripoffReport) {
          //
          // In order to maintain integrity, the sender MUST
          // be either the ripoffReports .sender or .receiver.
          // It's a payable function since we are updating data
          // on chain.
          // 
          if (msg.sender == ripoffReport.sender || 
              msg.sender == ripoffReport.receiver) {
              ripoffReport.disputed = _disputed;
              ripoffReport.messages = _messages;
          } else {
            // Send back failure - update can only be done by the sender or receiver of the original transaction
          }
        } else {
          // Send back failure - txnIds don't match up for some reason
        }      
    }

}