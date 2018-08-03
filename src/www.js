let navbar  = require('./navbar.js');

const aMgr  = require('./abi/avatar20/manager.js');
navbar.wallet.pushContract(aMgr.abi,aMgr.address);

const sMgr  = require('./abi/store/manager.js');
navbar.wallet.pushContract(sMgr.abi,sMgr.address);

//console.log(aMgr.abi);
//console.log(sMgr.abi);

let main = {
  template: `
  <div>
      <b-carousel style="text-shadow: 1px 1px 2px #333;"
                  controls
                  indicators
                  background="#ababab"
                  :interval="10000"
                  img-width="1280"
                  img-height="480"
                  v-model="slide"
                  @sliding-start="onSlideStart"
                  @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide caption="Avatar"
                          text="Create your wallet avatar."
                          img-src="./avatar.jpg"
        ></b-carousel-slide>
        <b-carousel-slide caption="Store"
                          text="Create your own stroe for digital contents."
                          img-src="./books.jpg"
        ></b-carousel-slide>
        <b-carousel-slide caption="Casino"
                          text="Create your own casino and play."
                          img-src="./casino.jpg"
        ></b-carousel-slide>
      </b-carousel>

      <b-modal ref="refModal" :size="modal.size" :title="modal.title" :header-bg-variant="modal.headerBg" :header-text-variant="modal.headerTxt" hide-footer>
        <div class="d-block text-center" v-html="modal.html"></div>
        <b-input-group v-for='item in modal.items' v-bind:item="item" v-bind:key="item.store" size="sm" class="mb-1">
          <b-form-input :value="item.key" readonly></b-form-input>
          <b-input-group-append>
            <b-btn size="sm" variant="outline-primary" target="_blank" :href="item.actions.link"><i class="fas fa-link"></i></b-btn>
            <b-btn size="sm" variant="outline-primary" v-on:click="item.actions.contract(item.key);"><i class="fas fa-info"></i></b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-modal>

      <b-modal ref="refModalContract" :title="contract.title" header-bg-variant="dark" header-text-variant="light" hide-footer>

        <b-nav pills justified tabs>
          <b-nav-item :active="contract.tab==0" :disabled="contract.address!=''||!isLogedIn" v-on:click="contract.tab=0;"><i class="fas fa-plus"></i></b-nav-item>
          <b-nav-item :active="contract.tab==1" :disabled="contract.address==''||!isLogedIn" v-on:click="contract.tab=1;"><i class="fas fa-exchange-alt"></i></b-nav-item>
          <b-nav-item :active="contract.tab==2" :disabled="contract.address==''||!isLogedIn||!isPack" v-on:click="contract.tab=2;"><i class="fas fa-store"></i></b-nav-item>
          <b-nav-item :active="contract.tab==3" :disabled="contract.address==''||!isLogedIn||isStore||isCreator" v-on:click="contract.tab=3;"><i class="fas fa-file-invoice-dollar"></i></b-nav-item>
          <b-nav-item :active="contract.tab==4" :disabled="contract.address==''||!isLogedIn" v-on:click="contract.tab=4;"><i class="fas fa-file-signature"></i></b-nav-item>
          <b-nav-item :active="contract.tab==5" :disabled="contract.address==''" v-on:click="contract.tab=5;"><i class="fas fa-info"></i></b-nav-item>
        </b-nav>

        <b-form-group size="sm" label="Contract" v-if="this.contract.address!=''">
          <b-input-group size="sm">
            <b-form-input size="sm" type="text" v-model="contract.address" readonly></b-form-input>
            <b-input-group-append>
              <b-btn size="sm" variant="info" target="_blank" :href="contract.link"><i class="fas fa-link"></i></b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group size="sm" label="Owner" label-for="owner" invalid-feedback="This is a wrong address." :state="isAddressOwner" v-if="contract.tab!=0">
          <b-form-input size="sm" type="text" id="owner" placeholder="address of contract owner" v-model="data.owner" :readonly="contract.tab!=1"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Store" label-for="store" invalid-feedback="This is a wrong address." :state="isAddressStore" v-if="isPack">
          <b-form-input size="sm" type="text" id="store" placeholder="address of pack store" v-model="data.store" :readonly="contract.tab!=2"></b-form-input>
        </b-form-group>

        <b-form-group size="sm" label="Name" label-for="name">
          <b-form-input size="sm" id="name" placeholder="enter name" v-model="json.title" :readonly="!(contract.tab==0||contract.tab==4)"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Description" label-for="desc">
          <b-form-textarea size="sm" id="desc" placeholder="enter description" v-model="json.desc" :readonly="!(contract.tab==0||contract.tab==4)"></b-form-textarea>
        </b-form-group>

        <b-form-group size="sm" label="Token Address" label-for="token" invalid-feedback="This is a wrong address." :state="isAddressErc20" v-if="showErc20">
          <b-form-input size="sm" type="text" id="token" placeholder="erc20 token address or '0x0' for ethereum" v-model="data.erc20" :readonly="contract.tab!=0"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Price" label-for="price" v-if="showPrice">
          <b-form-input size="sm" type="number" id="price" placeholder="price of avatar making" v-model="data.price" :readonly="!(contract.tab==0||contract.tab==3)"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Share" label-for="share" v-if="showShare">
          <b-form-input size="sm" type="number" id="share" placeholder="share with store and creator (0%~100%)" v-model="data.share" :readonly="!(contract.tab==0||contract.tab==3)"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Share Start" label-for="shareStart" v-if="showShareStart">
          <b-form-input size="sm" type="number" id="shareStart" placeholder="share start income" v-model="data.shareStart" :readonly="!(contract.tab==0||contract.tab==3)"></b-form-input>
        </b-form-group>

        <b-btn size="sm" v-b-toggle.communities variant="outline-primary" class="mt-4" block>Communities</b-btn>
        <b-collapse id="communities" v-model="contract.communities">
          <b-card>
            <b-input-group v-for='item in communities' v-bind:key="item.name" size="sm" :prepend='item.icon' class="mb-2">
              <b-form-input :placeholder="item.placeholder" v-model="json[item.name]" :readonly="!(contract.tab==0||contract.tab==4)"></b-form-input>
            </b-input-group>
          </b-card>
        </b-collapse>

        <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="contract.message" :valid-feedback="contract.message" :state="contract.state" v-if="isLogedIn">
          <b-input-group size="sm">
            <b-form-input size="sm" type="password" placeholder="password" v-model="contract.password" :readonly="contract.tab==5"></b-form-input>
            <b-input-group-append>
              <b-btn size="sm" variant="info" v-on:click="_confirmContract()" :disabled="contract.tab==5"><i class="fas fa-handshake"></i></b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-modal>

      <b-container>
        <br/>
        <contents v-for="content in contents" v-bind:content="content" v-bind:key="content.title"></contents>
      </b-container>
      <b-container>
        <hr/>
        <p>Copyright &copy; nitro888.com</p>
      </b-container>
    </div>
    `,
    data () {
      return {
        slide: 0,
        sliding: null,

        modal:{title:'',size:'md',headerBg:'',headerTxt:'',html:'',items:[]},

        wallet:navbar.wallet,
         // tab 0 = create, 1 = owner, 2 = store, 3 = price, 4 = desc, 5 = readonly
        contract:{title:'',state:true,message:'',password:'',communities:false,address:'',link:'#',key:'',tab:0},
        communities:[
          {icon:'<i class="fas fa-at"></i>',name:'e-mail',placeholder:'e-mail'},
          {icon:'<i class="fab fa-facebook-f"></i>',name:'facebook',placeholder:'facebook id'},
          {icon:'<i class="fab fa-twitter"></i>',name:'twitter',placeholder:'twitter id'},
          {icon:'<i class="fab fa-instagram"></i>',name:'instagram',placeholder:'instagram id'},
          {icon:'<i class="fab fa-twitch"></i>',name:'twitch',placeholder:'twitch id'},
          {icon:'<i class="fab fa-reddit-alien"></i>',name:'reddit',placeholder:'reddit id'},
          {icon:'<i class="fab fa-telegram-plane"></i>',name:'telegram',placeholder:'telegram id'},
          {icon:'<i class="fab fa-discord"></i>',name:'discord',placeholder:'discord id'},
          {icon:'<i class="fab fa-slack-hash"></i>',name:'slack',placeholder:'slack id'},
          {icon:'<i class="fab fa-youtube"></i>',name:'youtube',placeholder:'youtube id'},
          {icon:'<i class="fas fa-comment-alt"></i>',name:'disqus',placeholder:'disqus id'},
        ],

        json:{title:'',desc:''},
        data:{owner:'',store:'',erc20:'',price:'',shareStart:'',share:''},

        contents:[
          {left:false,title:"WALLET",image:'c0.jpg',
            inputs:[
              { input:false,key:'wallet',
                title:'How to get a wallet.',
                desc:'If you want to create a wallet, click <i class="far fa-plus-square"></i> icon at menu bar and input passwords and click create button.'}]
          },
          {left:true,title:"AVATAR",image:'c1.jpg',
            inputs:[
              { input:true,key:'avatar',
                title:'How to get your avatar store.',
                desc:'If you want to create a avatar store, create wallet and login first.<br/>After login, click <i class="fas fa-plus"></i> button, and write store name, ERC20 contract address or \'0x0\' for Ethereum, and set price of making avatar. You can also change the price of making avatar after creation.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:false,title:"STORE",image:'c2.jpg',
            inputs:[
              { input:true,key:'store',
                title:'How to get your digital contents store.',
                desc:'After login, click <i class="fas fa-plus"></i> button, and write store name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'},
              { input:true,key:'pack',
                title:'How to create digital contents pack at store.',
                desc:'After login, click <i class="fas fa-plus"></i> button, and write pack name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:true,title:"CREATOR",image:'c3.jpg',
            inputs:[
              { input:true,key:'creator',
                title:'How to get contents creator account.',
                desc:'After login, click <i class="fas fa-plus"></i> button, and write store name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:false,title:"TICKET",image:'c4.jpg',
            inputs:[
              { input:false,key:'ticket',
                title:'Create ticket booth for yours.',
                desc:'Coming soon.'}]},
          {left:true,title:"CASINO",image:'c5.jpg',
            inputs:[
              { input:false,key:'casino',
                title:'Create your own casino and play.',
                desc:'Coming soon.'}]},
        ]
      }
    },
    computed: {
      isLogedIn: function () {
        return this.wallet.web3&&this.wallet.isAddress();
      },
      isAddressOwner: function () {
        return this.data.owner==''||this.wallet.web3.utils.isAddress(this.data.owner);
      },
      isAddressStore: function () {
        return this.data.store==''||this.wallet.web3.utils.isAddress(this.data.store);
      },
      isAddressErc20: function () {
        return this.data.erc20==''||this.wallet.web3.utils.isAddress(this.data.erc20);
      },
      isStore : function () {
        return this.contract.key=='store';
      },
      isPack : function () {
        return this.contract.key=='pack';
      },
      isCreator : function () {
        return this.contract.key=='creator';
      },
      showErc20 : function () {
        return this.contract.key=='avatar'||this.contract.key=='store';
      },
      showPrice : function () {
        return this.contract.key=='avatar';
      },
      showShare : function () {
        return this.contract.key=='pack';
      },
      showShareStart : function () {
        return this.contract.key=='pack';
      },
    },
    methods: {
      //------------------------------------------------------------------------------------------------
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      },
      //------------------------------------------------------------------------------------------------
      showModal(title,size,header,html) {
        this.modal.title          = title;
        this.modal.size           = size;
        this.modal.headerBg       = header;
        this.modal.headerTxt      = header=='dark'?'light':'dark';
        this.modal.html           = html;
        this.modal.items          = [];
        this.$refs.refModal.show();
      },
      updateModal(html,items) {
        this.modal.html           = html;
        this.modal.items          = items;
      },
      //------------------------------------------------------------------------------------------------
      _resetData() {
        for (let field in this.json)
          this.json[field] = '';
        for (let field in this.data)
          this.data[field] = '';
      },
      _json(obj)       {
        let json = {};
        for (var key in obj)
          if(obj[key]!='')
            json[key] = obj[key];
        return json;
      },
      _searchOwner(contract,callback){
        let myAddress = this.wallet.web3.utils.padLeft(this.wallet.address(),64);
        let topics    = 'topic0='+contract.topic0+'&topic2='+myAddress+'&topic3='+myAddress+'&topic2_3_opr=or';
        this.wallet.logs(contract.address,topics,(data)=>{
          let list = [];
          for(let i = 0 ; i < data.length ; i++) {
            let address = '0x'+data[i].topics[1].toString().slice(-40).toLowerCase();
            let owner   = '0x'+data[i].topics[2].toString().slice(-40).toLowerCase();
            let from    = '0x'+data[i].topics[3].toString().slice(-40).toLowerCase();

            if(owner==this.wallet.address().toLowerCase())
              list.push({ key:address, owner:owner, from:from,
                          actions:{ link:this.wallet.option['network']['href']+"/address/"+address,
                                    contract:(address)=>{this.showContract(contract.key,address);}
                                  }});
            else {
              let index = list.findIndex(x=>x.store==store);
              if(index>-1)
                list.splice(index,1);
            }
          }
          callback(list);
        });
      },
      _confirmContract() {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          let isCreate  = this.contract.tab==0; // 0 = create, 1 = owner, 2 = store, 3 = price, 4 = desc, 5 = readonly
          let contract  = this.contract.key;    // avatar,store,pack,creator
          let password  = this.contract.password;
          let json      = this._json(this.json);
          let data      = this._json(this.data);

          // todo : create & edit


          console.log(this.contract);
          console.log(json);
          console.log(data);
        }
      },
      _sendTx(address,password,value,data) {
        if(data!=null)
          this.wallet.sendTx(address,password,value,data,(e)=>{this.common.state=false;this.common.message=e;},(h)=>{this.common.state=true;this.common.message="Tx:"+h;},(r)=>{this.common.state=true;this.common.message="Success";});
      },
      //------------------------------------------------------------------------------------------------
      showContractList(key) {
        this.showModal("List of your "+key,"md",'dark','now loading...');
        let contract = {address:'',topic0:'',key:key};
        switch (key) {
          case 'avatar':
            contract  = {address:aMgr.address,topic0:aMgr.abi[11]['signature'],key:key};
            break;
          case 'store':
            contract  = {address:sMgr.address,topic0:sMgr.abi[7]['signature'],key:key};
            break;
          case 'pack':
            //contract  = {address:sMgr.address,topic0:sMgr.abi[7]['signature'],key:key}; // todo
            break;
          case 'creator':
            contract  = {address:sMgr.address,topic0:sMgr.abi[6]['signature'],key:key};
            break;
        }
        if(contract.address!='')
          this._searchOwner(contract,(list)=>{this.updateModal(list.length==0?'Empty':'',list);});
      },
      //------------------------------------------------------------------------------------------------
      showContract(key,address,error=null,success=null) {
        this.contract.title       = address==''?"Create":"Contract";
        this.contract.address     = address;
        this.contract.link        = this.wallet.web3.utils.isAddress(address)?this.wallet.option['network']['href']+"/address/"+address:'#';
        this.contract.communities = false;
        this.contract.tab         = this.wallet.web3&&this.wallet.isAddress()?(address==''?0:5):5;
        this.contract.key         = key;
        this.contract.state       = true;
        this.contract.message     = '';
        this.contract.password    = '';

        this._resetData();

        this.$refs.refModalContract.show();
      },
      //------------------------------------------------------------------------------------------------
    }
}

Vue.component('content-sub',{
  props: ['sub'],
    template:`<div>
                <h5>{{sub.title}}</h5>
                <p><span v-html="sub.desc"></span></p>
                <b-form-group size="sm" v-if="sub.input" invalid-feedback="This is a wrong address." :state="isAddress" class="mb-3">
                  <b-input-group size="sm">
                    <b-input-group-prepend>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="create()"><i class="fas fa-plus"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="list()"><i class="fas fa-list-ul"></i></b-btn>
                    </b-input-group-prepend>
                    <b-form-input type="text" placeholder="contract adress" v-model="address"></b-form-input>
                    <b-input-group-append>
                      <b-btn size="sm" variant="outline-primary" v-on:click="contract()"><i class="fas fa-info"></i></b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </div>`,
    data () {
      return {
          wallet:navbar.wallet,
          address:''
      }
    },
    computed: {
      isLogedIn: function () {
        return this.wallet.web3&&this.wallet.isAddress();
      },
      isAddress: function () {
        return this.address==''||this.wallet.web3.utils.isAddress(this.address);
      },
    },
    methods: {
      list() {
        if(this.wallet.web3&&this.wallet.isAddress())
          app.$children[0].showContractList(this.sub.key);
      },
      create(address='') {
        this.address  = "";
        app.$children[0].showContract(this.sub.key,address,(r)=>{this.state=false;this.message=r;},(r)=>{this.state=true;this.message=r;});
      },
      contract() {
        if(this.wallet.web3.utils.isAddress(this.address))
          this.create(this.address);
      }
    }
});

Vue.component('contents',{
  props: ['content'],
  template:`<div>
              <hr/>
              <b-row>
                <b-col lg="7" v-if="content.left">
                  <h2>{{content.title}}&nbsp<h6 style="display: inline-block;">
                    <a v-if="scan!=null" :href="scan" target="_blank"><i class="fas fa-link"></i></a>
                    <a v-if="git!=null" :href="git" target="_blank"><i class="fab fa-github"></i></a>
                  </h6></h2>
                  <content-sub v-for="item in content.inputs" v-bind:sub="item" v-bind:key="item.key"></content-sub>
                </b-col>
                <b-col lg="5">
                  <b-img fluid :src="content.image" border-variant="light"/>
                </b-col>
                <b-col lg="7" v-if="!content.left">
                  <h2>{{content.title}}&nbsp<h6 style="display: inline-block;">
                    <a v-if="scan!=null" :href="scan" target="_blank"><i class="fas fa-link"></i></a>
                    <a v-if="git!=null" :href="git" target="_blank"><i class="fab fa-github"></i></a>
                  </h6></h2>
                  <content-sub v-for="item in content.inputs" v-bind:sub="item" v-bind:key="item.key"></content-sub>
                </b-col>
              </b-row>
            </div>`,
  data () {
    return {
      wallet:navbar.wallet,
      address: {
        AVATAR:aMgr.address,
        STORE:sMgr.address,
        CREATOR:sMgr.address,
      },
      github:{
        WALLET:'https://github.com/Nitro888/wallet.nitro888.com',
        AVATAR:'https://github.com/Nitro888/avatar.nitro888.com',
        STORE:'https://github.com/Nitro888/toonist.nitro888.com',
        CREATOR:'https://github.com/Nitro888/toonist.nitro888.com',
      }
    }
  },
  computed: {
    scan: function () {
      return this.wallet.web3&&this.address[this.content.title]?this.wallet.option['network']['href']+"/address/"+this.address[this.content.title]:null;
    },
    git: function () {
      return this.github[this.content.title]?this.github[this.content.title]:null;
    }
  },
});

Vue.component('mainvue', main);

let app = new Vue({
  el: '#mainvue'
});
