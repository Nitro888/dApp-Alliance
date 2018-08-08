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
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract User {
    address internal                        updater;
    mapping(address=>uint256[2]) internal   status;

    modifier onlyUpdater() {
        require (msg.sender==updater);
        _;
    }

    // updater
    function setUpdater(address _updater) public;
    // update ranks. (how to update ranks??)
    function rank(address _user, uint256 _rank) onlyUpdater public {
        status[_user][0]   = _rank;
    }
    // update badge (how to add badges??)
    function badge(address _user, uint256 _badge) onlyUpdater public {
        status[_user][1]   |=_badge;
    }
    // about user
    function user() constant public returns (uint256[2]) {
        return (status[msg.sender]);
    }
}
