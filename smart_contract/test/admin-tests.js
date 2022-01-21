//
// These tests are from the point of view of the contract owner,
// as opposed to the user-tests.js, which tests typical user calls.
//
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("WalletReputations (Admin Functions)", function () {
  it("Should return the new entry fee once we update it", async function () {
    const WalletReputations = await ethers.getContractFactory(
      "WalletReputations"
    );
    const walletReputations = await WalletReputations.deploy();
    await walletReputations.deployed();

    //
    // Get the entry fee now.
    //
    const previousEntryFee = await walletReputations.entryFee();
    console.log("Previous EntryFee: " + previousEntryFee);

    newProposedEntryFee = 1551991234567890; // about $5
    await walletReputations.changeEntryFee(newProposedEntryFee);

    //
    // And finally assert that the new Entry Fee has been updated.
    //
    const newEntryFee = await walletReputations.entryFee();
    console.log("Updated EntryFee: " + newEntryFee);
    assert(previousEntryFee != newEntryFee);
  });
});
