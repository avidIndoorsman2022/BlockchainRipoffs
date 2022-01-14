const main = async () => {
  const walletReputationsFactory = await hre.ethers.getContractFactory(
    "WalletReputations"
  );
  const walletReputationsContract = await walletReputationsFactory.deploy();

  await walletReputationsContract.deployed();

  console.log("WalletReputations address: ", walletReputationsContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
