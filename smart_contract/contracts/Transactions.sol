//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transactions {
    uint public reputationReportCount;

    struct ReputationReportStruct {
        address sender;  
        address receiver;      
        uint256 timestamp;   // when the fraud/scam took place
        uint amount;         // units are denoted in 'blockchain' (below)
        uint whoFiled;       // 0=sender, 1=receiver
        bool disputed;       // true if opposing party has lodged a dispute
        string txnId;        // transaction Id of reputation
        string usersMessages; // text of messages left by originator and disputer, if any
        string tokenName;   // unit of amount (above)
    }

    ReputationReportStruct[] public reputationReports;

    event NewReputationReport(address sender, address receiver, uint256 timestamp, uint amount, uint whoFiled, bool disputed, string txnId, string messages, string tokenName);
    
    //
    // This mapping is for quickly updating an existing
    // report.  Given a transaction Id, we can lookup the
    // index into the reputationReportStruct to quickly find
    // the exact reputationReport.
    // I.e, txnId => reputationReportStruct[index]
    //
    mapping(string => uint) public transactionIdToIndex; 

    function createReputationReport(address _sender, 
                                    address _receiver, 
                                    uint256 _timestamp,
                                    uint _amount,        
                                    uint _whoFiled,
                                    bool _disputed,
                                    string memory _txnId,
                                    string memory _usersMessages,
                                    string memory _tokenName) public {
        reputationReports.push(ReputationReportStruct(_sender,
                                              _receiver, 
                                              _timestamp,
                                              _amount, 
                                              _whoFiled,
                                              _disputed,
                                              _txnId,
                                              _usersMessages, 
                                              _tokenName));
        reputationReportCount += 1;
        transactionIdToIndex[_txnId] = reputationReportCount;
        emit NewReputationReport(_sender, _receiver, _timestamp, _amount, _whoFiled, _disputed, _txnId, _usersMessages, _tokenName);
    }

    function getAllReputationReports() public view returns (reputationReportStruct[] memory) {
        return reputationReports;
    }

    function getReputationReportsCount() public view returns (uint256) {
        return reputationReportCount;
    }

    //
    // Allows originators to update the report, either cancelling it or
    // adding to the messages.  Also allows opponents to dispute.
    //
    function updateReputationReport(string memory _txnId, 
                                    bool _disputed,
                                    string memory _messages) payable public returns (string memory _returnCode) {
        uint returnCode; // 0 = success, anything else is an error
        uint index = transactionIdToIndex[_txnId];
        ReputationReportStruct memory reputationReport = reputationReports[index];
        if (strcmp(_txnId, reputationReport.txnId)) {
          //
          // In order to maintain integrity, the sender MUST
          // be either the reputationReports .sender or .receiver.
          // It's a payable function since we are updating data
          // on chain.
          // 
          if (msg.sender == reputationReport.sender || 
              msg.sender == reputationReport.receiver) {
              reputationReport.disputed = _disputed;
              reputationReport.usersMessages = _messages;
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