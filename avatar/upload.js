'use strict';

const Web3      = require('web3');
const fs        = require('file-system');

const provider  = 'https://ropsten.infura.io';
const web3      = new Web3(new Web3.providers.HttpProvider(provider));
const ABI       = [];


// load options
let options     = {
  assetList   : [],   // a:
  privatekey  : '',   // p:
  store       : ''    // s:
}

for (let i = 0; i < process.argv.length; i++) {
    console.log(i + ' -> ' + (process.argv[i]));
    let temp = process.argv[i](":");
    switch (temp[0]) {
      case "a":
        options.assetList   = temp[1];
        break;
      case "p":
        options.privatekey  = temp[1];
        break;
      case "s":
        options.store       = temp[1];
        break;
    }
}

// crete privatekey -> account
let account   = web3.eth.accounts.privateKeyToAccount('0x'+options.privatekey);
let contract  = web3.eth.Contract(ABI,options.store);

// load asset list
let assets = [];



// transaction
