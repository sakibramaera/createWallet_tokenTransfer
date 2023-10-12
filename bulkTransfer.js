process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const ethers = require("ethers");
const tokenAbi = require("./ABI/abi.json");
const dotenv = require("dotenv");
dotenv.config();
const data = require("./wallet.json");

const result = [
  //   "0x69205b09601bbcd25645d8fbc74650c89e6dfdd8",
  //   "0xe37f13f8cb97fd03cd8604d1fa22c43743f338a0",
  //   "0xf5fba91cc54afd4ad3602e2ac6281217a55d5266",
  //   "0x3913e85ff4f16afa5b8c74a246813b41f4575cc7",
  //   "0xe5369afe491d081a17f37afeb57a6c2bd54bc2d6",
  //   "0x2a2b6a3f3e9bfba207f0e183513c2d7ee8b8b585",
  //   "0x1c4027b9c997ab9c36e1a3f578cd7f9896e86e1b",
  //   "0xaba365d5e5551fd0ad02f9babada704b4452b7df",
  //   "0x242b5e822172f22cb87850ebbea2bc5eb3b2dd91",
  //   "0x239acc86eff20dac999b80777e296a6ff184bfbd",
];
data.map(async (add) => {
  await result.push(add.address);
});

const provider = new ethers.JsonRpcProvider("https://blockchain.ramestta.com");
const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

const contract = new ethers.Contract(
  process.env.CONTRACTADDRESS,
  tokenAbi,
  signer
);
const bulkTransfer = async (data) => {
  console.log(data);
  await contract.bulkTransfer(data, ethers.parseEther("21"));
  console.log("end");
};


// TransferNative coin from contract function
const transferRama = async (Address) => {
    await contract.transferRama(Address, { value: ethers.parseEther("0.0002") })
    console.log("end....");
}
// TransferNative coin without contract
const transferNativeRama=async (address)=>{
    const tx=await signer.sendTransaction({
        from:signer.address,
        to:address,
        value:ethers.parseEther("0.001")
    })
    console.log("txHash: ",tx.hash);
}
const startTransfer = async () => {
    for (let item of data) {
    //   await transferRama(item.address);
    await transferNativeRama(item.address)
    }
  };
  (async () => {
    await startTransfer();
  })();
// bulkTransfer(result);


