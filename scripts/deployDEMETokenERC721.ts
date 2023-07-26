import hre, { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike} from "@ethersproject/bytes";

async function main() {
  const [caller]: SignerWithAddress[] = await ethers.getSigners();

  console.log("\nCaller address: ", caller.address);
  console.log("\n");

  const contractName = "PoPP Explorer";
  const symbol = "POPE";
  const contractUri = "https://v1.api.poppclub.cn/im/deid/pass/contract/uri/PoPP-Explorer";
  const baseUri = "https://v1.api.poppclub.cn/im/deid/pass/metadata/PoPP-Explorer/";
  const gasPriceDeme = "15";//polygon=150 eth=10 goerli=3
  const gasPriceUnit = "gwei";//polygon=150 eth=10 goerli=3

  const demeTokenERC721 = await ethers
      .getContractFactory("PoPPExplorer")
      .then(f => f.deploy(
          caller.address
          , contractName
          , symbol
          , contractUri
          , baseUri, {gasPrice: ethers.utils.parseUnits(gasPriceDeme, gasPriceUnit)}));
  console.log(
      "Deploying DEMETokenERC721 \ntransaction: ",
      demeTokenERC721.deployTransaction.hash,
      "\naddress: ",
      demeTokenERC721.address,
      "\n"
  );

}

async function verify(address: string, args: any[]) {
  try {
    return await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(address, args, e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat run scripts/deployDEMETokenERC721.ts --network polygon
// npx hardhat run scripts/deployDEMETokenERC721.ts --network goerli
// npx hardhat run scripts/deployDEMETokenERC721.ts --network mainnet

