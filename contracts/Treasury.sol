// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 public totalFunds; // 0 // 1000 eth
    address public payee; // 0x000000000
    bool public isReleased; // false

    constructor(address _payee){
        payee = _payee;
        totalFunds = msg.value;
        isReleased = false;
    }

    function releaseFunds() public onlyOwner {
        isReleased = true;
        payable(payee).transfer(totalFunds);
    }
}