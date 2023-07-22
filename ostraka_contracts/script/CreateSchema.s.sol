// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@lib/eas-contracts/contracts/ISchemaRegistry.sol";
import "@lib/eas-contracts/contracts/resolver/ISchemaResolver.sol";

contract CreateSchema is Script {
    function run() external {
        ISchemaRegistry schemaRegistry = ISchemaRegistry(0x7b24C7f8AF365B4E308b6acb0A7dfc85d034Cb3f);
        ISchemaResolver resolver;
        string memory schema = "bool signal, string content";

        vm.startBroadcast();
        schemaRegistry.register(schema, resolver, false);
        vm.stopBroadcast();
    }
}
