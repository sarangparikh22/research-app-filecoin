import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import getContractInstance from './getContractInstance';

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ResearchContract from './contracts/Research.json';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

// import "./App.css";

import NavComp from './components/NavComp'
import Home from './components/Home'
import Upload from './components/Upload'

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, token: null};

  updateToken = (token) => {
    this.setState({token})
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // const contract = await getContractInstance(web3, SimpleStorageContract)

      const contract = await getContractInstance(web3, ResearchContract)

      const totalPapers = await contract.methods.totalPapers().call({from: accounts[0]})
      const userBalance = await contract.methods.balanceMapping(accounts[0]).call({from: accounts[0]})
      let paperArray = [];

      for(let i=0; i<totalPapers; i++){
        paperArray.push(await contract.methods.paperMapping(i).call({from: accounts[0]}))
      }

      this.setState({ web3, accounts, contract, paperArray, userBalance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <NavComp 
          accounts= {this.state.accounts[0]}
          userBalance= {this.state.userBalance}
          contract = {this.state.contract}
        />
         <Router>
          <Switch>
            <Route exact path="/" component={() => <Home 
              web3 = {this.state.web3}
              account = {this.state.accounts[0]}
              contract = {this.state.contract}
              paperArray = {this.state.paperArray}
              token = {this.state.token}
              />}
            />
            <Route exact path="/upload" component={() => <Upload 
              web3 = {this.state.web3}
              account = {this.state.accounts[0]}
              contract = {this.state.contract}
              updateToken = {this.updateToken.bind(this)}
              />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
