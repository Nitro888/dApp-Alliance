pragma solidity ^0.4.24;

contract ERC20Interface {
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);
}

contract SimplePay {
    modifier onlyWallet() {
        require(isWallet());
        _;
    }
    function erc20() public constant returns (address);
    function isWallet() public constant returns (bool);
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

    // --------------------------------------------------------
    // eth & erc20 interface
    // --------------------------------------------------------
    function balanceOf(address _erc20, address _tokenOwner) public constant returns (uint balance) {
        if(_erc20==address(0))
            return address(this).balance;
        return ERC20Interface(_erc20).balanceOf(_tokenOwner);
    }
    function transfer(address _erc20, address _to, uint _tokens) public returns (bool success) {
        require(balanceOf(_erc20,this)>=_tokens);
        if(_erc20==address(0))
            _to.transfer(_tokens);
        else
            return ERC20Interface(_erc20).transfer(_to,_tokens);
        return true;
    }
    function pay(address _store, uint _tokens, uint256[] _options) onlyOwner public {
        address erc20 = SimplePay(_store).erc20();
        transfer(erc20,_store,_tokens);
        SimplePay(_store).pay(_tokens,_options);
    }
    function pay(address _store, uint _tokens, bytes _msgPack) onlyOwner public {
        address erc20 = SimplePay(_store).erc20();
        transfer(erc20,_store,_tokens);
        SimplePay(_store).pay(_tokens,_msgPack);
    }
}
