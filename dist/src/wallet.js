let wallet	= new function() {
	this.web3				= null,
	this.callback		= null,
	this.keyObject	= null,
	this.contract		= {},
  this.balances   = {},
  this.erc20abi   = [{"constant": true,"inputs": [],"name": "name","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "decimals","outputs": [{"name": "","type": "uint8"}],"payable": false,"type": "function"},{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"}],
  this.start	= function() {
		wallet.loadJson('wallet.json',(err,data)=>{
			if(err) {
				console.log(err);
			} else {
				wallet.option   = data;

		    if(wallet.option['type']=="http") {
					wallet.web3		= new Web3(new Web3.providers.HttpProvider(wallet.option['network'][wallet.option['type']]));
					setInterval(()=>{wallet.update();if(wallet.callback)wallet.callback();},60000);
				} else {
					wallet.web3		= new Web3(new Web3.providers.WebsocketProvider(wallet.option['network'][wallet.option['type']]));
					wallet.web3.eth.subscribe('newBlockHeaders',()=>{wallet.update();if(wallet.callback)wallet.callback();});
				}

		    wallet.balances['0x0']  = {'contract':null,'balance':-1,'name':'ETH','icon':'<i class="fab fa-ethereum"></i>'};
		    for (let i=0 ; i < data['erc20s'].length ; i++)
		      wallet.addERC20(data['erc20s'][i]);

				wallet.createContracts();
				wallet.update();

				console.log("web3 :"+wallet.web3.version);
			}
		});
		return wallet;
  },
  this.addERC20  	= function(erc20) {
    if(!wallet.balances[erc20[0]])
      wallet.balances[erc20[0]] = {'contract':new wallet.web3.eth.Contract(wallet.erc20abi,erc20[0]),'balance':-1,'name':erc20[1],'icon':erc20[2]};
  },
	this.pushContract = function (abi,address) {
		if(!wallet.contract[address])
			wallet.contract[address]	= {a:abi,c:!wallet.web3?null:new wallet.web3.eth.Contract(abi,address)};
	},
	this.createContracts = function () {
		if(!wallet.web3)
			return;
		for (var address in wallet.contract)
			if(!wallet.contract[address].c)
				wallet.contract[address].c	= new wallet.web3.eth.Contract(wallet.contract[address].a,address);
	},
  this.update			= function() {
    if(wallet.isAddress()) {
			for (let erc20 in wallet.balances)
				wallet.getBalance(erc20,wallet.callback);
    }
  },
	this.getBalance	= function(erc20,callback) {
		if(!wallet.isAddress())
			return;
		if(erc20=='0x0')
			wallet.web3.eth.getBalance(wallet.address(),(e,r)=>{if(!e){wallet.balances[erc20]['balance']=parseInt(r);if(callback)callback();}});
		else
			wallet.balances[erc20]['contract'].methods.balanceOf(wallet.address()).call((e,r)=>{if(!e){wallet.balances[erc20]['balance']=parseInt(r);if(callback)callback();}});
	}

	// create
	this.create	= function(password,callback) {
		let dk				= keythereum.create();
		let temp			= keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
		if(callback)
			callback(temp);
	},

	// login
	this.login	= function(password,keyObject,error,success) {
		if(!wallet.web3) {
			if(error)
				error("web3 error");
			return;
		} else {
			try {
				wallet.keyObject	= keyObject;
				keythereum.recover(password, keyObject);
				wallet.update();
				if(wallet.callback)
					wallet.callback();
				if(success)
					success(wallet.address());
			} catch (e) {
				wallet.keyObject	= null;
				if(error)
					error(e);
			}
		}
	},
	this.address = function () {
		return wallet.keyObject?'0x'+wallet.keyObject.address:'n/a';
	},
	this.addressQR	= function() {
		return '<img src="https://api.qrserver.com/v1/create-qr-code/?data='+wallet.address()+'&size=256x256 alt="" width="256" height="256"/>';
	},
	this.addressLNK = function () {
		return wallet.option['network']['href']+"/address/"+wallet.address();
	},
	this.txLNK = function (txHash) {
		return wallet.option['network']['href']+"/tx/"+txHash;
	},
	this.isAddress = function () {
		return wallet.web3?wallet.web3.utils.isAddress(wallet.address()):false;
	},

	// logout
	this.logout	= function(password,callback) {
		wallet.keyObject			= null;
		if(callback)
			callback("logout");
	},

	// transfer
	this.transfer	= function(to,password,erc20,amount,error=null,hash=null,success=null) {
		if(wallet.isAddress())
			wallet.getBalance(erc20,()=>{
				amount = wallet.web3.utils.toWei(amount,'ether');
				if(wallet.balances[erc20]['balance']>amount) {
					if(erc20=='0x0')
						wallet.sendTx(to,password,amount,null,error,hash,success);
					else
						wallet.sendTx(to,password,0,wallet.web3.utils.toWei(0,'ether'),wallet.balances[erc20]['contract'].methods.transfer(amount).encodeABI(),error,hash,success);
				} else {
					if(error)
						error('Out of balance');
				}
			});
	},

	// sendTx
	this.sendTx	= function(to,password,amount,data=null,error=null,hash=null,success=null) {
		if(wallet.isAddress()) {
			let privateKey	= wallet.getPrivateKeyString(password);

			if(privateKey!=null&&wallet.web3.utils.isAddress(to)) {
				wallet.web3.eth.getGasPrice((e,gasPrice)=>{
					if(e!=null) {
						if(error)
							error("Fail get gas price");
					} else {
						let tx = {'from':wallet.address(),'to':to,'value':wallet.web3.utils.toHex(amount)};
						if(data!=null)	tx['data']	= data;
						wallet.web3.eth.estimateGas(tx).then((gasLimit)=>{
							tx['gasPrice']	= wallet.web3.utils.toHex(parseInt(gasPrice));
							tx['gasLimit']	= wallet.web3.utils.toHex(parseInt(gasLimit));
							wallet.web3.eth.accounts.privateKeyToAccount('0x'+privateKey).signTransaction(tx).then((r)=>{
								wallet.web3.eth.sendSignedTransaction(r.rawTransaction)
									.on('transactionHash',(r0)=>{
										if(hash)
											hash(r0);
									}).then((r1)=>{
										if(success)
											success(r1);
										wallet.update();
									}).catch((e)=>{if(error)error(e);});
							});
						});
					}
				});
			} else {
				if(error&&wallet.web3.utils.isAddress(to))
					error("Wrong password");
			}
		}
	},
	this.getPrivateKeyString	= function(password) {
		let privateKey	= null;
		try {
			let temp		= keythereum.recover(password, wallet.keyObject);
			privateKey	= Array.prototype.map.call(temp, x => ('00' + x.toString(16)).slice(-2)).join('');
		} catch (e) {
			privateKey	= null;
		}
		return privateKey;
	},

	// txHistory
	this.txHistory	= function(erc20, callback) {
		if(wallet.isAddress()) {
			if(erc20=="0x0")
				wallet.txNormal(wallet.address(),(data0)=>{
						wallet.txInternal(wallet.address(),(data1)=>{
							let total = data0.concat(data1);
							total.sort(function(a, b){return parseInt(b.blockNumber)-parseInt(a.blockNumber);});
							callback(total);
						});
				});
			else
				wallet.txERC20(erc20,wallet.address(),callback);
		}
	},
	// transaction history
	this.txNormal	= function(address,callback) {
		let url	= wallet.option['network']['api']+"/api?module=account&action=txlist&address="+address+"&startblock=0&endblock=latest&sort=desc";
		wallet.loadJson(url,(err,data)=>{if(!err)callback(data.result);});
	},
	this.txInternal	= function(address,callback) {
		let url	= wallet.option['network']['api']+"/api?module=account&action=txlistinternal&address="+address+"&startblock=0&endblock=latest&sort=desc";
		wallet.loadJson(url,(err,data)=>{if(!err)callback(data.result);});
	},
	this.txERC20	= function (erc20,address,callback) {
		let url	= wallet.option['network']['api']+'/api?module=account&action=tokentx&contractaddress='+erc20+'&address='+address+'&startblock=0&endblock=latest&sort=asc';
		wallet.loadJson(url,(err,data)=>{if(!err)callback(data.result);});
	},
	this.logs	= function(address,topics,callback) {
		let url	= wallet.option['network']['api']+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address;
		if(topics!='')
			url +='&'+topics;
		wallet.loadJson(url,(err,data)=>{if(!err)callback(data.result);});
	},

	// json
	this.loadJson = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (callback)
						callback(null,JSON.parse(xhr.responseText));
				} else {
					if (callback)
						callback(xhr,null);
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	}
}

if(typeof module !== 'undefined')
  module.exports = wallet.start();
else
	wallet.start();