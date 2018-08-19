pragma solidity ^0.4.24;

contract ERC20Interface {
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
}

contract _SimplePay {
    modifier onlyWallet() {
        require(isWallet());
        _;
    }
    function erc20() public constant returns (address);
    function isWallet() public constant returns (bool);

    function payFromWallet(uint tokens, uint256[] options) payable public;
    function payFromWallet(uint tokens, bytes _msgPack) payable public;
    function pay(uint tokens, uint256[] options) payable public;
    function pay(uint tokens, bytes _msgPack) payable public;
}

contract Wallet {
    address public                          owner;
    address public                          newOwner;
    mapping (address => uint256) private    allowed;

    event OWNER(address indexed _from, address indexed _to);
    constructor() public {
        owner     = msg.sender;
        emit OWNER(address(0),owner);
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // --------------------------------------------------------
    // owership transfer
    // --------------------------------------------------------
    function transferOwner(address _next) onlyOwner public {
        newOwner = _next;
    }
    function confirmTransferOwner() public {
        require(msg.sender == newOwner);
        emit OWNER(owner, newOwner);
        owner       = newOwner;
        newOwner   = address(0);
    }
    function undoTransferOwner() onlyOwner public {
        newOwner   = address(0);
    }
    // --------------------------------------------------------

    //-------------------------------------------------------
    // erc20 interface
    //-------------------------------------------------------
    function balanceOf(address _erc20) public constant returns (uint balance) {
        if(_erc20==address(0))
            return address(this).balance;
        return ERC20Interface(_erc20).balanceOf(this);
    }
    function transfer(address _erc20, address _to, uint _tokens) onlyOwner public returns (bool success) {
        require(balanceOf(_erc20)>=_tokens);
        if(_erc20==address(0))
            _to.transfer(_tokens);
        else
            return ERC20Interface(_erc20).transfer(_to,_tokens);
        return true;
    }
    function approve(address _erc20, address _spender, uint _tokens) onlyOwner public returns (bool success) {
        if(_erc20==address(0))
            return false;
        return ERC20Interface(_erc20).approve(_spender,_tokens);
    }

    //-------------------------------------------------------
    // pay interface
    //-------------------------------------------------------
    function pay(address _store, uint _tokens, uint256[] _options) onlyOwner public {
        address erc20 = _SimplePay(_store).erc20();
        transfer(erc20,_store,_tokens);
        _SimplePay(_store).payFromWallet(_tokens,_options);
    }
    function pay(address _store, uint _tokens, bytes _msgPack) onlyOwner public {
        address erc20 = _SimplePay(_store).erc20();
        transfer(erc20,_store,_tokens);
        _SimplePay(_store).payFromWallet(_tokens,_msgPack);
    }
}
