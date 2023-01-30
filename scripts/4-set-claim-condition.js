import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x206Cb0989465947ACdb5f6041809AD68FFaF5284", "edition-drop");
        // We define our claim conditions, this is an array of objects because
        // we can have multiple phases starting at different times if we want to
        const claimConditions = [{
            // When people are gonna be able to start claiming the NFTs (now)
            startTime: new Date(),
            // The maximum number of NFTs that can be claimed.
            maxClaimable: 50_000,
            // The price of our NFT (free)
            price: 0.001,
            // The amount of NFTs people can claim in one transaction.
            maxClaimablePerWallet: 2,
            // We set the wait between transactions to unlimited, which means
            // people are only allowed to claim once.
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("✅ Sucessfully set claim condition!");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();
