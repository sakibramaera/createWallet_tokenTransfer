process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const Web3 = require("web3");
const ethers = require("ethers");
const fs = require("fs");
const tokenAbi = require("./ABI/abi.json");
const dotenv = require("dotenv");
dotenv.config();

const data = require("./wallet.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://blockchain.ramestta.com")
);

// const web3 = new Web3(
//   new Web3.providers.HttpProvider("https://rpc-sepolia.rockx.com")
// );

// const account1 = "0x27541d47BBF85D04300fE890785C71ee7F960d70"; //sepolia
// const contractAddress = "0x77419c9aD2F5C5cE0Ab4994a83949b5046C52FD5"; //TestToken

const myContract = new web3.eth.Contract(
  tokenAbi,
  `${process.env.CONTRACTADDRESS}`
);

const fundTransfer = async (amount) => {
  try {
    const result = [];
    data.map((add) => {
      result.push(add.address);
    });

    console.log("===========>", result);
    var count = await web3.eth.getTransactionCount(`${process.env.ACCOUNT1}`);
    console.log("=========>52", count);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice==", gasPrice);
    // const gasLimit = 210000 * result.length;
    //  console.log("======>42",gasLimit);
    const Data = await myContract.methods
      .bulkTransfer(result, amount)
      .encodeABI();

    console.log("data==>>", Data);

    var rawTransaction = {
      to: `${process.env.CONTRACTADDRESS}`,
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(100000), // Always in Wei
      data: Data,
    };

    console.log("helloooo===>72", rawTransaction);

    const signedTx = await web3.eth.accounts.signTransaction(
      rawTransaction,
      `${process.env.PRIVATE_KEY}`
    );
    console.log("helloooo===>75", signedTx);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    console.log(`Transaction hash: ${receipt.transactionHash}`);
  } catch (error) {
    console.log({
      responseCode: 501,
      responseMessage: "Internal Server Error",
      responseResult: error,
    });
  }
};

const getTransactionFinalisation = async (txnHash) => {
  return new Promise(async (resolve, reject) => {
    let record;

    while (!record) {
      try {
        const rec = await web3.eth.getTransactionReceipt(txnHash);
        record = rec;
        // console.log("rec", rec);
      } catch (err) {
        console.log("getStat", err);
      }
    
    }

    resolve(record);
  });
};

const transferamount = async (address, amount) => {
  try {
    console.log("===========================================");
    console.log("sending ", amount, " tokens to ", address);
    var nonce = await web3.eth.getTransactionCount(`${process.env.ACCOUNT1}`);
    console.log({ nonce });
    const gasPrice = await web3.eth.getGasPrice();
    const Data = await myContract.methods.transfer(address, amount).encodeABI();
    var rawTransaction = {
      to: `${process.env.CONTRACTADDRESS}`,
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(100000),
      data: Data,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      rawTransaction,
      `${process.env.PRIVATE_KEY}`
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    const txnHash = receipt.transactionHash;
    console.log(`Transaction hash: ${receipt.transactionHash}`);

    const statusRecord = await getTransactionFinalisation(txnHash);
    console.log({ txnHash, address, status: statusRecord.status });
  } catch (error) {
    console.error("transferamount", {
      responseCode: 501,
      responseMessage: "Internal Server Error",
      responseResult: error,
    });
  }
};

const checkBalance = async () => {
  const balance = await myContract.methods.balanceOf(account1).call();
  console.log(balance);
};

// fundTransfer(1000);
// checkBalance();

const startTransfer = async () => {
  for (let item of data) {
    await transferamount(item.address, 100);
  }
};

(async () => {
  await startTransfer();
})();
