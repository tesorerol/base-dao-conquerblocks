// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLockConquerDao is TimelockController {
    constructor(
        uint256 _minDaly, 
        address[] memory _proposers, 
        address[] memory _executers 
    ) TimelockController(_minDaly,_proposers,_executers){}
}