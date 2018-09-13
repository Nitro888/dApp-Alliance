const gzip = require('gzip-js');
const conf = {
  manager   : '0xd8ad700681e765ccaf8fb855036641e72f01cbf5',
  avatarLog : {"anonymous":false,"inputs":[{"indexed":true,"name":"_user","type":"address"},{"indexed":true,"name":"_contract","type":"address"},{"indexed":false,"name":"_msgPack","type":"bytes"}],"name":"AVATAR","type":"event"},
  badgeLog  : {"anonymous":false,"inputs":[{"indexed":true,"name":"_index","type":"uint8"},{"indexed":false,"name":"_title","type":"string"},{"indexed":false,"name":"_img","type":"bytes"}],"name":"ASSET","type":"event"},
  settingLog: {"anonymous":false,"inputs":[{"indexed":false,"name":"_msgPack","type":"bytes"}],"name":"SETTING","type":"event"},
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
  this.load = function(id,address,error=null,success=null) {
    view.loadJson(conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+conf.manager+'&topic0='+view.web3.eth.abi.encodeEventSignature(conf.avatarLog)+'&topic1='+view.web3.utils.padLeft(address,64),
    (xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let store = '0x'+data.result[data.result.length-1].topics[2].toString().slice(-40).toLowerCase();
        let temp  = view.web3.eth.abi.decodeLog(conf.avatarLog['inputs'],data.result[data.result.length-1].data,data.result[data.result.length-1].topics);
        let json  = msgpack.decode(view.web3.utils.hexToBytes(temp['_msgPack']));
        view.draw(id,address,store,json,success);
      } else {
        console.log("error:"+address);
        if(error)
          error();
      }
    });
  },
  this.draw = function (id,address,store,json,callback=null) {
    let img   = '<div style="height:100%;width:100%;position:relative;overflow:hidden;">';
    for(let i = 0 ; i < json.imgs.length ; i++ ) {
      let style = 'position:absolute;width:100%;height:auto;';
      if(json.imgs[i].p)  style += 'top:'+json.imgs[i].p.y+'%;left:'+json.imgs[i].p.x+'%;';
      img += '<object id="'+id+'_'+address+'_'+json.imgs[i].g+'" data="" style="'+style+'"></object>';
    }

    document.getElementById(id).innerHTML = img+'</div>';
    let that = this;
    for(let i = 0 ; i < json.imgs.length ; i++ ) {
      document.getElementById(id+'_'+address+'_'+json.imgs[i].g).onload  = function() {that.color(id,address,json.imgs[i].g,json.imgs[i].c)};
      view._asset(store,id+'_'+address+'_'+json.imgs[i].g,view.web3.utils.padLeft(view.web3.utils.toHex(json.imgs[i].id),64));
    }

    if(callback)
      callback(store);
  },
  this.setting = function (address,callback) {
    view.loadJson(conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&topic0='+view.web3.eth.abi.encodeEventSignature(conf.settingLog),
    (xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let temp    = view.web3.eth.abi.decodeLog(conf.settingLog['inputs'],data.result[data.result.length-1].data,data.result[data.result.length-1].topics);
        callback(view.web3.utils.hexToBytes(temp['_msgPack']));
      } else
        callback(null);
    });
  },
  this.unzip = function(bytes) {
    return view.web3.utils.hexToUtf8(view.web3.utils.bytesToHex(gzip.unzip(view.web3.utils.hexToBytes(bytes))));
  },
  this._asset = function(address,div,id) {
    let url = conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&topic0='+view.web3.eth.abi.encodeEventSignature(conf.assetLog)+'&topic2='+id;
    view.loadJson(url,(xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let temp    = view.web3.eth.abi.decodeLog(conf.assetLog['inputs'],data.result[data.result.length-1].data,data.result[data.result.length-1].topics);
        fetch(view.unzip(temp['_img'])).
          then(function(response) {return response.blob();}).
          then(function(blob) {document.getElementById(div).data = URL.createObjectURL(blob);});
      } else {
        console.log("error:"+address);
      }
    });
  },
  this.color = function (id,address,category,color) {
    if(color!='') {
      let element = document.getElementById(id+'_'+address+'_'+category);
      if(element&&element.contentDocument&&element.contentDocument.getElementById('Color'))
        element.contentDocument.getElementById('Color').setAttribute("fill", color);
    }
  },
  this.list = function (address,category,callback=null) {
    let url = conf.api+'/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&topic0='+view.web3.eth.abi.encodeEventSignature(conf.assetLog);
    url     +=category>=0?'&topic1='+view.web3.utils.padLeft(view.web3.utils.toHex(category),64):'';
    view.loadJson(url,(xhr,data)=>{
      if(xhr==null&&data&&data.result&&data.result.length>0){
        let result = [];
        for(let i=0 ; i < data.result.length ; i++) {
          let temp    = view.web3.eth.abi.decodeLog(conf.assetLog['inputs'],data.result[i].data,data.result[i].topics);
          result.push({
            index     : view.web3.utils.hexToNumber(data.result[i].topics[2]),
            img       : view.unzip(temp['_img'])
          });
        }
        if(callback)
          callback(category,result);
      } else {
        console.log("error:"+address);
      }
    });
  }
}

module.exports.view = view;
module.exports.conf = conf;
