import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        // This is the address of our ERC-20 contract printed out in the step before.
        const token = await sdk.getContract("0x0725924b2ff17d00B8a5EE5318Dc034F61A1968a", "token");
        // What's the max supply you want to set? 1,000,000 is a nice number!
        const amount = 1_000_000;
        // Interact with your deployed ERC-20 contract and mint the tokens!
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        // Print out how many of our token's are out there now!
        console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation");
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();
