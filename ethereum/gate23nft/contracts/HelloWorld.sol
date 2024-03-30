// SPDX-License-Identifier: MIT
pragma solidity =0.8.7;

contract HelloWorld {
  string public hello;
  address public lastCaller;
  uint public N;

  event test(uint256 timestamp);

  constructor(string memory _hello) {
    hello = _hello;

    emit test(block.timestamp);
  }

  function setN(uint _N) public {
    N = _N;
    lastCaller = msg.sender;
  }
}
