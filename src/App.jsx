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
    const { contract: token } = useContract('0x0725924b2ff17d00b8a5ee5318dc034f61a1968a', 'token');
    // Hook to check if the user has our NFT
    const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")
    const hasClaimedNFT = useMemo(() => {
        return nftBalance && nftBalance.gt(0)
    }, [nftBalance])

    //添加检索DAO成员持币情况
    // Holds the amount of token each member has in state.
    const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
    const [memberAddresses, setMemberAddresses] = useState([]);
// A fancy function to shorten someones wallet address, no need to show the whole thing.
    const shortenAddress = (str) => {
        return str.substring(0, 6) + '...' + str.substring(str.length - 4);
    };
// This useEffect grabs all the addresses of our members holding our NFT.

// This useEffect grabs all the addresses of our members holding our NFT.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
        // with tokenId 0.
        const getAllAddresses = async () => {
            try {
                const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
                    0,
                );
                setMemberAddresses(memberAddresses);
                console.log('🚀 Members addresses', memberAddresses);
            } catch (error) {
                console.error('failed to get member list', error);
            }
        };
        getAllAddresses();
    }, [hasClaimedNFT, editionDrop?.history]);

// This useEffect grabs the # of token each member holds.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        const getAllBalances = async () => {
            try {
                const amounts = await token?.history.getAllHolderBalances();
                setMemberTokenAmounts(amounts);
                console.log('👜 Amounts', amounts);
            } catch (error) {
                console.error('failed to get member balances', error);
            }
        };
        getAllBalances();
    }, [hasClaimedNFT, token?.history]);

    // Now, we combine the memberAddresses and memberTokenAmounts into a single array
    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            // We're checking if we are finding the address in the memberTokenAmounts array.
            // If we are, we'll return the amount of token the user has.
            // Otherwise, return 0.
            const member = memberTokenAmounts?.find(({ holder }) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || '0',
            };
        });
    }, [memberAddresses, memberTokenAmounts]);





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





    if (hasClaimedNFT) {
        return (
            <div className="member-page">
                <h1>DAO成员页面</h1>
                <p>恭喜你成为我们的一员</p>
                <div>
                    <div>
                        <h2>成员列表</h2>
                        <table className="card">
                            <thead>
                            <tr>
                                <th>地址</th>
                                <th>Token 数量</th>
                            </tr>
                            </thead>
                            <tbody>
                            {memberList.map((member) => {
                                return (
                                    <tr key={member.address}>
                                        <td>{shortenAddress(member.address)}</td>
                                        <td>{member.tokenAmount}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }


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
