let navbar  = require('./navbar.js');

const aMgr  = require('./abi/avatar20/manager.js');
navbar.wallet.pushContract(aMgr.abi,aMgr.address);
/*
const sMgr  = require('./abi/store/manager.js');
navbar.wallet.pushContract(sMgr.abi,sMgr.address);
*/

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

      <!-- modal -->
      <b-modal ref="refModalAvatar" :title="titleAvatar" header-bg-variant="dark" header-text-variant="light" hide-footer>
        <div>
          <b-form-group size="sm" label="Contract" v-if="avatarUI.mode!=0">
            <b-input-group size="sm">
              <b-form-input size="sm" type="text" v-model="avatarUI.address" readonly></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" target="_blank" :href="avatarUI.link"><i class="fas fa-link"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group size="sm" label="Name" label-for="input_nameA">
            <b-form-input size="sm" id="input_nameA" placeholder="name of store" v-model="avatarJson.title" :readonly="avatarUI.mode>1"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Description" label-for="input_descA">
            <b-form-textarea size="sm" id="input_descA" placeholder="enter description" v-model="avatarJson.desc" :readonly="avatarUI.mode>1"></b-form-textarea>
          </b-form-group>
          <b-form-group size="sm" label="Token Address" label-for="input_tokenA">
            <b-form-input size="sm" id="input_tokenA" placeholder="erc20 token address or '0x0' for ethereum" v-model="avatarData.erc20" :readonly="avatarUI.mode!=0"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Price" label-for="input_price">
            <b-form-input size="sm" id="input_price" placeholder="price of avatar making" v-model="avatarData.price" :readonly="avatarUI.mode==1||avatarUI.mode==3"></b-form-input>
          </b-form-group>
          <b-btn size="sm" v-b-toggle.CommunitiesA variant="outline-primary" class="mt-4" block>Communities</b-btn>
          <b-collapse id="CommunitiesA" v-model="avatarUI.communities">
            <b-card>
              <b-input-group size="sm" prepend='<i class="fas fa-at"></i>' class="mb-2">
                <b-form-input placeholder="e-mail" v-model="avatarJson.mail" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-facebook-f"></i>' class="mb-2">
                <b-form-input placeholder="facebook id" v-model="avatarJson.facebook" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitter"></i>' class="mb-2">
                <b-form-input placeholder="twitter id" v-model="avatarJson.twitter" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-instagram"></i>' class="mb-2">
                <b-form-input placeholder="instagram id" v-model="avatarJson.instagram" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitch"></i>' class="mb-2">
                <b-form-input placeholder="twitch id" v-model="avatarJson.twitch" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-reddit-alien"></i>' class="mb-2">
                <b-form-input placeholder="reddit id" v-model="avatarJson.reddit" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-telegram-plane"></i>' class="mb-2">
                <b-form-input placeholder="telegram id" v-model="avatarJson.telegram" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-discord"></i>' class="mb-2">
                <b-form-input placeholder="discord id" v-model="avatarJson.discord" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-slack-hash"></i>' class="mb-2">
                <b-form-input placeholder="slack id" v-model="avatarJson.slack" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-youtube"></i>' class="mb-2">
                <b-form-input placeholder="youtube id" v-model="avatarJson.youtube" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fas fa-comment-alt"></i>' class="mb-2">
                <b-form-input placeholder="disqus id" v-model="avatarJson.disqus" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
            </b-card>
          </b-collapse>
          <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="avatarMessage" :valid-feedback="avatarMessage" :state="avatarState" v-if="avatarUI.mode!=3">
            <b-input-group size="sm">
              <b-form-input size="sm" type="password" placeholder="password" v-model="avatarPW" :readonly="avatarUI.mode==3"></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" v-on:click="_createAvatar()" :disabled="avatarUI.mode==3"><i class="fas fa-handshake"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </b-modal>

      <b-modal ref="refModalStore" :title="titleStore" header-bg-variant="dark" header-text-variant="light" hide-footer>
        <div>
          <b-form-group size="sm" label="Contract" v-if="storeUI.mode!=0">
            <b-input-group size="sm">
              <b-form-input size="sm" type="text" v-model="storeUI.address" readonly></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" target="_blank" :href="storeUI.link"><i class="fas fa-link"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group size="sm" label="Name" label-for="input_nameS">
            <b-form-input size="sm" id="input_nameS" placeholder="name of store" v-model="storeJson.title" :readonly="storeUI.mode>1"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Description" label-for="input_descS">
            <b-form-textarea size="sm" id="input_descS" placeholder="enter description" v-model="storeJson.desc" :readonly="storeUI.mode>1"></b-form-textarea>
          </b-form-group>
          <b-form-group size="sm" label="Token Address" label-for="input_tokenS">
            <b-form-input size="sm" id="input_tokenS" placeholder="erc20 token address or '0x0' for ethereum" v-model="storeData.erc20" :readonly="storeUI.mode!=0"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Share Start (per item)" label-for="input_ShareStart">
            <b-form-input size="sm" id="input_ShareStart" placeholder="start revenue share" v-model="storeData.startshare" :readonly="storeUI.mode==1||storeUI.mode==3"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Share (0%~60%)" label-for="input_Share">
            <b-form-input size="sm" id="input_Share" placeholder="revenue sharing store and creator" append="%" v-model="storeData.share" :readonly="storeUI.mode==1||storeUI.mode==3"></b-form-input>
          </b-form-group>
          <b-btn size="sm" v-b-toggle.CommunitiesS variant="outline-primary" class="mt-4" block>Communities</b-btn>
          <b-collapse id="CommunitiesS" v-model="storeUI.communities">
            <b-card>
              <b-input-group size="sm" prepend='<i class="fas fa-at"></i>' class="mb-2">
                <b-form-input placeholder="e-mail" v-model="storeJson.mail" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-facebook-f"></i>' class="mb-2">
                <b-form-input placeholder="facebook id" v-model="storeJson.facebook" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitter"></i>' class="mb-2">
                <b-form-input placeholder="twitter id" v-model="storeJson.twitter" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-instagram"></i>' class="mb-2">
                <b-form-input placeholder="instagram id" v-model="storeJson.instagram" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitch"></i>' class="mb-2">
                <b-form-input placeholder="twitch id" v-model="storeJson.twitch" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-reddit-alien"></i>' class="mb-2">
                <b-form-input placeholder="reddit id" v-model="storeJson.reddit" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-telegram-plane"></i>' class="mb-2">
                <b-form-input placeholder="telegram id" v-model="storeJson.telegram" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-discord"></i>' class="mb-2">
                <b-form-input placeholder="discord id" v-model="storeJson.discord" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-slack-hash"></i>' class="mb-2">
                <b-form-input placeholder="slack id" v-model="storeJson.slack" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-youtube"></i>' class="mb-2">
                <b-form-input placeholder="youtube id" v-model="storeJson.youtube" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fas fa-comment-alt"></i>' class="mb-2">
                <b-form-input placeholder="disqus id" v-model="storeJson.disqus" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
            </b-card>
          </b-collapse>
          <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="storeMessage" :valid-feedback="storeMessage" :state="storeState" v-if="storeUI.mode!=3">
            <b-input-group size="sm">
              <b-form-input size="sm" type="password" placeholder="password" v-model="storePW" :readonly="storeUI.mode==3"></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" v-on:click="_createStore()" :disabled="storeUI.mode==3"><i class="fas fa-handshake"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </b-modal>

      <b-modal ref="refModal" :size="modal.size" :title="modal.title" :header-bg-variant="modal.headerBg" :header-text-variant="modal.headerTxt"  hide-footer>
        <div class="d-block text-center" v-html="modal.html"></div>
        <store-item v-for="item in modal.items" v-bind:item="item" v-bind:key="item.store"></store-item>
      </b-modal>
      <!-- modal -->
      <b-container>
        <br/>
        <b-row>
            <b-col lg="5">
              <b-img fluid src="./c0.jpg" border-variant="light"/>
            </b-col>
            <b-col lg="7">
              <h2>WALLET <h6 style="display: inline-block;"><a target="_blank" :href="gitWWW"><i class="fab fa-github"></i></a></h6></h2>
              <h5>Create your wallet.</h5>
              <p>If you want to create a wallet, click <i class="far fa-plus-square"></i> icon at menu bar and input passwords and click create button.</p>
            </b-col>
        </b-row>

        <hr/>
        <b-row>
          <b-col lg="7">
            <h2>AVATAR <h6 style="display: inline-block;">
                <a href="javascript:void(0)" v-on:click="showCreateAvatar()"><i class="fas fa-user-circle"></i></a>
                <a href="javascript:void(0)" v-on:click="searchAvatar()"><i class="fas fa-clipboard-list"></i></a>
                <a :href="scanAvatar" target="_blank"><i class="fas fa-link"></i></a>
                <a :href="gitAvatar" target="_blank"><i class="fab fa-github"></i></a>
              </h6>
            </h2>
            <h5>Create your own avatar store.</h5>
            <p>If you want to create a avatar store, create wallet and login first.</p>
            <p>After login, click <i class="fas fa-user-circle"></i> icon, and write store name, ERC20 contract address or '0x0' for Ethereum, and set price of making avatar. You can also change the price of making avatar after creation.</p>
            <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
            <div>
              <b-form-group size="sm" label="Avatar Contract" :invalid-feedback="avatar.mssage" :valid-feedback="avatar.mssage" :state="avatar.state" class="mb-3">
                <b-input-group size="sm">
                  <b-form-input type="text" placeholder="contract adress" v-model="avatarUI.address"></b-form-input>
                  <b-input-group-append>
                    <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditAvatar(true)"><i class="fas fa-file-invoice-dollar"></i></b-btn>
                    <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditAvatar(false)"><i class="fas fa-file-signature"></i></b-btn>
                    <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="showEditAvatar()"><i class="fas fa-search"></i></b-btn>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </b-col>
          <b-col lg="5">
            <b-img fluid src="./c1.jpg" border-variant="light"/>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
            <b-col lg="5">
              <b-img fluid src="./c2.jpg" border-variant="light"/>
            </b-col>
            <b-col lg="7">
              <h2>STORE <h6 style="display: inline-block;">
                  <a href="javascript:void(0)" v-on:click="showCreateStore()"><i class="fas fa-store"></i></a>
                  <a href="javascript:void(0)" v-on:click="searchStore()"><i class="fas fa-clipboard-list"></i></a>
                  <a :href="scanStore" target="_blank"><i class="fas fa-link"></i></a>
                  <a :href="gitStore" target="_blank"><i class="fab fa-github"></i></a>
                </h6>
              </h2>
              <h5>Create your own digital contents store with Ethereum or any ERC20 tokens.</h5>
              <p>If you want to create a store, create wallet and login first.</p>
              <p>After login, click <i class="fas fa-store"></i> icon, and write store name, ERC20 contract address or '0x0' for Ethereum and etc.</p>
              <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
              <div>
                <b-form-group size="sm" label="Store Contract" :invalid-feedback="store.mssage" :store-feedback="store.mssage" :state="store.state" class="mb-3">
                  <b-input-group size="sm">
                    <b-form-input type="text" placeholder="contract adress" v-model="storeUI.address"></b-form-input>
                    <b-input-group-append>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditStore(true)"><i class="fas fa-file-invoice-dollar"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditStore(false)"><i class="fas fa-file-signature"></i></b-btn>
                      <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="showEditStore()"><i class="fas fa-search"></i></b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </div>
            </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col lg="7">
            <h2>CASINO</h2>
            <h5>Create your own casino and play with Ethereum or any ERC20 tokens.</h5>
            <p>Coming soon.</p>
          </b-col>
          <b-col lg="5">
            <b-img fluid src="./c3.jpg" border-variant="light"/>
          </b-col>
        </b-row>
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

        modalAlert:'',
        wallet:navbar.wallet,

        gitWWW:'https://github.com/Nitro888/wallet.nitro888.com',
        gitAvatar:'https://github.com/Nitro888/avatar.nitro888.com',
        gitStore:'https://github.com/Nitro888/toonist.nitro888.com',

        avatar:{state:true,mssage:''},
        avatarUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        avatarData:{erc20:"",price:0},
        avatarJson:{title:"",desc:"",mail:"",facebook:"",twitter:"",instagram:"",twitch:"",reddit:"",telegram:"",discord:"",slack:"",youtube:"",disqus:""},
        avatarPW:'',
        avatarState:true,
        avatarMessage:'',

        store:{state:true,mssage:''},
        storeUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        storeData:{erc20:"",startshare:0,share:0},
        storeJson:{title:"",desc:"",mail:"",facebook:"",twitter:"",instagram:"",twitch:"",reddit:"",telegram:"",discord:"",slack:"",youtube:"",disqus:""},
        storePW:'',
        storeState:true,
        storeMessage:'',

        modal:{title:'',size:'md',headerBg:'',headerTxt:'',html:'',items:[]}
      }
    },
    computed: {
      titleAvatar: function () {
        return this.avatarUI.mode==0?"Create Avatar Store":this.avatarUI.mode!=3?"Edit Avatar Store":"Avatar Store";
      },
      titleStore: function () {
        return this.storeUI.mode==0?"Create Contents Store":this.storeUI.mode!=3?"Edit Contents Store":"Contents Store";
      },
      isLogedIn: function () {
        return this.wallet.web3&&this.wallet.isAddress();
      },
      scanAvatar: function () {
        return this.wallet.web3?this.wallet.option['network']['href']+"/address/"+aMgr.address:'#';
      },
      scanStore:function () {
        return '#';
      }
    },
    methods: {
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      },
      _resetAvatar() {
        this.avatarData['erc20']  = '';
        this.avatarData['price']  = 0;
        for (var key in this.avatarJson)
          this.avatarJson[key] = '';
      },
      _resetStore() {
        this.storeData['erc20']       = '';
        this.storeData['startshare']  = 0;
        this.storeData['share']       = 0;
        for (var key in this.storeJson)
          this.storeJson[key] = '';
      },
      _json(obj)       {
        let json = {};
        for (var key in obj)
          if(obj[key]!='')
            json[key] = obj[key];
        return json;
      },
      //-------------------------------- Avatar
      showCreateAvatar () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this._resetAvatar();
          this.avatarUI.address     = '';
          this.avatarUI.link        = '';
          this.avatarUI.mode        = 0;
          this.avatarUI.communities = false;
          this.avatarPW             = '';
          this.avatarMessage        = '';
          this.$refs.refModalAvatar.show();
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      showEditAvatar (price=false) {
        if(this.wallet.web3&&this.wallet.web3.utils.isAddress(this.avatarUI.address)) {
          let that = this;
          this.wallet.contract[aMgr.address].c.methods.about(that.avatarUI.address).call((e,r)=>{
            if(!e&&parseInt(r[0])>0) {
              that.avatar.state   = true;
              that.avatar.mssage  = '';
              let topics  = 'topic0='+aMgr.abi[8]['signature']+'&topic2='+that.wallet.web3.utils.padLeft(that.avatarUI.address,64);
              that.wallet.logs(aMgr.address,topics,(data)=>{
                if(data.length>0) {
                  let temp    = that.wallet.web3.eth.abi.decodeLog(aMgr.abi[8]['inputs'],data[data.length-1].data,data[data.length-1].topics)[2];
                  let address = '0x'+data[data.length-1].topics[1].toString().slice(-40).toLowerCase();
                  let about   = msgpack.decode(that.wallet.web3.utils.hexToBytes(temp));

                  that._resetAvatar();

                  that.avatarData['erc20']  = r[2];
                  that.avatarData['price']  = that.wallet.web3.utils.fromWei(r[3].toString(),'ether');
                  for (var key in about)
                    that.avatarJson[key] = about[key];

                  that.avatarUI.link        = that.wallet.option['network']['href']+"/address/"+that.avatarUI.address;
                  that.avatarUI.mode        = address==that.wallet.address().toLowerCase()?(price?2:1):3;
                  that.avatarUI.communities = false;
                  that.avatarPW             = '';
                  that.avatarMessage        = '';
                  that.$refs.refModalAvatar.show();
                }
              });
            } else {
              if(parseInt(r[0])==0)
                that.avatar.mssage  = "This is not contract address.";
              else
                that.avatar.mssage  = "Unknown error.";
              that.avatar.state  = false;
            }
          });
        } else {
          // todo : may be wallet error
        }
      },
      _createAvatar () {
        let about = this._json(this.avatarJson);
        let erc20 = this.wallet.web3.utils.isAddress(this.avatarData['erc20'])?this.avatarData['erc20']:'0x0';
        let price = this.wallet.web3.utils.toWei(this.avatarData['price'],'ether');
        let data  = null;

        if(this.avatarUI.mode==0)
          data  = this.wallet.contract[aMgr.address].c.methods.create(erc20,price,this.wallet.web3.utils.bytesToHex(msgpack.encode(about))).encodeABI();
        else if(this.avatarUI.mode==1)
          data  = this.wallet.contract[aMgr.address].c.methods.store(this.avatarUI.address,this.wallet.web3.utils.bytesToHex(msgpack.encode(about))).encodeABI();
        else if(this.avatarUI.mode==2)
          data  = this.wallet.contract[aMgr.address].c.methods.price(this.avatarUI.address,price).encodeABI();

        if(data!=null)
          this.wallet.sendTx(aMgr.address,this.avatarPW,0,data,console.log,(h)=>{this.avatarMessage="Tx:"+h;},(r)=>{this.avatarMessage="Success";});
      },
      searchAvatar () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          let that    = this;
          let topics  = 'topic0='+aMgr.abi[8]['signature']+'&topic1='+this.wallet.web3.utils.padLeft(this.wallet.address(),64);
          that.showModal('Your avatar stores','md','dark','now loading...');
          that.wallet.logs(aMgr.address,topics,(data)=>{
            let list = [];
            for(let i = data.length-1 ; i >= 0 ; i--) {
              let temp  = that.wallet.web3.eth.abi.decodeLog(aMgr.abi[8]['inputs'],data[i].data,data[i].topics)[2];
              let owner = '0x'+data[i].topics[1].toString().slice(-40).toLowerCase();
              let store = '0x'+data[i].topics[2].toString().slice(-40).toLowerCase();
              if(!list.find(x=>x.store==store))
                list.push({owner:owner,store:store,about:msgpack.decode(that.wallet.web3.utils.hexToBytes(temp))});
            }

            if(list.length>0) {
              for(let i = 0 ; i < list.length ; i++)
                that.modal.items.push({'key':list[i].store,'root':that,'data':list[i]});

              that.updateModalHtml('');
            } else {
              that.updateModalHtml('Empty');
            }
          });
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      //-------------------------------- Avatar
      //-------------------------------- Store
      showCreateStore () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this._resetStore();
          this.storeUI.address      = '';
          this.storeUI.link         = '';
          this.storeUI.mode         = 0;
          this.storeUI.communities  = false;
          this.storePW              = '';
          this.$refs.refModalStore.show();
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      showEditStore () {
        if(this.wallet.web3&&this.wallet.web3.utils.isAddress(this.storeUI.address)) {
          this._resetStore();

          // todo : loading data

          this.storeUI.link         = this.wallet.option['network']['href']+"/address/"+this.storeUI.address;
          this.storeUI.mode         = this.wallet.web3&&this.wallet.isAddress()?1:2;  // todo : for test
          this.storeUI.communities  = false;
          this.storePW              = '';
          this.$refs.refModalStore.show();
        }
      },
      _createStore() {
        let about = this._json(this.storeJson);
        console.log(about);
        //console.log(msgpack.encode(about));
        //let data	 = STORE.methods.create(share,shareStart,information.encode('shopInfo')).encodeABI();
      },
      searchStore () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          // todo : loding my store
          this.$refs.refModalSearchStore.show();
          this.showModal('Your stores','md','dark','todo : temp.......');
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      //-------------------------------- Store
      showModal(title,size,header,html) {
        this.modal.title    = title;
        this.modal.size     = size;
        this.modal.headerBg = header;
        this.modal.headerTxt= header=='dark'?'light':'dark';
        this.modal.html     = html;
        this.modal.items    = [];
        this.$refs.refModal.show();
      },
      updateModalHtml(html) {
        this.modal.html     = html;
      },
    }
}

Vue.component('store-item', {
  props: ['item'],
  template: '<b-input-group size="sm" class="mb-1"><b-form-input :value="item.data.about.title" readonly></b-form-input><b-input-group-append><b-btn size="sm" v-on:click="item.root.avatarUI.address=item.key;item.root.showEditAvatar(true);"><i class="fas fa-file-invoice-dollar"></i></b-btn><b-btn size="sm" v-on:click="item.root.avatarUI.address=item.key;item.root.showEditAvatar(false);"><i class="fas fa-file-signature"></i></b-btn></b-input-group-append></b-input-group>'
});
Vue.component('mainvue', main);

new Vue({
  el: '#mainvue'
});
