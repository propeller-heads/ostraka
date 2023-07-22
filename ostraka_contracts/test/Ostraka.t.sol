// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Ostraka.sol";

contract OstrakaExposed is Ostraka {
    constructor(IWorldID _worldId) public Ostraka(_worldId) {}

    function exposedVote(bytes memory sismoMessage) external {
        _vote(sismoMessage);
    }
}

contract OstrakaTest is Test {
    OstrakaExposed public ostraka;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"));
        IWorldID worldId = IWorldID(0x05C4AE6bC33e6308004a47EbFa99E5Abb4133f86);
        ostraka = new OstrakaExposed(worldId);
    }

    function testVote() public {
        string memory url = "https://www.google.com";
        // Encode signal and content into a sismo message
        bytes memory sismoMessage = abi.encode(true, url);
        bytes memory sismoMessage2 = abi.encode(false, url);
        // new VotingPool struct

        // Call the vote
        ostraka.exposedVote(sismoMessage);
        ostraka.exposedVote(sismoMessage);
        ostraka.exposedVote(sismoMessage2);

        // Check the voting pools
        VotingPool memory pool = ostraka.getVotingPool(url);

        assertEq(pool.positiveVotes, 2);
        assertEq(pool.negativeVotes, 1);
        assertEq(pool.content, url);
    }
}
