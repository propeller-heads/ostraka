// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import {ByteHasher} from "../helpers/ByteHasher.sol";
import {IWorldID} from "../interfaces/IWorldID.sol";

import "sismo-connect-solidity/SismoLib.sol";

contract Ostraka is SismoConnect {
    struct Vote {
        bool signal;
        address senderAddress;
    }

    //worldcoin
    IWorldID internal immutable worldCoinId;

    error InvalidProof();
    error AlreadyVoted();

    // TODO: Remove this
    bool private _isImpersonationMode = true;

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

    constructor(
        bytes16 _sismoAppId,
        bytes16 _sismoGroupId,
        address _collectModule,
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) SismoConnect(_sismoAppId) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();

        claim = buildClaim({groupId: _sismoGroupId});
        SismoConnect(buildConfig(_appId, _isImpersonationMode));
    }

    function checkWorldcoinProof(
        address worldcoinSignal,
        uint256 worldcoinRoot,
        uint256 worldcoinNullifierHash,
        uint256[8] calldata worldcoinProof
    ) internal returns (bool) {
        if (worldcoinNullifierHashes[worldcoinNullifierHash])
            revert InvalidProof();

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

    function checkSismoProof(
        bytes memory sismoConnectResponse,
        bytes signature
    ) internal returns (bool) {
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: sismoConnectResponse,
            claim: claim,
            auth: buildAuth({authType: AuthType.VAULT}),
            signature: buildSignature({message: signature})
        });

        uint256 vaultId = result.getUserId(AuthType.VAULT);

        if (sismoNullifierHashes[vaultId] == true) {
            return false;
        }
        sismoNullifierHashes[vaultId] = true;

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
        require(
            checkWorldcoinProof(
                worldcoinSignal,
                worldcoinRoot,
                worldCoinNullifierHash,
                worldcoinProof
            )
        );
        require(checkSismoProof(sismoConnectResponse));

        (bool signal, address receiver) = decodeVote(sismoMessage);
    }

    function decodeVote(
        bytes memory encodedMessage
    ) internal pure returns (bool signal, address senderAddress) {
        // Decoding the encodedMessage.
        (signal, senderAddress) = abi.decode(encodedMessage, (bool, address));
        return (signal, senderAddress);
    }
}
