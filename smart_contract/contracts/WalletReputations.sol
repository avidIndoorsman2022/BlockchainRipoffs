//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract WalletReputations {
    uint public reputationReportCount;
    address payable public admin;
    uint256 public entryFee; // $5 USD (in Wei) but can be adjusted by admin

    struct ReputationReportStruct {
        address sender;  
        address receiver;      
        uint256 timestamp;   // when the fraud/scam took place
        uint256 amount;      // units are denoted in 'blockchain' (below)
        bool fromFiled;      // true if From(sender) address filed this report
        bool disputed;       // true if opposing party has lodged a dispute
        string txnId;        // transaction Id of reputation
        string usersMessages; // text of messages left by originator and disputer, if any
        string tokenName;   // unit of amount (above)
    }

    ReputationReportStruct[] public reputationReports;

    event NewReputationReport(address sender, address receiver, 
                uint256 timestamp, uint256 amount, bool fromFiled, 
                bool disputed, string txnId, string messages, string tokenName);
    
    //
    // This mapping is for quickly updating an existing
    // report.  Given a transaction Id, we can lookup the
    // index into the reputationReportStruct to quickly find
    // the exact reputationReport.
    // I.e, txnId => reputationReportStruct[index]
    //
    mapping(string => uint) public transactionIdToIndex; 

    //
    // For our constructor, we declare that the owner is first 
    // address to deploy.
    //
    constructor() {
        admin = payable(msg.sender);
        entryFee = 1551990000000000; // about $5 
    }

    function createReputationReport(address _sender, 
                                    address _receiver, 
                                    uint256 _timestamp,
                                    uint256 _amount,        
                                    bool _fromFiled,
                                    bool _disputed,
                                    string memory _txnId,
                                    string memory _usersMessages,
                                    string memory _tokenName) payable public {
        //
        // Make sure the caller has provided enough of an entry fee.
        //
        require(
            msg.value >= entryFee,
            "Minimum entry fee not met"
        );
        
        reputationReports.push(ReputationReportStruct(_sender,
                                              _receiver, 
                                              _timestamp,
                                              _amount, 
                                              _fromFiled,
                                              _disputed,
                                              _txnId,
                                              _usersMessages, 
                                              _tokenName));
        reputationReportCount += 1;
        transactionIdToIndex[_txnId] = reputationReportCount;
        emit NewReputationReport(_sender, _receiver, _timestamp, _amount, _fromFiled, _disputed, _txnId, _usersMessages, _tokenName);
    }

    function getAllReputationReports() public view returns (ReputationReportStruct[] memory) {
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
                                    string memory _messages) payable public {
        //
        // Make sure the caller has provided enough of an entry fee.
        //
        require(
            msg.value >= entryFee,
            "Minimum entry fee not met"
        );

        uint index = transactionIdToIndex[_txnId];
        ReputationReportStruct memory reputationReport = reputationReports[index];
        //
        // Make sure the transaction IDs match up.
        //
        require((strcmp(_txnId, reputationReport.txnId) == true),
                "Transaction Id mismatch");
        //
        // In order to maintain integrity, the sender MUST
        // be either the reputationReports .sender or .receiver.
        // It's a payable function since we are updating data
        // on chain.
        //
        require((msg.sender == reputationReport.sender || 
                 msg.sender == reputationReport.receiver),
            "Update can only be done by the sender or receiver of the original transaction");

        //
        // Finally, make the update(s).
        //
        reputationReport.disputed = _disputed;
        reputationReport.usersMessages = _messages;
    }

    //
    // Admin functions
    //
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    //
    // In Solidity 0.8.0 and higher, we need to explicitly
    // cast addresses like msg.sender to payable.
    //
    function withdraw() payable public onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    //
    // Allow the admin to change the entry fee after deployment.
    //
    function changeEntryFee(uint256 newEntryFeeInWei) public onlyAdmin {
        require (newEntryFeeInWei != entryFee);
        entryFee = newEntryFeeInWei;
    }

    //
    // Utilities
    //
    function memcmp(bytes memory a, bytes memory b) internal pure returns(bool) {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }
    function strcmp(string memory a, string memory b) internal pure returns(bool) {
        return memcmp(bytes(a), bytes(b));
    }
}