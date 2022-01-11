//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transactions {
    uint public ripoffReportCount;

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

    event NewRipoffReport(address sender, address receiver, uint256 timestamp, uint amount, uint whoFiled, bool disputed, string txnId, string messages, string tokenName);
    
    //
    // This mapping is for quickly updating an existing
    // report.  Given a transaction Id, we can lookup the
    // index into the RipoffReportStruct to quickly find
    // the exact RipoffReport.
    // I.e, txnId => RipoffReportStruct[index]
    //
    mapping(string => uint) public transactionIdToIndex; 

    function createRipoffReport(address _sender, 
                                address _receiver, 
                                uint256 _timestamp,
                                uint _amount,        
                                uint _whoFiled,
                                bool _disputed,
                                string memory _txnId,
                                string memory _usersMessages,
                                string memory _tokenName) public {
        ripoffReports.push(RipoffReportStruct(_sender,
                                              _receiver, 
                                              _timestamp,
                                              _amount, 
                                              _whoFiled,
                                              _disputed,
                                              _txnId,
                                              _usersMessages, 
                                              _tokenName));
        ripoffReportCount += 1;
        transactionIdToIndex[_txnId] = ripoffReportCount;
        emit NewRipoffReport(_sender, _receiver, _timestamp, _amount, _whoFiled, _disputed, _txnId, _usersMessages, _tokenName);
    }

    function getAllRipoffReports() public view returns (RipoffReportStruct[] memory) {
        return ripoffReports;
    }

    function getRipoffReportsCount() public view returns (uint256) {
        return ripoffReportCount;
    }

    //
    // Allows originators to update the report, either cancelling it or
    // adding to the messages.  Also allows opponents to dispute.
    //
    function updateRipoffReport(string memory _txnId, 
                                bool _disputed,
                                string memory _messages) payable public returns (string memory _returnCode) {
        uint returnCode; // 0 = success, anything else is an error
        uint index = transactionIdToIndex[_txnId];
        RipoffReportStruct memory ripoffReport = ripoffReports[index];
        if (strcmp(_txnId, ripoffReport.txnId)) {
          //
          // In order to maintain integrity, the sender MUST
          // be either the ripoffReports .sender or .receiver.
          // It's a payable function since we are updating data
          // on chain.
          // 
          if (msg.sender == ripoffReport.sender || 
              msg.sender == ripoffReport.receiver) {
              ripoffReport.disputed = _disputed;
              ripoffReport.usersMessages = _messages;
              returnCode = 0;
          } else {
            // Send back failure - update can only be done by the sender or receiver of the original transaction
            returnCode = 10;
          }
        } else {
          // Send back failure - txnIds don't match up for some reason
            returnCode = 20;
        }      
    }

    function memcmp(bytes memory a, bytes memory b) internal pure returns(bool) {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }
    function strcmp(string memory a, string memory b) internal pure returns(bool) {
        return memcmp(bytes(a), bytes(b));
    }
}