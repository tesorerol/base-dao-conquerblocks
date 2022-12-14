// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract ConquerTokenDao is ERC20Votes  {
    constructor(string memory _name, string memory _symbol, uint256 _supply) ERC20(_name,_symbol) ERC20Permit(_name) {
     _mint(msg.sender,_supply);
    }

    function _afterTokenTransfer(address from,address to,uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        // se usa luego de que emites tu voto, quemar o eliminar esa cantidad de votos
        // 1000Votes -> 10Votes, 990Votes
        super._burn(account, amount);
    }
    
}