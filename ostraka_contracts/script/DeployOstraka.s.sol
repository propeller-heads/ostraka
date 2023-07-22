// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@src/Ostraka.sol";

contract DeployOstraka is Script {
    function run() external {
        vm.startBroadcast();
        IWorldID worldId = IWorldID(0xFc1315089316FcFe586a8E0a92873c258De8aaC1);
        IEAS eas = IEAS(0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84);
        bytes32 _schema_uid = 0xabd8b6da87d2202eaa1364260ad96e0c83387c779d22309bc00f54272ecf5ef4;
        new Ostraka(worldId, eas, _schema_uid);
        vm.stopBroadcast();
    }
}
