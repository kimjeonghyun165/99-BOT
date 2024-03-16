import axios from "axios"

export const findOwner = async (wallet: string) => {
    try {
        const url = `https://api-mainnet.magiceden.dev/v2/wallets/${wallet}/tokens?collection_symbol=fidelion`
        const response = await axios(url)
        const fidelionOwners = response.data.map((item: any) => item.name);
        return fidelionOwners;
    }
    catch (e) { console.log(e) }
}