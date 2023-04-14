// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// We are using this library to make our $EAT token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract EatToken is ERC20 {
    constructor() ERC20("Eat Token", "EAT") {
        _mint(msg.sender, 15);
    }
}

contract ScaleneEats {
    // Define the Order struct
    struct Order {
        // Define the order variables
        string name; // The name of the order
        address driver; // The driver assigned to the order, or 0x0 if no driver has been assigned
        bool accepted; // Whether the order has been accepted by a driver
        bool failed; // Whether the order has been failed by the store owner or driver
        bool delivered; // Whether the order has been delivered
        uint256 deliveryTime; // The time that the driver accepted the order, in seconds since the Unix epoch
    }

    // Define the variables
    address storeOwner;
    mapping(uint => Order) public orders;
    uint256 public numOrders = 0;
    uint256 public deliveryTimeLimit = 1800; // 30 minutes in seconds

    // Define the EatToken contract
    EatToken public eatToken;

    // DO NOT MODIFY ME
    constructor(address eatTokenAddress) {
        // Create the $EAT token
        eatToken = EatToken(eatTokenAddress);
        // Set the store owner as the one who deployed this contract
        storeOwner = msg.sender;

        // Create 3 orders
        createOrder("Burger");
        createOrder("Pho");
        createOrder("KFC");
    }

    // DO NOT MODIFY ME
    function createOrder(string memory name) private {
        orders[numOrders] = Order({
            name: name,
            driver: address(0),
            accepted: false,
            delivered: false,
            failed: false,
            deliveryTime: 0
        });
        numOrders++;
    }

    // --- ONLY MODIFY UNDER THIS LINE --- //

    // @IMPLEMENT ME
    function acceptOrder(uint orderNumber) public {}

    // @IMPLEMENT ME
    function markFailed(uint orderNumber) public {}

    // @IMPLEMENT ME
    function markDelivered(uint orderNumber) public {
        // Hint: Look into ERC20 (Token) functions here to figure out how to transfer the 5 $EAT tokens to the driver - https://solidity-by-example.org/app/erc20/
    }
}
