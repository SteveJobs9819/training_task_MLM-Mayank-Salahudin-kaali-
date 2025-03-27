const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const MLM = await hre.ethers.getContractFactory("MLM");

    // Deploy the contract
    const mlm = await MLM.deploy();

    // Wait for deployment to finish
    await mlm.waitForDeployment();

    // Log the deployed contract address
    console.log("MLM contract deployed to:", await mlm.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
