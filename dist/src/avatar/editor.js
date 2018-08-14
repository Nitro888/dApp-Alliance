let avatar  = require('./view.js');
const aMgr  = require('../abi/avatar.js');

/*
const editor  = new function () {
  this.web3   = new Web3(new Web3.providers.HttpProvider(avatar.conf.provider)),
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
      editor.store  = new editor.web3.eth.Contract(avatar.conf.asset,avatar);
    editor.sendTx(who,avatar,pk,editor.store.methods.asset(category,editor.web3.utils.utf8ToHex(file)).encodeABI(),0,error,success);
  },
  this.saveAvatar = function (who,pk,avatar,manager,json,price,error=null,success=null) {
    if(!editor.manager)
      editor.manager= new editor.web3.eth.Contract(avatar.conf.avatar,manager);
    editor.sendTx(who,manager,pk,editor.manager.methods.avatar(avatar,editor.web3.utils.bytesToHex(msgpack.encode(json))).encodeABI(),editor.web3.utils.toWei(price.toString(),'ether'),error,success);
  }
}
*/

let editor = {
  template: `
  <div>
    <b-modal ref="refModalEditor" size="lg" title="Editor" header-bg-variant="dark" header-text-variant="light" hide-footer>

      <b-form-group size="sm" label="Avatar Store Address" :invalid-feedback="store.message" :valid-feedback="store.message" :state="store.state&&store.about!=null">
        <b-input-group size="sm" >
          <b-form-input size="sm" type="text" placeholder="address of avatar store" v-model="store.address"></b-form-input>
          <b-input-group-append>
            <b-btn size="sm" variant="info" target="_blank" :href="link"><i class="fas fa-link"></i></b-btn>
            <b-btn size="sm" variant="info" v-on:click="loadStore()"><i class="fas fa-store"></i></b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-nav pills justified tabs class="mb-2">
        <b-nav-item :active="editor.tab==0" v-on:click="editor.tab=0;editor.assetFile=null;"><i class="fas fa-user-circle"></i></b-nav-item>
        <b-nav-item :active="editor.tab==1" v-on:click="editor.tab=1;" :disabled="!isOwner||!isLogedIn" ><i class="fas fa-file-upload"></i></b-nav-item>
        <b-nav-item :active="editor.tab==2" v-on:click="editor.tab=2;" :disabled="!isOwner||!isLogedIn" ><i class="fas fa-cogs"></i></b-nav-item>
      </b-nav>

      <b-row>
        <b-col lg="4">
          <div v-show="editor.tab==0" ref="height" style="width:100%;padding-top:100%;position:relative;background-color:gray;">
            <div id="avatarEditor" style="position:absolute;width:100%;height:100%;top:0%;left:0%;"/>
          </div>
          <div v-if="editor.tab==1" style="width:100%;padding-top:100%;position:relative;overflow:hidden;background-color:gray;">
            <img ref="assetView" src="" style="position:absolute;width:100%;height:auto;top:0%;left:0%;"/>
          </div>
        </b-col>

        <b-col lg="8">
          <b-nav v-if="editor.tab==0&&avatar.tab.length>0" pills justified tabs class="mb-2">
            <b-nav-item v-for='item in avatar.tab' v-bind:item="item" v-bind:key="item.cat" :active="avatar.active==item.cat.toString()" v-on:click="avatar.active=item.cat.toString();">{{item.name}}</b-nav-item>
          </b-nav>
          <div v-show="editor.tab==0" v-bind:style="{width:'100%',height:height+'px','background-color':'gray'}">
            <b-row v-show="avatar.loaded" style="width:100%;height:100%;overflow-y:scroll;">
              <b-col lg="3" v-for='item in avatar.assets[avatar.active]' v-bind:item="item" v-bind:key="item.index">
                <img :src="item.img" style="width:100%;height:auto;overflow:hidden;" v-on:click="select(item.index);"/>
              </b-col>
            </b-row>
          </div>

          <div v-if="editor.tab==1">
            category
            <b-form-file size="sm" placeholder="Choose a file..." v-on:change="loadAsset($event.target.files);" accept="image/*"></b-form-file>
          </div>
        </b-col>
      </b-row>

      <div v-show="editor.tab==2" v-bind:style="{ width:'100%',height:height+'px','overflow-y':'scroll'}">
        <div style="width:100%;height:100%;overflow-y:scroll;">
          <b-form-textarea size="sm" style="width:100%;height:100%;" v-model="setting.json"></b-form-textarea>
        </div>
      </div>

      <b-form-group v-if="isLogedIn" size="sm" label="Password" class="mt-3" :invalid-feedback="contract.message" :valid-feedback="contract.message" :state="contract.state">
        <b-input-group size="sm">
          <b-input-group-text size="sm" v-if="editor.tab==0" slot="prepend">
              <small>{{price.token}}</small>
          </b-input-group-text>
          <b-input-group-text size="sm" v-if="editor.tab==0" slot="prepend">
              <small>{{price.value}}</small>
          </b-input-group-text>
          <b-form-input size="sm" type="password" placeholder="password" v-model="contract.password" :readonly="contract.tab==1&&!isOwner"></b-form-input>
          <b-input-group-append>
            <b-btn v-if="editor.tab==0"  size="sm" variant="info" v-on:click="uploadAvatar()" :disabled="!isOwner"><i class="fas fa-user-circle"></i></b-btn>
            <b-btn v-if="editor.tab==1"  size="sm" variant="info" v-on:click="uploadAsset()" :disabled="!isOwner"><i class="fas fa-file-upload"></i></b-btn>
            <b-btn v-if="editor.tab==2"  size="sm" variant="info" v-on:click="updateSetting()" :disabled="!isOwner"><i class="fas fa-cogs"></i></b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

    </b-modal>

    <b-button @click="showModal" ref="btnShow">Open Modal</b-button>
  </div>
  `,
  data: function () {
    return {
      wallet      : null,
      address     : '',
      store       : {address:'',message:'',state:true,about:null},
      editor      : {tab:0,assetFile:null},
      contract    : {message:'',state:true,password:''},
      setting     : {obj:null,json:''},
      avatar      : {tab:[],active:'',assets:[],loaded:false},
      manager     : null,
      price       : {token:'',value:''}
    }
  },
  created: function () {
    avatar.view.loadJson("avatar.json",(err,data)=>{
      this.setting.object = data;
      this.setting.json   = JSON.stringify(data, null, 2);
    }); // todo : load from contract
    this.manager = new avatar.view.web3.eth.Contract(aMgr.manager,aMgr.address);
  },
  computed: {
    isLogedIn: function () {
      return this.wallet&&this.wallet.web3&&this.wallet.isAddress();
    },
    isOwner: function () {
      return this.store.about!=null&&this.wallet&&this.wallet.web3&&this.store.about[0].toLowerCase()==this.wallet.address().toLowerCase();
    },
    link:function () {
      return this.wallet&&this.wallet.web3&&this.wallet.web3.utils.isAddress(this.address)?this.wallet.option['network']['href']+"/address/"+this.address:'#';
    },
    height:function () {
      return this.$refs.height?this.$refs.height.clientHeight:235;
    }
  },
  methods: {
    isAddress (address) {
      return avatar.view.web3.utils.isAddress(address)&&address!='0x0000000000000000000000000000000000000000';
    },
    showModal () {
      this.store.state      = true;
      this.store.message    = '';
      this.store.address    = '';
      this.store.about      = null;
      this.editor.tab       = 0;
      this.editor.assetFile = null;
      this.contract.message = '';
      this.contract.state   = true;
      this.contract.password= '';
      this.address          = '';
      this.avatar.loaded    = false;
      this.price.token      = '';
      this.price.value      = '';
      document.getElementById('avatarEditor').innerHTML = '';
      avatar.view.load('avatarEditor',this.wallet.address(),(address)=>{this.store.address=address;this.loadStore();});
      this.$refs.refModalEditor.show();
    },
    loadStore(){
      this.avatar.loaded  = false;
      if(this.store.address==''||!this.isAddress(this.store.address)) {
        this.store.state    = false;
        this.store.message  = "this is not address."
        this.store.about    = null;
        this.editor.tab     = 0;
        this.address        = '';
      } else {
        this.store.state    = true;
        this.store.message  = ""
        this.store.about    = null;
        this.editor.tab     = 0;
        this.address        = '';

        this.manager.methods.about(this.store.address).call((e,r)=>{
          if(!e&&this.isAddress(r[0])) {
            this.store.about  = r;
            this.address      = this.store.address;
            this.price.token  = this.isAddress(r[1])?r[1]:'Eth';
            this.price.value  = avatar.view.web3.utils.fromWei(r[2].toString(),'ether');

            if(this.setting.object.address.toLowerCase()==this.address) {
              this.avatar.tab     =this.setting.object.category;
              this.avatar.active  = this.avatar.tab[0].cat.toString();
              for(let i = 0 ; i < this.setting.object.category.length ; i++) {
                this.avatar.assets[this.setting.object.category[i]['cat'].toString()] = [];
                avatar.view.list(this.store.address,this.setting.object.category[i]['cat'],
                  (cat,list)=>{
                    this.avatar.assets[cat.toString()] = this._removeDisabled(list,this.setting.object.disabled);
                    this.avatar.loaded = true;
                  }
                );
              }
            } else {
              this.avatar.active                    = '-1';
              this.avatar.assets[this.avatar.active]= [];
              avatar.view.list(this.store.address,-1,
                (cat,list)=>{
                  this.avatar.assets[cat.toString()]  = this._removeDisabled(list,this.setting.object.disabled);
                  this.avatar.loaded = true;
                }
              );
            }

            if(this.wallet&&this.wallet.web3&&this.wallet.isAddress()&&r[0].toLowerCase()==this.wallet.address().toLowerCase())
              this.store.message  = "you are store owner";
          }
        });
      }
    },
    _removeDisabled(array,disabled) {
      for(let i = 0 ; i < disabled.length ; i++) {
        let index = array.findIndex((obj)=>{return obj.index==disabled[i];});
        if (index > -1) array.splice(index, 1);
      }
      return array;
    },
    loadAsset(files){
      let fr = new FileReader();
      let that = this;
       fr.onload = function(){
         that.editor.assetFile    = fr.result;
         that.$refs.assetView.src = fr.result;
       }
       fr.readAsDataURL(files[0]);
    },
    select(index) {
      console.log(index);
    },
    uploadAvatar(){
      this.store.address  = this.address;
      if(this.isAddress(this.store.address)) {
        this.store.state        = true;
        this.store.message      = ""
        this.store.about        = null;

        this.manager.methods.about(this.store.address).call((e,r)=>{
          if(!e&&this.isAddress(r[0])) {
            this.store.about    = r;

            if(this.wallet&&this.wallet.web3&&this.wallet.isAddress()) {
                // todo : upload avatar
            }
          }
        });
      }
    },
    uploadAsset(){
      this.store.address  = this.address;
      if(this.isAddress(this.store.address)) {
        this.store.state        = true;
        this.store.message      = ""
        this.store.about        = null;

        this.manager.methods.about(this.store.address).call((e,r)=>{
          if(!e&&this.isAddress(r[0])) {
            this.store.about    = r;

            if(this.wallet&&this.wallet.web3&&this.wallet.isAddress()&&this.store.about[0].toLowerCase()==this.wallet.address().toLowerCase()) {
                // todo : upload asset
            }
          }
        });
      }
    },
    updateSetting() {

    }
  }
}

Vue.component('editor', editor);

module.exports = new Vue({
  el: '#editor'
});
module.exports.view   = avatar.view;
//module.exports.editor = editor;
