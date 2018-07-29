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
        <store-item v-for="item in modal.items" v-bind:item="item" v-bind:key="item.store"></store-item>
      </b-modal>
      <b-modal ref="refModalContract" :title="contract.title" header-bg-variant="dark" header-text-variant="light" hide-footer>
        <b-form-group size="sm" label="Contract" v-if="contract.mode!=0">
          <b-input-group size="sm">
            <b-form-input size="sm" type="text" v-model="contract.address" readonly></b-form-input>
            <b-input-group-append>
              <b-btn size="sm" variant="info" target="_blank" :href="contract.link"><i class="fas fa-link"></i></b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group size="sm" label="Name" label-for="name">
          <b-form-input size="sm" id="name" placeholder="enter name" v-model="json.title" :readonly="contract.mode>1||!isLogedIn"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Description" label-for="desc">
          <b-form-textarea size="sm" id="desc" placeholder="enter description" v-model="json.desc" :readonly="contract.mode>1||!isLogedIn"></b-form-textarea>
        </b-form-group>

        <b-form-group size="sm" label="Token Address" label-for="token" v-if="data.erc20.show">
          <b-form-input size="sm" type="text" id="token" placeholder="erc20 token address or '0x0' for ethereum" v-model="data.erc20.value" :readonly="contract.mode!=0||!isLogedIn"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Price" label-for="price" v-if="data.price.show">
          <b-form-input size="sm" type="number" id="price" placeholder="price of avatar making" v-model="data.price.value" :readonly="contract.mode==1||contract.mode==3||!isLogedIn"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Share" label-for="share" v-if="data.share.show">
          <b-form-input size="sm" type="number" id="share" placeholder="share with store and creator (0%~100%)" v-model="data.share.value" :readonly="contract.mode==1||contract.mode==3||!isLogedIn"></b-form-input>
        </b-form-group>
        <b-form-group size="sm" label="Share Start" label-for="shareStart" v-if="data.shareStart.show">
          <b-form-input size="sm" type="number" id="shareStart" placeholder="share start income" v-model="data.shareStart.value" :readonly="contract.mode==1||contract.mode==3||!isLogedIn"></b-form-input>
        </b-form-group>

        <b-btn size="sm" v-b-toggle.communities variant="outline-primary" class="mt-4" block>Communities</b-btn>
        <b-collapse id="communities" v-model="contract.communities">
          <b-card>
            <b-input-group v-for='item in communities' v-bind:key="item.name" size="sm" :prepend='item.icon' class="mb-2">
              <b-form-input :placeholder="item.placeholder" v-model="json[item.name]" :readonly="contract.mode>1||!isLogedIn"></b-form-input>
            </b-input-group>
          </b-card>
        </b-collapse>

        <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="contract.message" :valid-feedback="contract.message" :state="contract.state" v-if="isShow">
          <b-input-group size="sm">
            <b-form-input size="sm" type="password" placeholder="password" v-model="contract.password"></b-form-input>
            <b-input-group-append>
              <b-btn size="sm" variant="info" v-on:click="_createCreator()" :disabled="contract.mode==3"><i class="fas fa-handshake"></i></b-btn>
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
        contract:{title:'',state:true,message:'',password:'',communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        communities:[
          {icon:'<i class="fas fa-at"></i>',name:'e-mail',placeholder:''},
          {icon:'<i class="fab fa-facebook-f"></i>',name:'facebook',placeholder:''},
        ],

        json:{title:'',desc:''},
        data:{erc20:{show:true,value:''},price:{show:true,value:''},shareStart:{show:true,value:''},share:{show:true,value:''}},

        contents:[
          {left:false,title:"WALLET",image:'c0.jpg',
            inputs:[
              {input:false,key:'wallet',title:'How to get a wallet.',desc:'If you want to create a wallet, click <i class="far fa-plus-square"></i> icon at menu bar and input passwords and click create button.'}]
          },
          {left:true,title:"AVATAR",image:'c1.jpg',
            inputs:[
              {input:true,key:'avatar store',title:'How to get your avatar store.',desc:'If you want to create a avatar store, create wallet and login first.<br/>After login, click <i class="fas fa-plus"></i> button, and write store name, ERC20 contract address or \'0x0\' for Ethereum, and set price of making avatar. You can also change the price of making avatar after creation.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:false,title:"STORE",image:'c2.jpg',
            inputs:[
              {input:true,key:'store',title:'How to get your digital contents store.',desc:'After login, click <i class="fas fa-plus"></i> button, and write store name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'},
              {input:true,key:'pack',title:'How to create digital contents pack at store.',desc:'After login, click <i class="fas fa-plus"></i> button, and write pack name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:true,title:"CREATOR",image:'c3.jpg',
            inputs:[
              {input:true,key:'creator',title:'How to get contents creator account.',desc:'After login, click <i class="fas fa-plus"></i> button, and write store name and etc.<br/>And input a password and click <i class="fas fa-handshake"></i> button.'}]
          },
          {left:false,title:"TICKET",image:'c4.jpg',inputs:[{input:false,key:'ticket',title:'Create ticket booth for yours.',desc:'Coming soon.'}]},
          {left:true,title:"CASINO",image:'c5.jpg',inputs:[{input:false,key:'casino',title:'Create your own casino and play.',desc:'Coming soon.'}]},
        ]
      }
    },
    computed: {
      isLogedIn: function () {
        return this.wallet.web3&&this.wallet.isAddress();
      },
      isShow: function () {
        return this.contract.mode!=3&&this.isLogedIn;
      }
    },
    methods: {
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      },
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
      showContractList(key) {
        this.showModal("List of your "+key,"md",'dark','now loading...');
      },
      showContract(title,key,mode,address) {
        this.contract.title       = title;
        this.contract.state       = true;
        this.contract.message     = '';
        this.contract.password    = '';
        this.contract.communities = false;
        this.contract.address     = address;
        this.contract.link        = '#';
        this.contract.mode        = mode;

        for (let field in this.json)
          this.json[field] = '';
        for (let field in this.data) {
          this.data[field].show   = false;
          this.data[field].value  = '';
        }

        switch (key) {
          case 'avatar store':
            this.showContractData(["price"])
            break;
          case 'pack':
            this.showContractData(["share","shareStart"])
            break;
          case 'casino':
            this.showContractData(["price"])
            break;
        }

        this.$refs.refModalContract.show();
      },
      showContractData(show) {
        for(let i = 0 ; i < show.length ; i++ )
          this.data[show[i]].show   = true;
      }
    }
}

Vue.component('content-sub',{
  props: ['sub'],
    template:`<div>
                <h5>{{sub.title}}</h5>
                <p><span v-html="sub.desc"></span></p>
                <b-form-group size="sm" v-if="sub.input" :invalid-feedback="message" :valid-feedback="message" :state="state" class="mb-3">
                  <b-input-group size="sm">
                    <b-input-group-prepend>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="create()"><i class="fas fa-plus"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="list()"><i class="fas fa-list-ul"></i></b-btn>
                    </b-input-group-prepend>
                    <b-form-input type="text" placeholder="contract adress" v-model="address"></b-form-input>
                    <b-input-group-append>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="edit(true)"><i class="fas fa-file-invoice-dollar"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="edit(false)"><i class="fas fa-file-signature"></i></b-btn>
                      <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="about()"><i class="fas fa-info"></i></b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </div>`,
      data () {
        return {
            wallet:navbar.wallet,
            message:'',
            state:true,
            address:''
        }
      },
      computed: {
        isLogedIn: function () {
          return this.wallet.web3&&this.wallet.isAddress();
        }
      },
      methods: {
        loginOK() {
          return this.wallet.web3&&this.wallet.isAddress();
        },
        create() {
          if(this.wallet.web3&&this.wallet.isAddress()) {
            app.$children[0].showContract("Create "+this.sub.key,this.sub.key,0,"");
          }
        },
        list() {
          if(this.wallet.web3&&this.wallet.isAddress()) {
            app.$children[0].showContractList(this.sub.key);
          }
        },
        edit(mode) {
          if(this.wallet.web3&&this.wallet.isAddress()) {
            app.$children[0].showContract("Edit "+this.sub.key,this.sub.key,mode?2:1,this.address);
          }
        },
        about() {
          if(this.wallet.web3.utils.isAddress(this.address)) {
            this.state    = true;
            this.message  = "";
            app.$children[0].showContract("About "+this.sub.key,this.sub.key,3,this.address);
          } else {
            this.state    = false;
            this.message  = "This is a wrong address.";
          }
        },
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

Vue.component('store-item', {
  props: ['item'],
  template: '<b-input-group size="sm" class="mb-1"><b-form-input :value="item.key" readonly></b-form-input><b-input-group-append><b-btn size="sm" :v-if="!item.callback0" v-on:click="item.callback0(item.key);"><i class="fas fa-file-invoice-dollar"></i></b-btn><b-btn size="sm" :v-if="!item.callback1" v-on:click="item.callback1(item.key);"><i class="fas fa-file-signature"></i></b-btn></b-input-group-append></b-input-group>'
});

Vue.component('mainvue', main);

let app = new Vue({
  el: '#mainvue'
});
