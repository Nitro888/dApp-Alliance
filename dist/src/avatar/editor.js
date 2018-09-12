var slider  = require('vue-color/src/components/Slider.vue');
let avatar  = require('./view.js');
const aMgr  = require('../abi/avatar.js');

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
          <div v-show="editor.tab==0" ref="height0" style="width:100%;padding-top:100%;position:relative;background-color:gray;">
            <div id="avatarEditor" style="position:absolute;width:100%;height:100%;top:0%;left:0%;"/>
          </div>
          <div v-if="editor.tab==1" style="width:100%;padding-top:100%;position:relative;overflow:hidden;background-color:gray;">
            <img ref="assetView" src="" style="position:absolute;width:100%;height:auto;top:0%;left:0%;"/>
          </div>
        </b-col>

        <b-col lg="8">
          <b-nav v-show="editor.tab==0&&avatar.tab.length>0" ref="height1" pills justified tabs v-on:change="matchHeight();">
            <b-nav-item v-for='item in avatar.tab' v-bind:item="item" v-bind:key="item.value" :active="avatar.active==item.value.toString()" v-on:click="avatar.active=item.value.toString();">{{item.text}}</b-nav-item>
          </b-nav>
          <div v-show="editor.tab==0" v-bind:style="{width:'100%',height:height1+'px','background-color':'gray'}">
            <slider-picker v-for='color in avatar.tab' v-bind:key="color.value" v-show="avatar.active==color.value.toString()" v-model="color.colors" style="width:100%" @input="pickColor"/>
            <b-row v-show="avatar.loaded" style="width:100%;height:100%;overflow-y:scroll;">
              <b-col lg="3" v-for='item in avatar.assets[avatar.active]' v-bind:item="item" v-bind:key="item.index">
                <img :src="item.img" style="width:100%;height:auto;overflow:hidden;" v-on:mouseover="mouseOver(item.index)" v-on:click="select(item.index);"/>
              </b-col>
            </b-row>
          </div>

          <div v-if="editor.tab==1">
            <b-form-select v-model="editor.selected" :options="this.avatar.tab" class="mb-3" size="sm" />
            <b-form-file size="sm" placeholder="Choose a file..." v-on:change="loadAsset($event.target.files);" accept="image/*"></b-form-file>
          </div>
        </b-col>
      </b-row>

      <div v-show="editor.tab==2" v-bind:style="{ width:'100%',height:height0+'px','overflow-y':'scroll'}">
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
  </div>
  `,
  data: function () {
    return {
      wallet      : null,
      address     : '',
      height0     : 235,
      height1     : 235,
      store       : {address:'',message:'',state:true,about:null},
      editor      : {tab:0,selected:null,assetFile:null},
      contract    : {message:'',state:true,password:''},
      setting     : {default:{"category":[{"value":0,"text":"body"},{"value":1,"text":"cloth"},
                                          {"value":2,"text":"face"},{"value":3,"text":"nose"},{"value":4,"text":"tatoo"},
                                          {"value":5,"text":"eye"},{"value":6,"text":"eyebrow"},{"value":7,"text":"mouth"},
                                          {"value":8,"text":"hair"},{"value":9,"text":"mustache"},{"value":10,"text":"accessories"}],"disabled":[]},
                    json:''},
      avatar      : {tab:[],active:'',assets:[],loaded:false,json:null,layer:[]},
      manager     : null,
      price       : {token:'',value:'',erc20:'',price:''}
    }
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
    }
  },
  created: function () {
    this.manager        = new avatar.view.web3.eth.Contract(aMgr.manager,aMgr.address);
  },
  updated: function () {
    this.$nextTick(function () {
      this.matchHeight();
    });
  },
  methods: {
    isAddress (address) {
      return avatar.view.web3.utils.isAddress(address)&&address!='0x0000000000000000000000000000000000000000';
    },
    showModal (address) {
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
      this.avatar.layer     = [];
      document.getElementById('avatarEditor').innerHTML = '';
      this.store.address    = address;
      avatar.view.load('avatarEditor',this.wallet.address(),()=>{this.loadStore();this.$refs.refModalEditor.show();},(store)=>{this.store.address=store;this.loadStore();this.$refs.refModalEditor.show();});
    },
    matchHeight() {
      this.height0  = this.$refs.height0&&this.$refs.height0.clientHeight>0?this.$refs.height0.clientHeight:235;
      this.height1  = this.height0-(this.$refs.height1?this.$refs.height1.clientHeight:0);
    },
    loadStore(){
      this.avatar.loaded  = false;
      if(this.store.address==''||!this.isAddress(this.store.address)) {
        this.store.state    = false;
        this.store.message  = "this is not store address."
        this.store.about    = null;
        this.editor.tab     = 0;
        this.address        = '';
        this.avatar.tab     = [];
      } else {
        this.store.state    = true;
        this.store.message  = ""
        this.store.about    = null;
        this.editor.tab     = 0;
        this.address        = '';

        this.manager.methods.about(this.store.address).call((e,r)=>{
          if(!e&&this.isAddress(r[0])&&r[1]) {
            this.store.about  = r;
            this.address      = this.store.address;
            this.price.erc20  = r[2];
            this.price.amount = r[3];
            this.price.token  = this.isAddress(this.price.erc20)?this.price.erc20:'Eth';
            this.price.value  = avatar.view.web3.utils.fromWei(this.price.amount.toString(),'ether');

            avatar.view.setting(this.address,(data)=>{

              data              = data?msgpack.decode(data):null;
              this.avatar.tab   = data&&data.category?data.category:this.setting.default.category;
              this.avatar.active= this.avatar.tab[0].value.toString();
              this.setting.json = JSON.stringify(data?data:this.setting.default, null, 2);

              for(let i = 0 ; i < this.avatar.tab.length ; i++) {
                this.avatar.assets[this.avatar.tab[i]['value'].toString()] = [];
                this.avatar.tab[i]['colors'] = '#ffffff';
                avatar.view.list(this.store.address,this.avatar.tab[i]['value'],
                  (cat,list)=>{
                    this.avatar.assets[cat.toString()] = this._removeDisabled(list,data&&data.disabled?data.disabled:[]);
                    this.avatar.loaded = true;
                  }
                );
              }
            });

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
    mouseOver(index) {
      //console.log(index);
    },
    select(index) {
      let asset = this.avatar.layer.findIndex((obj)=>{return obj.layer==this.avatar.active;});
      if (asset > -1) this.avatar.layer.splice(asset, 1);

      this.avatar.layer.push({layer:this.avatar.active,index:index});
      this.avatar.layer.sort(function(a, b){return parseInt(a.layer)-parseInt(b.layer)});

      this.avatar.json = {imgs:[]};
      for(let i=0 ; i < this.avatar.layer.length ; i++)
        this.avatar.json.imgs.push({id:this.avatar.layer[i].index,p:{x:0,y:0},g:this.avatar.active,c:''});
      avatar.view.draw('avatarEditor',this.wallet.address(),this.address,this.avatar.json);
    },
    pickColor(value) {
      let index = this.avatar.layer.findIndex((obj)=>{return obj.layer==this.avatar.active;});
      if (index > -1) {
          this.avatar.json.imgs[index].c=value.hex;
          avatar.view.draw('avatarEditor',this.wallet.address(),this.address,this.avatar.json);
      }
    },
    uploadAvatar(){
      this.store.address  = this.address;
      if(this.isAddress(this.store.address)&&this.avatar.json) {
        this.contract.state     = true;
        this.contract.message   = "";
        let data  = this.manager.methods.avatar(this.store.address,this.wallet.web3.utils.bytesToHex(msgpack.encode(this.avatar.json))).encodeABI();
        if(this.isAddress(this.price.erc20)) {
          // todo
        } else
          this.wallet.sendTx(aMgr.address,this.contract.password,this.price.amount,data,(e)=>{this.contract.state=false;this.contract.message=e;},(h)=>{this.contract.state=true;this.contract.message="Tx:"+h;},(r)=>{this.contract.state=true;this.contract.message="Success";});
      }
    },
    uploadAsset(){
      this.store.address  = this.address;
      if(this.isAddress(this.store.address)&&this.editor.assetFile) {
        this.contract.state     = true;
        this.contract.message   = "";
        let temp  = new this.wallet.web3.eth.Contract(aMgr.avatar,this.address);
        let data  = temp.methods.asset(this.editor.selected,this.wallet.web3.utils.utf8ToHex(this.editor.assetFile)).encodeABI();
        this.wallet.sendTx(this.store.address,this.contract.password,0,data,(e)=>{this.contract.state=false;this.contract.message=e;},(h)=>{this.contract.state=true;this.contract.message="Tx:"+h;},(r)=>{this.contract.state=true;this.contract.message="Success";});
      }
    },
    updateSetting() {
      this.store.address  = this.address;

      // todo :
    }
  }
}

Vue.component('editor', editor);
Vue.component('slider-picker', slider.default);

module.exports = new Vue({el: '#editor'});
module.exports.view   = avatar.view;
//module.exports.editor = editor;
