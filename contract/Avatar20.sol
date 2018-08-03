pragma solidity ^0.4.24;

contract ERC20Interface {
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
}

contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
}

contract Avatar20 is SafeMath{
    address                     manager;
    address                     erc20;
    uint256                     price;
    uint256                     index;      // for asset

    uint256                     totalSupply;
    mapping(address=>uint256)   coupons;

    address                     updater;
    mapping(address=>uint256)   ranks;
    mapping(address=>uint256)   badgeFlags; // (1~255)

    constructor(address _erc20, uint256 _price, bytes _msgPack) public {
        manager     = msg.sender;
        erc20       = _erc20;
        price       = _price;

        emit INFO(_msgPack);
    }

    modifier onlyOwner() {
        require(msg.sender==Manager(manager).owner());
        _;
    }

    // about
    function about() constant public returns (bool, address,uint256,uint256,uint256,uint256,uint256) {
        return (Manager(manager).copyright(),erc20,price,coupons[msg.sender],totalSupply,ranks[msg.sender],badgeFlags[msg.sender]);
    }

    // register information
    event INFO(bytes _msgPack);
    function info(bytes _msgPack) onlyOwner public {
        emit INFO(_msgPack);
    }

    // register asset
    event ASSET(uint256 indexed _category, uint256 indexed _index, bytes _img);
    function asset(uint256 _category, bytes _image) onlyOwner public {
        emit ASSET(_category,index,_image);
        index   = safeAdd(index,1);
    }
    event BADGE(uint8 indexed _index, string _title, bytes _img);
    function badge(uint8 _index, string _title, bytes _image) onlyOwner public {
        require(_index>0);
        emit BADGE(_index,_title,_image);
    }

    // coupon
    event COUPON(address indexed _to, uint256 _count);
    function coupon(address _to, uint256 _count) onlyOwner public {
        coupons[_to]    = safeAdd(coupons[_to],_count);
        totalSupply     = safeAdd(totalSupply,_count);
        emit COUPON(_to,_count);
    }

    // change price
    function newPrice(uint256 _price) onlyOwner public {
        price       = _price;
    }

    // updater
    modifier onlyUpdater() {
        require (msg.sender==updater);
        _;
    }
    function setUpdater(address _updater) onlyOwner public {
        updater = _updater;
    }
    // update ranks. (how to update ranks??)
    function rank(address _user, uint256 _rank) onlyUpdater public {
        ranks[_user]        = _rank;
    }
    // update badge (how to add badges??)
    function badge(address _user, uint256 _badge) onlyUpdater public {
        badgeFlags[_user]   |=_badge;
    }

    // register Avatar
    event AVATAR (address indexed _user, uint256 _price);
    function avatar(bytes _msgPack) payable public {
        require(Manager(manager).copyright());
        require(((erc20==address(0)?msg.value:ERC20Interface(erc20).allowance(msg.sender,this))==price)||(coupons[msg.sender]>0));

        uint256 pay = (erc20==address(0)?msg.value:ERC20Interface(erc20).allowance(msg.sender,this));

        if(price>0) {
            if(pay==0&&(coupons[msg.sender]>0)) {
                coupons[msg.sender] = safeSub(coupons[msg.sender],1);
                totalSupply         = safeSub(totalSupply,1);
            } else if(erc20!=address(0)) {
                ERC20Interface(erc20).transferFrom(msg.sender,Manager(manager).owner(),price);
            }
        }

        Manager(manager).avatar(msg.sender,_msgPack);
        emit AVATAR(msg.sender,pay);
    }
}

contract Manager {
    struct _info {
        address     owner;
        bool        copyright;
    }
    address                     master;
    mapping(address=>_info)     infos;

    constructor() public {
        master = msg.sender;
    }

    modifier onlyMaster() {
        require(msg.sender==master);
        _;
    }
    modifier onlyOwner(address _contract) {
        require(msg.sender==infos[_contract].owner);
        _;
    }

    function newMaster(address _next) onlyMaster public {
        require(_next!=address(0)&&_next!=address(this)&&_next!=master);
        master = _next;
    }

    function owner() constant public returns (address) {
        return infos[msg.sender].owner;
    }
    function copyright() constant public returns (bool) {
        return infos[msg.sender].copyright;
    }

    // create Shop
    event TOKEN(address indexed _contract, address indexed _erc20);
    function store(address _erc20, uint256 _price, bytes _msgPack) public {
        address temp            = new Avatar20(_erc20,_price,_msgPack);
        infos[temp].owner       = msg.sender;
        infos[temp].copyright   = true;
        emit OWNER(temp,msg.sender,address(0));
        emit TOKEN(temp,_erc20);
    }

    // change copyright
    function enable(address _contract, bool _enable) onlyMaster public {
        infos[_contract].copyright  = _enable;
    }

    // change Owner
    event OWNER(address indexed _contract, address indexed _to, address indexed _from);
    function newOwner(address _contract, address _next) onlyOwner(_contract) public {
        emit OWNER(_contract,_next,infos[_contract].owner);
        infos[_contract].owner  = _next;
    }

    // register Script
    event SCRIPT(address indexed _contract, bytes _script);
    function custom(address _contract, bytes _script) onlyOwner(_contract) public {
        emit SCRIPT(_contract,_script);
    }
    function script(bytes _script) onlyMaster public {
        emit SCRIPT(address(0),_script);
    }

    // register Avatar
    event AVATAR (address indexed _user, address indexed _contract, bytes _msgPack);    //
    function avatar(address _user, bytes _msgPack) public {
        require(infos[msg.sender].copyright&&infos[msg.sender].owner!=address(0));
        emit AVATAR(_user,msg.sender,_msgPack);
    }
}
