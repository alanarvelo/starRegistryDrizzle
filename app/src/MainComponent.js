import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import { AccountData } from "@drizzle/react-components";
import CreateStar from "./CreateStar";
import LookUpStar from "./LookUpStar";

function MainComponent () {
  return (
    <div className="App">
      <div>
        <h1>Star Notary DApp </h1>
        <hr style={{width: 500}}></hr>
      </div>
      <div className="section">
        <h2>Active Account</h2>
        <AccountData accountIndex={0} units="ether" precision={2} />
      </div>
      <CreateStar />
      <LookUpStar />
    </div>
  )
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    StarNotary: state.contracts.SimpleStorage,
  };
};

export default drizzleConnect(MainComponent, mapStateToProps)