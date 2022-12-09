import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  vendingMachineContrctABI,
  vmContractAddress,
} from "../abi/vendingMachine";
import { PrimaryButton, SecondaryButton } from "../shared/Buttons/Button";
import { connectors } from "../utils/connectors";
import { ethToWei, weiToEth } from "../utils/helpers";

interface Props {}

const Home = (props: Props) => {
  const { activate, deactivate, active, library, account } = useWeb3React();
  const [balance, setBalance] = useState<any>("");
  const [vmBalance, setVmBalance] = useState<any>();
  const [donutsBalance, setDonutsBalance] = useState<any>();
  const [buyLoading, setBuyLoading] = useState(false);
  const [restockLoading, setRestockLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [donutsQuantity, setDonutsQuantity] = useState<any>();

  const getBalance = async () => {
    if (library) {
      const bal = await library?.eth?.getBalance(account);
      setBalance(weiToEth(bal));
    }
  };

  const web3 = new Web3(library);

  const contractInstance = new web3.eth.Contract(
    vendingMachineContrctABI,
    vmContractAddress
  );

  const getDonutBalance = async () => {
    if (contractInstance) {
      try {
        const balance = await contractInstance.methods
          .donutBalances(account)
          .call();
        console.log("Balance", balance);
        setDonutsBalance(balance);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getVmBalance = async () => {
    if (contractInstance) {
      try {
        const vmBalance = await contractInstance.methods
          .getVendingMachineBalance()
          .call();
        console.log("Balance", vmBalance);
        setVmBalance(vmBalance);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getOwnerAddress = async () => {
    if (contractInstance) {
      try {
        const owner = await contractInstance.methods.owner().call();
        console.log("Owner", owner, account);
        setIsOwner(owner === account);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const buyDonuts = async (quantity: number) => {
    if (contractInstance) {
      try {
        setBuyLoading(true);
        const purchaseEvent = await contractInstance.methods
          .purchase(quantity)
          .send({
            from: account,
            value: ethToWei((quantity * 0.002).toString()),
          })
          .on("receipt", (receipt: any) => {
            getDonutBalance();
            setBuyLoading(false);
            setDonutsQuantity("");
          })
          .on("error", (error: any, receipt: any) => {
            setBuyLoading(false);
            alert("transaction failed");
            setDonutsQuantity("");
          });
      } catch (err) {
        setDonutsQuantity("");
        setBuyLoading(false);
        console.log(err);
      }
    }
  };

  const restock = async (quantity: any) => {
    if (contractInstance) {
      try {
        setRestockLoading(true);
        const restockEvent = await contractInstance.methods
          .restock(quantity)
          .send({
            from: account,
          })
          .on("receipt", (receipt: any) => {
            getVmBalance();
            setRestockLoading(false);
          })
          .on("error", (error: any, receipt: any) => {
            alert("transaction failed");
            setRestockLoading(false);
          });
        setRestockLoading(false);
      } catch (err) {
        setRestockLoading(false);
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getBalance();
    getDonutBalance();
    getVmBalance();
    getOwnerAddress();
  }, [account, balance, donutsBalance, vmBalance]);
  return (
    <div>
      {!active ? (
        <PrimaryButton
          onClick={async () => {
            activate(connectors?.injected);
          }}
        >
          Connect
        </PrimaryButton>
      ) : (
        <div>
          {/* {balance && <h3>Balance : {balance}</h3>} */}
          {donutsBalance && <h3>Donuts : {donutsBalance}</h3>}
          {vmBalance && <h3>Units Left : {vmBalance}</h3>}
          <div style={{ marginBottom: "12px" }}>
            <span>Buy Donuts: </span>
            <input
              type="number"
              placeholder="Enter Quantity"
              onChange={(e) => setDonutsQuantity(e.target.value)}
            />
          </div>
          <PrimaryButton
            disabled={buyLoading}
            onClick={() => buyDonuts(donutsQuantity || 1)}
          >
            {buyLoading ? "Loadingg.." : "Buy Donuts"}
          </PrimaryButton>
          {isOwner && (
            <PrimaryButton
              disabled={restockLoading}
              onClick={() => restock(10)}
            >
              Restock 10
            </PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
