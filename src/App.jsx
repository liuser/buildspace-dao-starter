import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
    // Use the hooks thirdweb give us.
    const address = useAddress();
    console.log("👋 Address:", address);

    // Initialize our Edition Drop contract
    const editionDropAddress = "0x206Cb0989465947ACdb5f6041809AD68FFaF5284"

    // Initialize our Edition Drop contract
    const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
    // Hook to check if the user has our NFT
    const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

    if (!address) {
        return (
            <div className="landing">
                <h1>欢迎来到猴子岛</h1>
                <div className="btn-hero">
                    <ConnectWallet />
                </div>
            </div>
        );
    }



    const hasClaimedNFT = useMemo(() => {
        return nftBalance && nftBalance.gt(0)
    }, [nftBalance])

    if (hasClaimedNFT) {
        return (
            <div className="member-page">
                <h1>猴子成员管理页面</h1>
                <p>恭喜你成为我们的一员</p>
            </div>
        );
    };


    // Render mint nft screen.
    return (
        <div className="mint-nft">
            <h1>获取你的猴子DAO NFT</h1>
            <div className="btn-hero">
                <Web3Button
                    contractAddress={editionDropAddress}
                    action={contract => {
                        contract.erc1155.claim(0, 1)
                    }}
                    onSuccess={() => {
                        console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
                    }}
                    onError={error => {
                        console.error("Failed to mint NFT", error);
                    }}
                >
                   获取你的猴子 (免费)
                </Web3Button>
            </div>
        </div>
    );
}

export default App;
