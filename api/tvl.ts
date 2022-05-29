import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql, request } from "graphql-request";
import { return200 } from "../utils/response";

export const PAIRS_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/avadex-io/exchange";

interface Tvl {
  id: string;
  totalLiquidityUSD: string;
}

export async function getPairX(): Promise<Tvl> {
  const {pancakeFactories} = await request(
    PAIRS_SUBGRAPH,
    gql`    
    query Tvl{
      pancakeFactories(first: 1) {
        id
        totalLiquidityUSD
      }
    }
    `
  );

  const data = pancakeFactories.map((user: Tvl, index: number) => ({
    id: "avax_avadex", 
        chain: "avalanche", 
        name: "AvaDex", 
        site_url: "https://avadex.io", 
        logo_url: "https://static.debank.com/image/project/logo_url/bsc_pancakeswap/a4e035cf4495755fddd5ebb6e5657f63.png", 
        has_supported_portfolio: true, 
        tvl: user.totalLiquidityUSD
  }));

  return data[0];
}

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {

    const tvl = await getPairX();

    return200(res, tvl );
}
