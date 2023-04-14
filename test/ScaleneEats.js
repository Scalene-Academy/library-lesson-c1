const { expect } = require("chai");

describe("ScaleneEats contract", function () {
  let owner, driver, secondDriver;
  let scaleneEats, eatToken;

  beforeEach(async () => {
    // Get accounts
    [owner, driver, secondDriver] = await ethers.getSigners();

    // Deploy contracts
    const EatToken = await ethers.getContractFactory("EatToken");

    eatToken = await EatToken.deploy();

    const ScaleneEats = await ethers.getContractFactory("ScaleneEats");

    scaleneEats = await ScaleneEats.deploy(eatToken.address);

    // Grant approval to ScaleneEats contract to spend storeOwners token
    await eatToken.approve(scaleneEats.address, 15);
  });

  // Sanity check for modifying stuff that is not meant to be modified
  it("Should create 3 orders", async function () {
    expect(await scaleneEats.numOrders()).to.equal(3);
  });

  // Happy path without testing the `requirements`

  it("Should accept an order", async function () {
    await scaleneEats.connect(driver).acceptOrder(0);
    const order = await scaleneEats.orders(0);
    expect(order.accepted).to.equal(true);
    expect(order.driver).to.equal(await driver.address);
  });

  it("Should mark an order as failed", async function () {
    await scaleneEats.connect(driver).acceptOrder(1);
    await scaleneEats.connect(driver).markFailed(1);
    const order = await scaleneEats.orders(1);
    expect(order.failed).to.equal(true);
  });

  it("Should mark an order as delivered", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await scaleneEats.connect(driver).markDelivered(2);
    const order = await scaleneEats.orders(2);
    expect(order.delivered).to.equal(true);
  });

  it("Upon successful delivery of an order, the driver should receive 5 $EAT tokens as a reward", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await scaleneEats.connect(driver).markDelivered(2);
    expect(Number(await eatToken.balanceOf(driver.address))).to.equal(5);
  });

  // Accept Order Conditions

  it("A driver can only accept an order if it has not already been accepted by another driver", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await expect(
      scaleneEats.connect(secondDriver).acceptOrder(2)
    ).to.be.revertedWith("Order has already been accepted");
  });

  // Deliver Order Conditions

  it("Should not be able to mark an order with delivered if driver is not the one who accepted the order", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await expect(
      scaleneEats.connect(secondDriver).markDelivered(2)
    ).to.be.revertedWith("Only the driver can mark an order as delivered");
  });

  it("Should not mark an order as delivered that has already been delivered", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await scaleneEats.connect(driver).markDelivered(2);
    await expect(
      scaleneEats.connect(driver).markDelivered(2)
    ).to.be.revertedWith("Order has already been delivered");
  });

  it("Should not be able to mark an order with delivered if the order has been failed", async function () {
    await scaleneEats.connect(driver).acceptOrder(1);
    await scaleneEats.connect(driver).markFailed(1);
    await expect(
      scaleneEats.connect(driver).markDelivered(1)
    ).to.be.revertedWith("Order has already been failed");
  });

  it("Should not mark an order as delivered that exceeds the delivery time limit", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await ethers.provider.send("evm_increaseTime", [1900]);
    await ethers.provider.send("evm_mine");
    await expect(
      scaleneEats.connect(driver).markDelivered(2)
    ).to.be.revertedWith("Delivery time has exceeded the maximum limit");
  });

  // Failed Order Conditions

  it("Should not be able to mark an order with failed if driver is not the one who accepted the order or not the store owner", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await expect(
      scaleneEats.connect(secondDriver).markFailed(2)
    ).to.be.revertedWith(
      "Only the store owner and driver can mark an order as failed"
    );
  });

  it("Should not mark an order as failed that has already been delivered", async function () {
    await scaleneEats.connect(driver).acceptOrder(2);
    await scaleneEats.connect(driver).markDelivered(2);
    await expect(scaleneEats.connect(driver).markFailed(2)).to.be.revertedWith(
      "Order has already been delivered"
    );
  });

  it("Should not mark an order as failed that has already been failed", async function () {
    await scaleneEats.connect(driver).acceptOrder(1);
    await scaleneEats.connect(driver).markFailed(1);
    await expect(scaleneEats.connect(driver).markFailed(1)).to.be.revertedWith(
      "Order has already been failed"
    );
  });
});
