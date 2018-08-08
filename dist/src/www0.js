let navbar  = require('./navbar.js');

const aMgr  = require('./abi/avatar20/manager.js');
navbar.wallet.pushContract(aMgr.abi,aMgr.address);

const sMgr  = require('./abi/store/manager.js');
navbar.wallet.pushContract(sMgr.abi,sMgr.address);

//console.log(aMgr.abi);
//console.log(sMgr.abi);

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
            <b-form-input size="sm" id="input_nameA" placeholder="name of store" v-model="commonJson.title" :readonly="avatarUI.mode>1"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Description" label-for="input_descA">
            <b-form-textarea size="sm" id="input_descA" placeholder="enter description" v-model="commonJson.desc" :readonly="avatarUI.mode>1"></b-form-textarea>
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
                <b-form-input placeholder="e-mail" v-model="commonJson.mail" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-facebook-f"></i>' class="mb-2">
                <b-form-input placeholder="facebook id" v-model="commonJson.facebook" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitter"></i>' class="mb-2">
                <b-form-input placeholder="twitter id" v-model="commonJson.twitter" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-instagram"></i>' class="mb-2">
                <b-form-input placeholder="instagram id" v-model="commonJson.instagram" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitch"></i>' class="mb-2">
                <b-form-input placeholder="twitch id" v-model="commonJson.twitch" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-reddit-alien"></i>' class="mb-2">
                <b-form-input placeholder="reddit id" v-model="commonJson.reddit" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-telegram-plane"></i>' class="mb-2">
                <b-form-input placeholder="telegram id" v-model="commonJson.telegram" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-discord"></i>' class="mb-2">
                <b-form-input placeholder="discord id" v-model="commonJson.discord" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-slack-hash"></i>' class="mb-2">
                <b-form-input placeholder="slack id" v-model="commonJson.slack" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-youtube"></i>' class="mb-2">
                <b-form-input placeholder="youtube id" v-model="commonJson.youtube" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fas fa-comment-alt"></i>' class="mb-2">
                <b-form-input placeholder="disqus id" v-model="commonJson.disqus" :readonly="avatarUI.mode>1"></b-form-input>
              </b-input-group>
            </b-card>
          </b-collapse>
          <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="common.message" :valid-feedback="common.message" :state="common.state" v-if="avatarUI.mode!=3">
            <b-input-group size="sm">
              <b-form-input size="sm" type="password" placeholder="password" v-model="common.password" :readonly="avatarUI.mode==3"></b-form-input>
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
            <b-form-input size="sm" id="input_nameS" placeholder="name of store" v-model="commonJson.title" :readonly="storeUI.mode>1"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Description" label-for="input_descS">
            <b-form-textarea size="sm" id="input_descS" placeholder="enter description" v-model="commonJson.desc" :readonly="storeUI.mode>1"></b-form-textarea>
          </b-form-group>
          <b-form-group size="sm" label="Token Address" label-for="input_tokenS">
            <b-form-input size="sm" id="input_tokenS" placeholder="erc20 token address or '0x0' for ethereum" v-model="storeData.erc20" :readonly="storeUI.mode!=0"></b-form-input>
          </b-form-group>
          <b-btn size="sm" v-b-toggle.CommunitiesS variant="outline-primary" class="mt-4" block>Communities</b-btn>
          <b-collapse id="CommunitiesS" v-model="storeUI.communities">
            <b-card>
              <b-input-group size="sm" prepend='<i class="fas fa-at"></i>' class="mb-2">
                <b-form-input placeholder="e-mail" v-model="commonJson.mail" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-facebook-f"></i>' class="mb-2">
                <b-form-input placeholder="facebook id" v-model="commonJson.facebook" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitter"></i>' class="mb-2">
                <b-form-input placeholder="twitter id" v-model="commonJson.twitter" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-instagram"></i>' class="mb-2">
                <b-form-input placeholder="instagram id" v-model="commonJson.instagram" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitch"></i>' class="mb-2">
                <b-form-input placeholder="twitch id" v-model="commonJson.twitch" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-reddit-alien"></i>' class="mb-2">
                <b-form-input placeholder="reddit id" v-model="commonJson.reddit" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-telegram-plane"></i>' class="mb-2">
                <b-form-input placeholder="telegram id" v-model="commonJson.telegram" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-discord"></i>' class="mb-2">
                <b-form-input placeholder="discord id" v-model="commonJson.discord" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-slack-hash"></i>' class="mb-2">
                <b-form-input placeholder="slack id" v-model="commonJson.slack" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-youtube"></i>' class="mb-2">
                <b-form-input placeholder="youtube id" v-model="commonJson.youtube" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fas fa-comment-alt"></i>' class="mb-2">
                <b-form-input placeholder="disqus id" v-model="commonJson.disqus" :readonly="storeUI.mode>1"></b-form-input>
              </b-input-group>
            </b-card>
          </b-collapse>
          <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="common.message" :valid-feedback="common.message" :state="common.state" v-if="storeUI.mode!=3">
            <b-input-group size="sm">
              <b-form-input size="sm" type="password" placeholder="password" v-model="common.password" :readonly="storeUI.mode==3"></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" v-on:click="_createStore()" :disabled="storeUI.mode==3"><i class="fas fa-handshake"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </b-modal>
      <b-modal ref="refModalCreator" :title="titleCreator" header-bg-variant="dark" header-text-variant="light" hide-footer>
        <div>
          <b-form-group size="sm" label="Contract" v-if="creatorUI.mode!=0">
            <b-input-group size="sm">
              <b-form-input size="sm" type="text" v-model="creatorUI.address" readonly></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" target="_blank" :href="creatorUI.link"><i class="fas fa-link"></i></b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group size="sm" label="Name" label-for="input_nameC">
            <b-form-input size="sm" id="input_nameC" placeholder="name of creator" v-model="commonJson.title" :readonly="creatorUI.mode>1"></b-form-input>
          </b-form-group>
          <b-form-group size="sm" label="Description" label-for="input_descC">
            <b-form-textarea size="sm" id="input_descC" placeholder="enter description" v-model="commonJson.desc" :readonly="creatorUI.mode>1"></b-form-textarea>
          </b-form-group>
          <b-btn size="sm" v-b-toggle.CommunitiesC variant="outline-primary" class="mt-4" block>Communities</b-btn>
          <b-collapse id="CommunitiesC" v-model="creatorUI.communities">
            <b-card>
              <b-input-group size="sm" prepend='<i class="fas fa-at"></i>' class="mb-2">
                <b-form-input placeholder="e-mail" v-model="commonJson.mail" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-facebook-f"></i>' class="mb-2">
                <b-form-input placeholder="facebook id" v-model="commonJson.facebook" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitter"></i>' class="mb-2">
                <b-form-input placeholder="twitter id" v-model="commonJson.twitter" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-instagram"></i>' class="mb-2">
                <b-form-input placeholder="instagram id" v-model="commonJson.instagram" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-twitch"></i>' class="mb-2">
                <b-form-input placeholder="twitch id" v-model="commonJson.twitch" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-reddit-alien"></i>' class="mb-2">
                <b-form-input placeholder="reddit id" v-model="commonJson.reddit" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-telegram-plane"></i>' class="mb-2">
                <b-form-input placeholder="telegram id" v-model="commonJson.telegram" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-discord"></i>' class="mb-2">
                <b-form-input placeholder="discord id" v-model="commonJson.discord" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-slack-hash"></i>' class="mb-2">
                <b-form-input placeholder="slack id" v-model="commonJson.slack" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fab fa-youtube"></i>' class="mb-2">
                <b-form-input placeholder="youtube id" v-model="commonJson.youtube" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
              <b-input-group size="sm" prepend='<i class="fas fa-comment-alt"></i>' class="mb-2">
                <b-form-input placeholder="disqus id" v-model="commonJson.disqus" :readonly="creatorUI.mode>1"></b-form-input>
              </b-input-group>
            </b-card>
          </b-collapse>
          <b-form-group size="sm" label="Password" class="mt-3" :invalid-feedback="common.message" :valid-feedback="common.message" :state="common.state" v-if="creatorUI.mode!=3">
            <b-input-group size="sm">
              <b-form-input size="sm" type="password" placeholder="password" v-model="common.password" :readonly="creatorUI.mode==3"></b-form-input>
              <b-input-group-append>
                <b-btn size="sm" variant="info" v-on:click="_createCreator()" :disabled="creatorUI.mode==3"><i class="fas fa-handshake"></i></b-btn>
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
              <h5>How to get a wallet.</h5>
              <p>If you want to create a wallet, click <i class="far fa-plus-square"></i> icon at menu bar and input passwords and click create button.</p>
            </b-col>
        </b-row>

        <hr/>
        <b-row>
          <b-col lg="7">
            <h2>AVATAR <h6 style="display: inline-block;">
                <a href="javascript:void(0)" v-on:click="showCreateAvatar()"><i class="fas fa-user-circle"></i></a>
                <a :href="scanAvatar" target="_blank"><i class="fas fa-link"></i></a>
                <a :href="gitAvatar" target="_blank"><i class="fab fa-github"></i></a>
              </h6>
            </h2>
            <h5>How to get your avatar store.</h5>
            <p>If you want to create a avatar store, create wallet and login first.</p>
            <p>After login, click <i class="fas fa-user-circle"></i> icon, and write store name, ERC20 contract address or '0x0' for Ethereum, and set price of making avatar. You can also change the price of making avatar after creation.</p>
            <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
            <div>
              <b-form-group size="sm" :invalid-feedback="avatar.mssage" :valid-feedback="avatar.mssage" :state="avatar.state" class="mb-3">
                <b-input-group size="sm">
                  <b-input-group-prepend>
                    <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="searchAvatar()"><i class="fas fa-list-ul"></i></b-btn>
                  </b-input-group-prepend>
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
                  <a href="javascript:void(0)" v-on:click="showCreatePack()"><i class="fas fa-archive"></i></a>
                  <a :href="scanStore" target="_blank"><i class="fas fa-link"></i></a>
                  <a :href="gitStore" target="_blank"><i class="fab fa-github"></i></a>
                </h6>
              </h2>
              <h5>How to get your digital contents store.</h5>
              <p>After login, click <i class="fas fa-store"></i> icon, and write store name and etc.</p>
              <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
              <div>
                <b-form-group size="sm" :invalid-feedback="store.mssage" :valid-feedback="store.mssage" :state="store.state" class="mb-3">
                  <b-input-group size="sm">
                    <b-input-group-prepend>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="searchStore()"><i class="fas fa-list-ul"></i></b-btn>
                    </b-input-group-prepend>
                    <b-form-input type="text" placeholder="contract adress" v-model="storeUI.address"></b-form-input>
                    <b-input-group-append>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditStore(true)"><i class="fas fa-file-invoice-dollar"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditStore(false)"><i class="fas fa-file-signature"></i></b-btn>
                      <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="showEditStore()"><i class="fas fa-search"></i></b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </div>
              <h5>How to create digital contents pack at store.</h5>
              <p>After login, click <i class="fas fa-archive"></i> icon, and write pack name and etc.</p>
              <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
              <div>
                <b-form-group size="sm" :invalid-feedback="pack.mssage" :valid-feedback="pack.mssage" :state="pack.state" class="mb-3">
                  <b-input-group size="sm">
                    <b-input-group-prepend>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="searchPack()"><i class="fas fa-list-ul"></i></b-btn>
                    </b-input-group-prepend>
                    <b-form-input type="text" placeholder="contract adress" v-model="packUI.address"></b-form-input>
                    <b-input-group-append>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditPack(true)"><i class="fas fa-file-invoice-dollar"></i></b-btn>
                      <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditPack(false)"><i class="fas fa-file-signature"></i></b-btn>
                      <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="showEditPack()"><i class="fas fa-search"></i></b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </div>
            </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col lg="7">
            <h2>CREATOR <h6 style="display: inline-block;">
                <a href="javascript:void(0)" v-on:click="showCreateCreator()"><i class="fas fa-user"></i></a>
                <a :href="scanStore" target="_blank"><i class="fas fa-link"></i></a>
                <a :href="gitStore" target="_blank"><i class="fab fa-github"></i></a>
              </h6>
            </h2>
            <h5>How to get contents creator account.</h5>
            <p>After login, click <i class="fas fa-user"></i> icon, and write store name and etc.</p>
            <p>And input a password and click <i class="fas fa-handshake"></i> button.</p>
            <div>
              <b-form-group size="sm" :invalid-feedback="creator.mssage" :valid-feedback="creator.mssage" :state="creator.state" class="mb-3">
                <b-input-group size="sm">
                  <b-input-group-prepend>
                    <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="searchCreator()"><i class="fas fa-list-ul"></i></b-btn>
                  </b-input-group-prepend>
                  <b-form-input type="text" placeholder="creator adress" v-model="creatorUI.address"></b-form-input>
                  <b-input-group-append>
                    <b-btn size="sm" v-if="isLogedIn" variant="secondary" v-on:click="showEditCreator()"><i class="fas fa-file-signature"></i></b-btn>
                    <b-btn size="sm" v-if="!isLogedIn" variant="secondary" v-on:click="showEditCreator()"><i class="fas fa-search"></i></b-btn>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </b-col>
          <b-col lg="5">
            <b-img fluid src="./c3.jpg" border-variant="light"/>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col lg="5">
            <b-img fluid src="./c4.jpg" border-variant="light"/>
          </b-col>
          <b-col lg="7">
            <h2>TICKET</h2>
            <h5>Create ticket booth for yours.</h5>
            <p>Coming soon.</p>
          </b-col>
        </b-row>
        <hr/>
        <b-row>
          <b-col lg="7">
            <h2>CASINO</h2>
            <h5>Create your own casino and play.</h5>
            <p>Coming soon.</p>
          </b-col>
          <b-col lg="5">
            <b-img fluid src="./c5.jpg" border-variant="light"/>
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

        common:{message:'',password:'',state:true},
        commonJson:{title:"",desc:"",mail:"",facebook:"",twitter:"",instagram:"",twitch:"",reddit:"",telegram:"",discord:"",slack:"",youtube:"",disqus:""},

        avatar:{state:true,mssage:''},
        avatarUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        avatarData:{erc20:"",price:0},

        store:{state:true,mssage:''},
        storeUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        storeData:{erc20:""},

        pack:{state:true,mssage:''},
        packUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly
        packData:{shareStart:0,share:0},

        creator:{state:true,mssage:''},
        creatorUI:{communities:false,address:'',link:'#',mode:0},  // 0 = create, 1 = edit title, 2 = edit price, 3 = readonly

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
      titleCreator: function () {
        return this.creatorUI.mode==0?"Create Contents Creator":this.creatorUI.mode!=3?"Edit Contents Creator":"Contents Creator";
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
      _resetJson() {
        for (var key in this.commonJson)
          this.commonJson[key] = '';
        this.common.password = '';
        this.common.message  = '';
      },
      _resetAvatar() {
        this.avatarData['erc20']  = '';
        this.avatarData['price']  = 0;
        this._resetJson();
      },
      _resetStore() {
        this.storeData['erc20']       = '';
        this.storeData['shareStart']  = 0;
        this.storeData['share']       = 0;
        this._resetJson();
      },
      _json()       {
        let json = {};
        for (var key in this.commonJson)
          if(this.commonJson[key]!='')
            json[key] = this.commonJson[key];
        return json;
      },
      _searchOwner(contract,topic0,callback){
        let address = this.wallet.web3.utils.padLeft(this.wallet.address(),64);
        let topics  = 'topic0='+topic0+'&topic2='+address+'&topic3='+address+'&topic2_3_opr=or';
        this.wallet.logs(contract,topics,(data)=>{
          let list = [];
          for(let i = 0 ; i < data.length ; i++) {
            let key   = '0x'+data[i].topics[1].toString().slice(-40).toLowerCase();
            let owner = '0x'+data[i].topics[2].toString().slice(-40).toLowerCase();
            let from  = '0x'+data[i].topics[3].toString().slice(-40).toLowerCase();

            if(owner==this.wallet.address().toLowerCase())
              list.push({key:key,owner:owner,from:from});
            else {
              let index = list.findIndex(x=>x.store==store);
              if(index>-1)
                list.splice(index,1);
            }
          }
          callback(list);
        });
      },
      _sendTx(address,password,value,data) {
        if(data!=null)
          this.wallet.sendTx(address,password,value,data,(e)=>{this.common.state=false;this.common.message=e;},(h)=>{this.common.state=true;this.common.message="Tx:"+h;},(r)=>{this.common.state=true;this.common.message="Success";});
      },
      //-------------------------------- Avatar
      showCreateAvatar () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this._resetAvatar();

          this.avatarUI.address     = '';
          this.avatarUI.link        = '';
          this.avatarUI.mode        = 0;
          this.avatarUI.communities = false;
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
              let topics  = 'topic0='+aMgr.abi[12]['signature']+'&topic1='+that.wallet.web3.utils.padLeft(that.avatarUI.address,64);
              that.wallet.logs(aMgr.address,topics,(data)=>{
                if(data.length>0) {
                  let temp    = that.wallet.web3.eth.abi.decodeLog(aMgr.abi[12]['inputs'],data[data.length-1].data,data[data.length-1].topics)[1];
                  let about   = msgpack.decode(that.wallet.web3.utils.hexToBytes(temp));

                  that._resetAvatar();

                  that.avatarData['erc20']  = r[2];
                  that.avatarData['price']  = that.wallet.web3.utils.fromWei(r[3].toString(),'ether');
                  for (var key in about)
                    that.commonJson[key] = about[key];

                  that.avatarUI.link        = that.wallet.option['network']['href']+"/address/"+that.avatarUI.address;
                  that.avatarUI.mode        = r[1].toLowerCase()==that.wallet.address().toLowerCase()?(price?2:1):3;
                  that.avatarUI.communities = false;
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
        let about = this._json();
        let data  = null;
        let erc20 = this.wallet.web3.utils.isAddress(this.avatarData['erc20'])?this.avatarData['erc20']:'0x0';
        let price = this.wallet.web3.utils.toWei(this.avatarData['price'],'ether');

        if(this.avatarUI.mode==0)
          data  = this.wallet.contract[aMgr.address].c.methods.create(erc20,price,this.wallet.web3.utils.bytesToHex(msgpack.encode(about))).encodeABI();
        else if(this.avatarUI.mode==1)
          data  = this.wallet.contract[aMgr.address].c.methods.store(this.avatarUI.address,this.wallet.web3.utils.bytesToHex(msgpack.encode(about))).encodeABI();
        else if(this.avatarUI.mode==2)
          data  = this.wallet.contract[aMgr.address].c.methods.price(this.avatarUI.address,price).encodeABI();

        this._sendTx(aMgr.address,this.common.password,0,data);
      },
      searchAvatar () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this.showModal('Your avatar stores','md','dark','now loading...');
          this._searchOwner(aMgr.address,aMgr.abi[11]['signature'],(list)=>{
            if(list.length>0) {
              this.updateModalHtml('');
              for(let i = list.length-1 ; i >= 0  ; i--)
                this.modal.items.push({'key':list[i].key,'callback0':(key)=>{this.avatarUI.address=key;this.showEditAvatar(true);},'callback1':(key)=>{this.avatarUI.address=key;this.showEditAvatar(false);}});
            } else
              this.updateModalHtml('Empty');
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

          this.$refs.refModalStore.show();
        }
      },
      _createStore() {
        let about       = this._json();
        let data        = null;
        let erc20       = this.wallet.web3.utils.isAddress(this.storeData['erc20'])?this.storeData['erc20']:'0x0';
        let share       = parseInt(this.storeData['share']*100);
        let shareStart  = this.wallet.web3.utils.toWei(this.storeData['shareStart'],'ether');

        if(this.storeUI.mode==0)
          data  = this.wallet.contract[sMgr.address].c.methods.store(this.wallet.web3.utils.bytesToHex(msgpack.encode(about)),share,shareStart,erc20).encodeABI();

        this._sendTx(sMgr.address,this.common.password,0,data);
      },
      searchStore () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this.showModal('Your contents stores','md','dark','now loading...');
          this._searchOwner(sMgr.address,sMgr.abi[7]['signature'],(list)=>{
            if(list.length>0) {
              for(let i = list.length-1 ; i >= 0  ; i--)
                this.modal.items.push({'key':list[i].key,'callback0':(key)=>{this.storeUI.address=key;this.showEditStore(true);},'callback1':(key)=>{this.storeUI.address=key;this.showEditStore(false);}});
              this.updateModalHtml('');
            } else
              this.updateModalHtml('Empty');
          });
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      //-------------------------------- Store
      //-------------------------------- Pack
      //-------------------------------- Pack
      //-------------------------------- Creator
      showCreateCreator () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this._resetJson();

          this.creatorUI.address    = '';
          this.creatorUI.link       = '';
          this.creatorUI.mode       = 0;
          this.creatorUI.communities= false;
          this.$refs.refModalCreator.show();
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      showEditCreator () {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this._resetJson();

          // todo : loading data

          this.creatorUI.link         = this.wallet.option['network']['href']+"/address/"+this.creatorUI.address;
          this.creatorUI.mode         = this.wallet.web3&&this.wallet.isAddress()?1:2;  // todo : for test
          this.creatorUI.communities  = false;

          this.$refs.refModalCreator.show();
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      _createCreator() {
        let about = this._json();
        let data  = null;

        if(this.creatorUI.mode==0)
          data  = this.wallet.contract[sMgr.address].c.methods.creator(this.wallet.web3.utils.bytesToHex(msgpack.encode(about))).encodeABI();

        this._sendTx(sMgr.address,this.common.password,0,data);
      },
      searchCreator() {
        if(this.wallet.web3&&this.wallet.isAddress()) {
          this.showModal('Your creator accounts','md','dark','now loading...');
          this._searchOwner(sMgr.address,sMgr.abi[6]['signature'],(list)=>{
            if(list.length>0) {
              for(let i = list.length-1 ; i >= 0  ; i--)
                this.modal.items.push({'key':list[i].key,'callback0':(key)=>{this.creatorUI.address=key;this.showEditCreator();}});
              this.updateModalHtml('');
            } else
              this.updateModalHtml('Empty');
          });
        } else
          this.showModal('Alert','sm','warning',"Login wallet please.");
      },
      //-------------------------------- Creator
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
  template: '<b-input-group size="sm" class="mb-1"><b-form-input :value="item.key" readonly></b-form-input><b-input-group-append><b-btn size="sm" :v-if="!item.callback0" v-on:click="item.callback0(item.key);"><i class="fas fa-file-invoice-dollar"></i></b-btn><b-btn size="sm" :v-if="!item.callback1" v-on:click="item.callback1(item.key);"><i class="fas fa-file-signature"></i></b-btn></b-input-group-append></b-input-group>'
});
Vue.component('mainvue', main);

new Vue({
  el: '#mainvue'
});
