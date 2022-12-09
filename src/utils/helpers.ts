import BigNumber from "bignumber.js";
import Web3 from "web3";
import {
  vendingMachineContrctABI,
  vmContractAddress,
} from "../abi/vendingMachine";

export const network = (chainID: any) => {
  if (chainID === 1) {
    return "Mainnet";
  } else if (chainID === 3) {
    return "Ropsten";
  } else if (chainID === 4) {
    return "Rinkeby";
  } else if (chainID === 5) {
    return "Goerli";
  } else if (chainID === 42) {
    return "Kovan";
  } else {
    return "Un-supported Network";
  }
};

export const shorten = (str: any) => {
  return `${str?.toString()?.slice(0, 6)}...${str
    ?.toString()
    .slice(str.length - 4)}`;
};

export const toEther = (library: any, value: any) => {
  if (value) {
    return library?.utils?.fromWei(new BigNumber(value).toString(), "ether");
  }
  return value;
};

export const weiToEth = (amount: string, decimals: number = 18) => {
  return new BigNumber(amount).dividedBy(10 ** decimals).toFixed();
};

export const ethToWei = (amount: string, decimals: number = 18) => {
  return new BigNumber(amount).times(10 ** decimals).toFixed();
};

export const maxAllowance = new BigNumber(2).pow(128).minus(1);

const web3 = new Web3(
  "https://goerli.infura.io/v3/50452d9e36f5477cb08c1f362eb4d9c8"
);

export const publicInstance = new web3.eth.Contract(
  vendingMachineContrctABI,
  vmContractAddress
);
