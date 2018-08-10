const conf = {
  manager   : '0x22d5bba3532c1ab39a55d0051eca18b3179ab6ba',
  avatar    : [{"constant":false,"inputs":[{"name":"_contract","type":"address"},{"name":"_msgPack","type":"bytes"}],"name":"avatar","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}],
  avatarLog : {"anonymous":false,"inputs":[{"indexed":true,"name":"_user","type":"address"},{"indexed":true,"name":"_contract","type":"address"},{"indexed":false,"name":"_msgPack","type":"bytes"}],"name":"AVATAR","type":"event"},
  asset     : [{"constant":false,"inputs":[{"name":"_category","type":"uint256"},{"name":"_image","type":"bytes"}],"name":"asset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
  assetLog  : {"anonymous":false,"inputs":[{"indexed":true,"name":"_category","type":"uint256"},{"indexed":true,"name":"_index","type":"uint256"},{"indexed":false,"name":"_img","type":"bytes"}],"name":"ASSET","type":"event"},
  provider  : "https://ropsten.infura.io",
  api       : "https://api-ropsten.etherscan.io",
}

const view  = new function () {
  this.web3 = new Web3(new Web3.providers.HttpProvider(conf.provider)),
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
  this.load = function(id,address) {
    view.loadJson(conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+conf.manager+'&topic1='+view.web3.utils.padLeft(address,64),
    (xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let temp  = view.web3.eth.abi.decodeLog(conf.avatarLog['inputs'],data.result[data.result.length-1].data,data.result[data.result.length-1].topics);
        let json  = msgpack.decode(view.web3.utils.hexToBytes(temp['_msgPack']));
        let img   = '<div style="height:100%;width:100%;position:relative;overflow:hidden;">';
        for(let i = 0 ; i < json.imgs.length ; i++ )
          img += '<img id="'+address+'_'+i+'" src="" style="position:absolute;top:'+json.imgs[i].y+'%;left:'+json.imgs[i].x+'%;width:100%;height:auto;"/>';
        document.getElementById(id).innerHTML = img+'</div>';
        for(let i = 0 ; i < json.imgs.length ; i++ )
          view._asset('0x'+data.result[data.result.length-1].topics[2].toString().slice(-40).toLowerCase(),address+'_'+i,view.web3.utils.padLeft(view.web3.utils.toHex(json.imgs[i].id),64));
      } else {
        console.log("error:"+address);
      }
    });
  },
  this._asset = function(address,div,id) {
    let url = conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&topic2='+id;
    view.loadJson(url,(xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let temp    = view.web3.eth.abi.decodeLog(conf.assetLog['inputs'],data.result[data.result.length-1].data,data.result[data.result.length-1].topics);
        document.getElementById(div).src = view.web3.utils.hexToAscii(temp['_img']);
      } else {
        console.log("error:"+url);
      }
    });
  },
  this.list = function (address,category,callback=null) {
    let url = conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&topic1='+view.web3.utils.padLeft(view.web3.utils.toHex(category),64);
    view.loadJson(url,(xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let result = [];
        for(let i=0 ; i < data.result.length ; i++) {
          let temp    = view.web3.eth.abi.decodeLog(conf.assetLog['inputs'],data.result[i].data,data.result[i].topics);
          result.push({
            index     : view.web3.utils.hexToNumber(data.result[i].topics[2]),
            img       : view.web3.utils.hexToAscii(temp['_img'])
          });
        }
        if(callback)
          callback(category,result);
      } else {
        console.log("error:"+url);
      }
    });
  }
}

if(typeof module !== 'undefined') {
  module.exports.view = view;
  module.exports.conf = conf;
}
