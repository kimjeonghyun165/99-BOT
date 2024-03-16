import axios from "axios"
import { solInfo } from "../tokenInfo"

export const nftData = async (minlevel: string | null, maxlevel: string | null, minfaction: string | null, maxfaction: string | null) => {

    var url = "https://blackmarket.fidelion.io/api/v0/me/nfts?offset=0&limit=30&sortBy=price&sortDirection=asc&filterBy=lv-"
    url += minlevel + "," + maxlevel + "|factions-" + minfaction + "," + maxfaction

    const sol = await solInfo()

    const html = await axios.get(url)

    let offset = 0;
    let listingCount = 0;

    while (true) {
        var url = `https://blackmarket.fidelion.io/api/v0/me/nfts?offset=${offset}&limit=30&sortBy=price&sortDirection=asc&filterBy=lv-${minlevel || '1'},${maxlevel || '50'}|factions-${minfaction || '0'},${maxfaction || '8'}`;

        const html = await axios.get(url);

        if (!html.data.list || html.data.list.length === 0) {
            break;
        }

        const priceZeroItemIndex = html.data.list.findIndex(item => Number(item.nft.price) === 0);
        if (priceZeroItemIndex !== -1) {
            listingCount += priceZeroItemIndex;
            break;
        }

        listingCount += html.data.list.length;
        offset += 30;
    }

    const level = html.data.list[0].nft.level
    const price = Number(html.data.list[0].nft.price)
    const krwPrice = Number((price * sol.solPrice).toFixed(0)).toLocaleString('en')
    const count = html.data.totalCount.toLocaleString('en')
    const listing = listingCount.toLocaleString('en')
    const faction = html.data.list[0].nft.factions

    return { price, count, krwPrice, faction, level, listing }

}