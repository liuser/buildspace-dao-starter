import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x206Cb0989465947ACdb5f6041809AD68FFaF5284", "edition-drop");
        await editionDrop.createBatch([
            {
                name: "猴子岛",
                description: "一群有趣的猴子聚集在岛屿!",
                image: readFileSync("scripts/assets/headband.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})();
