const editor  = new function () {
  this.web3   = new Web3(new Web3.providers.HttpProvider(conf.provider)),
  this.manager= null,
  this.store  = null,
	this.loadJson = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200 && callback)
						callback(null,JSON.parse(xhr.responseText));
				else if (callback)
						callback(xhr,null);
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	},
  this.sendTx = function(from,to,pk,data=null,value=0,error=null,success=null) {
    editor.web3.eth.getGasPrice((e,gasPrice)=>{
      if(!e) {
        let tx = {'from':from,'to':to,'value':editor.web3.utils.toHex(value)};
        if(data!=null)
        	tx['data']	= data;
        editor.web3.eth.estimateGas(tx).then((gasLimit)=>{
          tx['gasPrice']	= editor.web3.utils.toHex(parseInt(gasPrice));
          tx['gasLimit']	= editor.web3.utils.toHex(parseInt(gasLimit));
          editor.web3.eth.accounts.privateKeyToAccount(pk).signTransaction(tx).then((r)=>{
            editor.web3.eth.sendSignedTransaction(r.rawTransaction)
              .on('transactionHash',(r)=>{
                if(success)
                  success(r);
              }).then((r)=>{
                if(success)
                  success(r);
              }).catch((e)=>{if(error)error(e);});
          });
        });
      }
    });
  },
  this.uploadAsset = function(who,pk,avatar,category,file,error=null,success=null) {
    if(!editor.store)
      editor.store  = new editor.web3.eth.Contract(conf.asset,avatar);
    editor.sendTx(who,avatar,pk,editor.store.methods.asset(category,editor.web3.utils.utf8ToHex(file)).encodeABI(),0,error,success);
  },
  this.saveAvatar = function (who,pk,avatar,manager,json,price,error=null,success=null) {
    if(!editor.manager)
      editor.manager= new editor.web3.eth.Contract(conf.avatar,manager);
    editor.sendTx(who,manager,pk,editor.manager.methods.avatar(avatar,editor.web3.utils.bytesToHex(msgpack.encode(json))).encodeABI(),editor.web3.utils.toWei(price.toString(),'ether'),error,success);
  }
}
