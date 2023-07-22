// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Ostraka.sol";
import "../lib/eas-contracts/contracts/ISchemaRegistry.sol";
import "eas-contracts/IEAS.sol";
import "forge-std/console.sol";

contract OstrakaExposed is Ostraka {
    constructor(IWorldID _worldId, IEAS _eas, bytes32 _schema_uid) public Ostraka(_worldId, _eas, _schema_uid) {}

    function exposedVote(bytes memory sismoMessage) external {
        _vote(sismoMessage);
    }

    function exposedAttestVote(bytes memory data) external returns (bytes32) {
        return attestVote(data);
    }
}

contract OstrakaTest is Test {
    OstrakaExposed public ostraka;
    string url = "https://www.google.com";

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("optimism_testnet"));
        // OPTIMISM TESTNET: 0xFc1315089316FcFe586a8E0a92873c258De8aaC1
        // GOERLI: 0x05C4AE6bC33e6308004a47EbFa99E5Abb4133f86
        IWorldID worldId = IWorldID(0xFc1315089316FcFe586a8E0a92873c258De8aaC1);
        // EAS OPTIMISM TESTNET: 0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84
        IEAS eas = IEAS(0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84);

        // Register our schema to EAS schema registry
        // Also optimism address
        ISchemaRegistry schemaRegistry = ISchemaRegistry(0x7b24C7f8AF365B4E308b6acb0A7dfc85d034Cb3f);
        ISchemaResolver resolver;
        string memory schema = "bool signal, string content";
        bytes32 schema_uid = schemaRegistry.register(schema, resolver, false);

        ostraka = new OstrakaExposed(worldId, eas, schema_uid);
    }

    function testVote() public {
        // Encode signal and content into a sismo message
        bytes memory sismoMessage = abi.encode(true, url);
        bytes memory sismoMessage2 = abi.encode(false, url);

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

    function testAttestVote() public {
        bytes memory sismoMessage = abi.encode(true, url);
        bytes32 attestation_id = ostraka.exposedAttestVote(sismoMessage);
        IEAS eas = IEAS(0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84);

        Attestation memory attestation = eas.getAttestation(attestation_id);

        assertEq(attestation.data, sismoMessage);
    }
}
