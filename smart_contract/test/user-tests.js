//
// These tests are from the point of view of a typical caller,
// as opposed to the admin-tests.js, which tests the owner calls.
//
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WalletReputations (User Functions)", function () {
  it("Should return the current number of reputation reports + 1 once we add a report", async function () {
    const WalletReputations = await ethers.getContractFactory(
      "WalletReputations"
    );
    let [addr1, addr2] = await ethers.getSigners();

    console.log("Addr1: " + addr1.address);
    const addr1Balance = await addr1.provider.getBalance(addr1.address);
    console.log(
      "Addr1 balance: " + ethers.utils.formatEther(addr1Balance).toString()
    );

    console.log("Addr2: " + addr2.address);
    const addr2Balance = await addr1.provider.getBalance(addr2.address);
    console.log(
      "Addr2 balance: " + ethers.utils.formatEther(addr2Balance).toString()
    );

    const walletReputations = await WalletReputations.deploy();
    await walletReputations.deployed();

    console.log("Contract: " + walletReputations.address);
    const contractBalance = await walletReputations.provider.getBalance(
      walletReputations.address
    );
    console.log(
      "Contract balance: " +
        ethers.utils.formatEther(contractBalance).toString()
    );

    //
    // Get the number of reputation reports on the blockchain now.
    //
    const previousNumberOfReputationReports =
      await walletReputations.getReputationReportsCount();
    console.log(
      "Previous number of reports: " + previousNumberOfReputationReports
    );

    //
    // Prepare a fake fraud report.
    //
    const sender = "0xC94Efd022E416CC15C2b8D6935293B9ed099a46f";
    const receiver = "0x8Bcea6e7F529665A35aBb355D4BeDb2987989805";
    const timestamp = 9974592;
    const amount = 1000000000000000;
    const whoFiled = 0;
    const disputed = false;
    const txnId =
      "0xe70d92b90e97258612f81630e0927736b0269bce08db248959abd88bb07ec88e";
    const userMessages = "I think it's a scam!";
    const tokenName = "ETH";

    //
    // Create a fraud report.
    //
    const creationTx = await walletReputations.createReputationReport(
      sender,
      receiver,
      timestamp,
      amount,
      whoFiled,
      disputed,
      txnId,
      userMessages,
      tokenName,
      { value: ethers.utils.parseEther("1.001") }
    );

    //
    // Wait until the transaction is mined.
    //
    await creationTx.wait();

    //
    // And now grab the new count of fraud reports.
    //
    const currentNumberOfReputationReports =
      await walletReputations.getReputationReportsCount();
    console.log(
      "Current number of reports: " + currentNumberOfReputationReports
    );

    //
    // And finally assert that the count has been incremented.
    //
    expect(currentNumberOfReputationReports).to.equal(
      previousNumberOfReputationReports + 1
    );
  });
});
