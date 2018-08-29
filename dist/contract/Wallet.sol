pragma solidity ^0.4.24;

contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract _ERC20Interface {
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
}

contract _ApproveAndCallFallBack {
    function () public payable {revert();}  // Don't accept ETH
    function erc20() public constant returns (address);
    function spender() public constant returns (address);
    function receiveApproval(uint256[] _data) payable public;
    function receiveApproval(bytes _msgPack) payable public;
}

contract Wallet {
    address public                          owner;
    address public                          newOwner;
    mapping (address => uint256) private    allowed;

    event OWNER(address indexed _from, address indexed _to);
    constructor(address _owner) public {
        if(_owner==address(0))
            owner     = msg.sender;
        else
            owner     = _owner;
        emit OWNER(address(0),owner);
    }
    function () public payable {}

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
        return _ERC20Interface(_erc20).balanceOf(this);
    }
    function transfer(address _erc20, address _to, uint _tokens) onlyOwner public returns (bool success) {
        require(balanceOf(_erc20)>=_tokens);
        if(_erc20==address(0))
            _to.transfer(_tokens);
        else
            return _ERC20Interface(_erc20).transfer(_to,_tokens);
        return true;
    }

    function approve(address _erc20, address _spender, uint _tokens) onlyOwner public returns (bool success) {
        require(_erc20 != address(0));
        return _ERC20Interface(_erc20).approve(_spender,_tokens);
    }

    //-------------------------------------------------------
    // pay interface
    //-------------------------------------------------------
    function pay(address _store, uint _tokens, uint256[] _options) onlyOwner public {
        address erc20   = _ApproveAndCallFallBack(_store).erc20();
        address spender = _ApproveAndCallFallBack(_store).spender();
        if(erc20 == address(0)) {
            transfer(erc20,spender,_tokens);
            _ApproveAndCallFallBack(_store).receiveApproval(_options);
        } else {
            _ERC20Interface(erc20).approve(spender,_tokens);
            _ApproveAndCallFallBack(_store).receiveApproval(_options);
        }
    }
    function pay(address _store, uint _tokens, bytes _msgPack) onlyOwner public {
        address erc20   = _ApproveAndCallFallBack(_store).erc20();
        address spender = _ApproveAndCallFallBack(_store).spender();
        if(erc20 == address(0)) {
            transfer(erc20,spender,_tokens);
            _ApproveAndCallFallBack(_store).receiveApproval(_msgPack);
        } else {
            _ERC20Interface(erc20).approve(spender,_tokens);
            _ApproveAndCallFallBack(_store).receiveApproval(_msgPack);
        }
    }
}

contract _Manager {
    function owner(address _contract) constant public returns (address);
}
contract _Base {
    address internal                manager;

    constructor(bytes _msgPack) public {
        manager     = msg.sender;
        emit INFO(_msgPack);
    }

    modifier onlyOwner() {
        require(msg.sender==_Manager(manager).owner(this));
        _;
    }

    // register information
    event INFO(bytes _msgPack);
    function info(bytes _msgPack) onlyOwner public {
        emit INFO(_msgPack);
    }
}
