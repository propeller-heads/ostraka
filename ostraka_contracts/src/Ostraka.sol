// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";

import "sismo-connect-solidity/SismoConnectLib.sol";

// Holds information about the votes of a content
struct VotingPool {
    uint256 positiveVotes;
    uint256 negativeVotes;
    string content; // a URL from the interwebz
}

contract Ostraka is SismoConnect {
    struct Vote {
        bool signal;
        address senderAddress;
    }

    // Maps from hash of content to a VotingPool
    mapping(bytes32 => VotingPool) private votingPools;

    //worldcoin
    IWorldID internal immutable worldId;

    error InvalidProof();
    error AlreadyVoted();

    // TODO: Remove this
    bool private _isImpersonationMode = true;
    bytes16 private _sismoAppId = 0x4a4e9fbd4e3e4d58a57a504a40611c85;
    string private _worldcoinAppID = "app_staging_68cbb33784d54d3b69de47b29857af3e";

    using ByteHasher for bytes;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal worldcoinNullifierHashes;

    // Sismo Connect
    using SismoConnectHelper for SismoConnectVerifiedResult;

    ClaimRequest claim;
    mapping(uint256 => bool) internal sismoNullifierHashes;

    constructor(IWorldID _worldId)
        SismoConnect(buildConfig(_sismoAppId, _isImpersonationMode)) // <--- Sismo Connect constructor
    {
        worldId = _worldId;
        externalNullifier = abi.encodePacked(_worldcoinAppID).hashToField();
    }

    function checkWorldcoinProof(
        address worldcoinSignal,
        uint256 worldcoinRoot,
        uint256 worldcoinNullifierHash,
        uint256[8] calldata worldcoinProof
    ) internal returns (bool) {
        if (worldcoinNullifierHashes[worldcoinNullifierHash]) {
            revert InvalidProof();
        }

        worldId.verifyProof(
            worldcoinRoot,
            groupId,
            abi.encodePacked(worldcoinSignal).hashToField(),
            worldcoinNullifierHash,
            externalNullifier,
            worldcoinProof
        );

        worldcoinNullifierHashes[worldcoinNullifierHash] = true;

        return true;
    }

    function checkSismoProof(bytes memory sismoConnectResponse) internal returns (bool) {
        SismoConnectVerifiedResult memory result =
            verify({responseBytes: sismoConnectResponse, claim: claim, auth: buildAuth({authType: AuthType.VAULT})});

        uint256 user = result.getUserId(AuthType.VAULT);

        if (sismoNullifierHashes[user] == true) {
            return false;
        }
        sismoNullifierHashes[user] = true;

        return true;
    }

    function vote(
        bytes memory sismoConnectResponse,
        bytes memory sismoMessage,
        address worldcoinSignal,
        uint256 worldcoinRoot,
        uint256 worldCoinNullifierHash,
        uint256[8] calldata worldcoinProof
    ) external {
        require(checkWorldcoinProof(worldcoinSignal, worldcoinRoot, worldCoinNullifierHash, worldcoinProof));
        require(checkSismoProof(sismoConnectResponse));
        _vote(sismoMessage);
    }

    function _vote(bytes memory sismoMessage) internal {
        (bool signal, string memory content) = decodeVote(sismoMessage);
        bytes32 content_key = keccak256(abi.encodePacked(content));

        // if hash of content is not in the voting pool map, add it
        if (votingPools[content_key].positiveVotes == 0 && votingPools[content_key].negativeVotes == 0) {
            votingPools[content_key] = VotingPool({content: content, positiveVotes: 0, negativeVotes: 0});
        }

        // if signal is true, increment positive votes, else increment negative votes
        if (signal) {
            votingPools[content_key].positiveVotes++;
        } else {
            votingPools[content_key].negativeVotes++;
        }
    }

    function decodeVote(bytes memory encodedMessage) internal pure returns (bool signal, string memory content) {
        // Decoding the encodedMessage.
        (signal, content) = abi.decode(encodedMessage, (bool, string));
        return (signal, content);
    }

    function getVotingPool(string memory content) external view returns (VotingPool memory) {
        bytes32 content_key = keccak256(abi.encodePacked(content));
        return votingPools[content_key];
    }
}
