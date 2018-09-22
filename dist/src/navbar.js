let wallet  = require('./wallet.js');
let avatar  = require('./avatar/view.js');

const navbar = {
  template: `
  <div>
    <b-navbar type="dark" variant="dark" sticky toggleable>
      <b-navbar-brand href="#">Nitro888</b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!logedin" v-on:click="showCreate()"><i class="far fa-plus-square"></i></b-nav-item>
          <b-nav-item v-if="!logedin" v-on:click="_login()"><i class="fas fa-sign-in-alt"></i></b-nav-item>
          <b-nav-item-dropdown v-if="logedin" text='<i class="fas fa-wallet"></i>' no-caret right>
            <b-dropdown-header v-show="logedin&&avatarHas">
              <div style="width:100%;padding-top:100%;position:relative;border-radius:50%;overflow:hidden;">
                <div id="avatarDropdown" style="position:absolute;width:100%;height:100%;top:0%;left:0%;background-color:gray;"/>
              </div>
            </b-dropdown-header>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item v-on:click="showDeposit()"><i class="fas fa-qrcode"></i> Deposit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <navbar-item v-for="token in tokenList" v-bind:item="token" v-bind:key="token.id"></navbar-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item v-on:click="_logout()"><i class="fas fa-sign-out-alt"></i> Logout</b-dropdown-item>
          </b-nav-item-dropdown>
          <div v-show="logedin&&avatarHas" id="avatarNavbar" style="height:35px;width:35px;background-color:gray;border-radius:50%;overflow:hidden;"></div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <input type="file" ref="walletLoader" style="display: none;" accept=".json,.wallet" v-on:change="loadWalletFromFile"></input>
    <!-- modal -->
    <b-modal ref="refModal" :title="title" header-bg-variant="dark" header-text-variant="light" hide-footer>
      <!-- modal.create -->
      <div v-if="contents.create">
        <b-form-group :invalid-feedback="createFeedback" :valid-feedback="createFeedback" :state="createState">
        <b-input-group>
          <b-form-input type="password" :state="createState" placeholder="password" v-model="create.pw0"></b-form-input>
        </b-input-group><br/>
        <b-input-group>
          <b-form-input type="password" :state="createState" placeholder="password retype" v-model="create.pw1"></b-form-input>
          <b-input-group-append>
            <b-btn variant="info" v-on:click="_createOK()">Create</b-btn>
          </b-input-group-append>
        </b-input-group>
        </b-form-group>
      </div>
      <!-- modal.login -->
      <div v-if="contents.login">
        <b-form-group label="Wallet password" :invalid-feedback="login.feedback" :valid-feedback="login.feedback" :state="login.state">
        <b-input-group>
          <b-form-input type="password" :state="login.state" placeholder="password" v-model="login.pw"></b-form-input>
          <b-input-group-append>
            <b-btn variant="info" v-on:click="_loginOK()">OK</b-btn>
          </b-input-group-append>
        </b-input-group>
        </b-form-group>
      </div>
      <!-- modal.html -->
      <div v-if="contents.html" class="d-block text-center" v-html="html"></div>
      <!-- modal.transactions -->
      <b-table v-if="contents.transactions" :small="true" :items="txItems" responsive>
        <span slot="_" slot-scope="icon" v-html="icon.value"></span>
        <span slot="address" slot-scope="addr" v-html="addr.value"></span>
        <span slot="amount" slot-scope="val" v-html="val.value"></span>
      </b-table>
      <!-- modal.withdrawal -->
      <div  v-if="contents.withdrawal">
        <b-form-group label="Wallet balance">
          <b-input-group :prepend="withdrawal.icon">
            <b-form-input type="number" v-model="withdrawal.balance" readonly></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group label="To" :invalid-feedback="withdrawal.feedbackTo" :valid-feedback="withdrawal.feedbackTo" :state="stateTo">
          <b-input-group prepend="<i class='fas fa-wallet'></i>">
            <b-form-input type="text" :state="stateTo" v-model="withdrawal.to"></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group label="Amount" :invalid-feedback="withdrawal.feedbackAmount" :valid-feedback="withdrawal.feedbackAmount" :state="stateAmount">
          <b-form-input type="number" :state="stateAmount" v-model="withdrawal.amount"></b-form-input>
        </b-form-group>
        <b-form-group label="Password" :invalid-feedback="withdrawal.feedbackPw" :valid-feedback="withdrawal.feedbackPw" :state="withdrawal.statePw">
          <b-input-group>
            <b-form-input type="password" :state="withdrawal.statePw" placeholder="password" v-model="withdrawal.pw"></b-form-input>
            <b-input-group-append>
              <b-btn variant="info" v-on:click="_withdrawalOK()">OK</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </div>
    </b-modal>
    <!-- modal -->
  </div>
  `,
  data: function () {
    return {
      logedin       : false,
      avatarLoad    : false,
      avatarHas     : false,
      tokenDefault  : '<i class="fas fa-coins"></i>',
      tokenList     : [],

      title         : '',
      contents      : {create:false,login:false,html:false,transactions:false,withdrawal:false},

      create        : {pw0:'',pw1:''},
      login         : {feedback:'',state:true,temp:null,pw:''},
      deposit       : '',
      txItems       : [],
      withdrawal    : {id:'',icon:'',balance:0,to:'',feedbackTo:'Please input address',amount:0,feedbackAmount:'Please input amount of coin',pw:'',statePw:true,feedbackPw:''}
    }
  },
  computed: {
    createState: function () {
      return (this.create.pw0==this.create.pw1)&&this.create.pw0!='';
    },
    createFeedback: function () {
      return this.create.pw0==''?"Please input password":(this.create.pw0==this.create.pw1)?"Can create wallet":"Passwords are not same";
    },
    stateTo: function () {
      return wallet.web3?wallet.isAddress(this.withdrawal.to)&&wallet.address().toLowerCase()!=this.withdrawal.to.toLowerCase():false;
    },
    stateAmount: function () {
      return wallet.web3?wallet.balances[this.withdrawal.id].balance>wallet.web3.utils.toWei(this.withdrawal.amount!=""?this.withdrawal.amount.toString():"0",'ether'):false;
    }
  },
  methods: {
    update() {
      if(this.tokenList.length==0)
        for (let token in wallet.balances)
          this.tokenList.push({
            id      : token,
            root    : this,
            icon    : wallet.balances[token].icon==""?this.tokenDefault:wallet.balances[token].icon,
            name    : wallet.balances[token].name,
            balance : wallet.web3.utils.fromWei(wallet.balances[token].balance.toString(),'ether')});
      else
        for(let i = 0 ; i < this.tokenList.length ; i++ )
          this.tokenList[i].balance = wallet.web3.utils.fromWei(wallet.balances[this.tokenList[i].id].balance.toString(),'ether');

      if(!this.avatarLoad&&wallet.address()) {
        avatar.view.load('avatarNavbar',wallet.address(),null,(store)=>{this.avatarHas=true;avatar.view.load('avatarDropdown',wallet.address());});
        this.avatarLoad = true;
      }
    },
    _createOK() {
      if((this.create.pw0==this.create.pw1)&&this.create.pw0!='') {
        wallet.create(this.create.pw0,(keyObject)=>{
          saveTextAs(JSON.stringify(keyObject, null, '\t'),wallet.option.name+"("+"0x"+keyObject.address+").wallet");
        });
      }
    },
    _login() {
      // load from file or cookie
      if(wallet.keyObject)
        this.showLogin();
      else
        this.$refs.walletLoader.click();
    },
    _logout() {
      wallet.logout();
      this.logedin    = wallet.address()!=null;
      this.avatarLoad = false;
      this.avatarHas  = false;
      this.update();
    },
    _withdrawalOK() {
      if(!(wallet.web3?wallet.balances[this.withdrawal.id].balance>wallet.web3.utils.toWei(this.withdrawal.amount!=""?this.withdrawal.amount.toString():"0",'ether'):false))
        return;
      if(wallet.isAddress(this.withdrawal.to)&&(this.withdrawal.amount>0))
        wallet.transfer(this.withdrawal.to,this.withdrawal.pw,this.withdrawal.id,this.withdrawal.amount,
          (e)=>{this.withdrawal.statePw=false;this.withdrawal.feedbackPw=e;},
          (h)=>{this.withdrawal.statePw=true;this.withdrawal.feedbackPw="Tx:"+h;},
          (r)=>{this.withdrawal.statePw=true;this.withdrawal.feedbackPw="Success";});
    },
    loadWalletFromFile(event) {
      if (event.target.files && event.target.files[0]) {
        let reader  = new FileReader();
        let that    = this;
        reader.onload = function(){
          that.login.temp               = JSON.parse(reader.result);
          that.$refs.walletLoader.value = '';
          if(that.login.temp!=null)
            that.showLogin();
        };
        reader.readAsText(event.target.files[0]);
      }
    },
    loadWalletFromCookie() {
      // todo : load from cookie
    },
    _loginOK() {
      wallet.callback = this.update
      wallet.login(this.login.pw,wallet.keyObject?wallet.keyObject:this.login.temp,
        (e)=>{
          this.login.state      = false;
          this.login.feedback   = "Log in fail";
          this.login.pw         = '';
          wallet.callback       = null;
          this.logedin          = wallet.address()!=null;
        },
        (s)=>{
          this.login.temp       = null;
          this.login.state      = true;
          this.login.feedback   = "Log in success";
          this.login.pw         = '';
          this.logedin          = wallet.address()!=null;
        });
    },
    // showModal
    reset(show) {
      for (let div in this.contents)
        this.contents[div] = div==show?true:false;
    },
    showCreate() {
      this.reset('create');
      this.title      = "Create Wallet";
      this.create.pw0 = '';
      this.create.pw1 = '';
      this.$refs.refModal.show();
    },
    showLogin() {
      this.reset('login');
      this.title          = 'Log In';
      this.login.state    = true;
      this.login.feedback = "Enter your wallet password";
      this.login.pw       = '';
      this.$refs.refModal.show();
    },
    showDeposit() {
      this.reset('html');
      this.title  = "Deposit";
      this.html   = '<div>'+wallet.option.name+'</div>' +
                    '<div>'+wallet.addressQR()+'</div>' +
                    '<div><a target="_blank" href="'+wallet.addressLNK()+'">'+wallet.address()+"</a></div>";
      this.$refs.refModal.show();
    },
    showWithdrawal(id,name) {
      this.reset('withdrawal');
      this.title                  = "Withdrawal ("+name+")";

      this.modalPassword          = '';
      this.withdrawal.id          = id;
      this.withdrawal.icon        = wallet.balances[id].icon==""?this.tokenDefault:wallet.balances[id].icon;
      this.withdrawal.balance     = wallet.web3.utils.fromWei(wallet.balances[id].balance.toString(),'ether');
      this.withdrawal.to          = '';
      this.withdrawal.amount      = 0;
      this.withdrawal.feedbackPw  = "Enter your wallet password";

      this.$refs.refModal.show();
    },
    showTransactions(id,name) {
      this.reset('html');
      this.title          = "Transactions ("+name+")";
      this.html           = 'Now Loading...'
      this.$refs.refModal.show();
      this.txItems        = [];

      wallet.txHistory(id,(data)=>{
        if(data.length>0) {
          this.reset('transactions');
          for(let i = 0 ; i < data.length ; i++) {
            if(data[i]['from'].toLowerCase()==wallet.address().toLowerCase())
              this.txItems.push({'_':'<i class="fas fa-sign-out-alt" style="color:red;"></i>','address':'<a href="'+wallet.txLNK(data[i]['hash'])+'" target="_blank"><small>'+data[i]['to']+'</small></a>','amount':'<small>'+wallet.web3.utils.fromWei(data[i]['value'].toString(),'ether')+'</small>'});
            else
              this.txItems.push({'_':'<i class="fas fa-sign-in-alt" style="color:green;"></i>','address':'<a href="'+wallet.txLNK(data[i]['hash'])+'" target="_blank"><small>'+data[i]['from']+'</small></a>','amount':'<small>'+wallet.web3.utils.fromWei(data[i]['value'].toString(),'ether')+'</small>'});
          }
        } else
          this.html   = 'No Transactions...'
      });
    }
    // showModal
  }
}

Vue.component('navbar-item', {
  props: ['item'],
  template: '<div><b-dropdown-header><span v-html="item.icon"></span> {{ item.name }}</b-dropdown-header><b-dropdown-item v-on:click="item.root.showWithdrawal(item.id,item.name)"><i class="fas fa-money-check"></i> {{ item.balance }}</b-dropdown-item><b-dropdown-item v-on:click="item.root.showTransactions(item.id,item.name)"><i class="fas fa-history"></i> History</b-dropdown-item></div>'
});
Vue.component('navbar', navbar);

module.exports = new Vue({
  el: '#navbar'
});
module.exports.wallet = wallet;
