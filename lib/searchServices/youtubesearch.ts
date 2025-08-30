//@ts-ignore
import youtubesearchapi from "youtube-search-api";

export async function searchYouTube(query: string) {

    const results = await youtubesearchapi.GetListByKeyword(query, false, 10);
    console.log(results)
    return results
}
