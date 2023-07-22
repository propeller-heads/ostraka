// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Ostraka.sol";

contract OstrakaTest is Test {
    Ostraka public ostraka;

    function setUp() public {
        ostraka = new Ostraka();
    }

    function testAddOptions() public {
        // Define the options to add
        string[] memory descriptions = new string[](2);
        descriptions[0] = "Option 1";
        descriptions[1] = "Option 2";

        // Call the addOptions function
        ostraka.addOptions(descriptions);

        // Retrieve the options and check they match what we added
        OptionPool memory option0 = ostraka.optionPools(0);
        OptionPool memory option1 = ostraka.optionPools(1);

        assertEq(option0.description, "Option 1", "Option 0 description does not match");
        assertEq(option1.description, "Option 2", "Option 1 description does not match");
    }
}
