const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");
const fs = require("fs");
const data = require("./wallet.json");

const generateWallet = async () => {
  try {
    let Address = [...data];
    let mnemonic = await bip39.generateMnemonic();

    for (let i = 0; i < 1000; i++) {
      let path = `m/44'/60'/0'/0/${i}`;

      const seed = bip39.mnemonicToSeedSync(mnemonic);

      let hdwallet = hdkey.fromMasterSeed(seed);
      let wallet = hdwallet.derivePath(path).getWallet();
      let address = "0x" + wallet.getAddress().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");

      const obj = {
        address: address,
        privateKey: privateKey,
      };
      // console.log(obj);
      Address.push(obj);
    }
    //   console.log("Address==>>49", Address);
    const jsonData = JSON.stringify(Address);
    fs.renameSync("./wallet.json", "./lastWallet.json");
    fs.appendFileSync("wallet.json", jsonData);
  } catch (error) {
    console.log({
      responseCode: 501,
      responseMessage: "Internal Server Error",
      responseResult: error,
    });
  }
};

generateWallet();
