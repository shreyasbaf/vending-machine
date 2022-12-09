import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../shared/Buttons/Button";
import { connectors } from "../utils/connectors";
import { shorten, weiToEth } from "../utils/helpers";
import { HeaderContainer } from "./NavbarStyles";

const Navbar = () => {
  const { account, activate, deactivate, active, library } = useWeb3React();
  const [balance, setBalance] = useState<any>("");
  const getBalance = async () => {
    if (library) {
      const bal = await library?.eth?.getBalance(account);
      setBalance(parseFloat(weiToEth(bal)).toFixed(4));
    }
  };

  useEffect(() => {
    getBalance();
  }, [account]);

  return (
    <HeaderContainer>
      <h2>Vending Machine</h2>
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
            {balance && <SecondaryButton>Acc: {shorten(account)} Bal : {balance}</SecondaryButton>}
            <SecondaryButton
              onClick={() => {
                deactivate();
              }}
            >
              Disconnect
            </SecondaryButton>
          </div>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Navbar;
