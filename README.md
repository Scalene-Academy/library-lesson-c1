## Building a Smart Contract for ScaleneEats

In this lesson, you will build a smart contract that mimics the functionality of Uber Eats for delivering food and rewarding drivers with an imaginary token for successful deliveries.

### Problem Statement

You are tasked with building a smart contract that allows drivers to:

1. Accept orders from the store owner, which assigns it to them
2. Mark them failed
3. Successfully deliver it which funds them with an imaginary token.

As Scalene prioritizes customer happiness, all deliveries must be delivered to the customer in a satisfactory amount of time.

### Requirements

`acceptOrder`

- The order should not have already been accepted.
- The `msg.sender` should be the driver assigned to the order.

`markFailed`

- The `msg.sender` should be either the store owner or the driver assigned to the order.
- The order should not have already been delivered.
- The order should not have already been marked as failed.

`markDelivered`

- The `msg.sender` should be the driver assigned to the order.
- The order should not have already been delivered.
- The order should not have already been marked as failed.
- The delivery time should not have exceeded the maximum limit (30 minutes)

Hint: Look into the `require` statements of Solidity to achieve these and to pass the tests - also look at the `ScaleneEats.js` test file to see what revert reasons to use.

### Instructions

1. Fork and clone the repository from the ScaleneEats repo.
2. Ensure that you have `npm` installed and run `npm install` to install all the relevant packages needed to run this activity.
3. Open the `ScaleneEats.sol` file in your code editor.
4. Implement the `acceptOrder` function which assigns the order to the driver who accepts it.
5. Implement the `markFailed` function which marks the order as failed if the driver is unable to deliver it.
6. Implement the `markDelivered` function which marks the order as successfully delivered and funds the driver with an imaginary token only if the preconditions are met.
7. Run the unit tests to ensure that the functions work correctly and meet requirements.
8. When unit tests all pass, commit your code and push it up to the Github Classroom (PS: NO CHANGING TEST - I'M WATCHING YOU)

To ensure comprehensive testing, we have included a test coverage script (`npm run test:coverage`). It is crucial to strive for 100% coverage of your smart contract code in order to maintain the highest level of security and reliability. Some caveats of using coverage tests can be found in the [solidity-coverage README](https://github.com/sc-forks/solidity-coverage/blob/master/HARDHAT_README.md#usage).

### Resources

- [Solidity Documentation](https://docs.soliditylang.org/en/v0.8.19/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/4.x/)

Good luck with the lesson!
