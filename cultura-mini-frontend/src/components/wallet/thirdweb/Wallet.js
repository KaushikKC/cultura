import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";

const Wallet = () => {
  return (
    <div>
      <ConnectButton client={client} />
    </div>
  );
};

export default Wallet;
