var SimpleStorage = artifacts.require("./SimpleStorage.sol");
const Research = artifacts.require('./Research.sol')

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Research)
};
