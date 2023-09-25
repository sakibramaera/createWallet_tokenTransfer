process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const ethers = require("ethers");
const fs = require("fs");
const tokenAbi = require("./ABI/abi.json");
const data = require("./wallet.json");
const dotenv = require("dotenv");
dotenv.config();

const contractAddress = "0xc1a981c765a78D75EfEA53d27b0279f4CfEd2263";

const main = async () => {
  const result = [];
  data.map((add) => {
    result.push(add.address);
  });

  const provider = new ethers.JsonRpcProvider(
    "https://blockchain.ramestta.com"
  );

  const myContract = new ethers.Contract(contractAddress, tokenAbi, provider);

  const privateKey = `${process.env.PRIVATE_KEY}`;
  const signer = new ethers.Wallet(privateKey, provider);
  console.log("signer address", signer.address);

  const tx = await myContract.connect(signer).bulkTransfer(result, "1000", {
    gasLimit: ethers.utils.hexlify(100000),
  });
  await tx.wait();
  console.log("Transaction hash:", tx.hash);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
