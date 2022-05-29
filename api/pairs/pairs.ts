import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql, request } from "graphql-request";
import { return200 } from "../../utils/response";
import { getAddress } from "@ethersproject/address";

export const PAIRS_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/avadex-io/exchange";

interface Pair {
  id: string;
  volumeToken0: string; 
   volumeToken1: string; 
   reserveUSD: string; 
   reserveBNB: string; 
   token0: {id: string; name: string; symbol: string;}; 
   token1: {id: string; name: string; symbol: string;}; 
   reserve0: string; 
   reserve1: string; 
   token0Price: string; 
   token1Price: string;
}

export async function getPairX(address: string): Promise<Pair> {
  const id = address
  const {pairs} = await request(
    PAIRS_SUBGRAPH,
    gql`    
    query Pair($id: ID!){
      pairs(
        where: { id: $id }
      ) {
        id
        token0 {id, symbol, name}
        token1 {id, symbol, name}
        token0Price
        reserve0
        reserve1
        volumeToken0
        volumeToken1
        reserveBNB
        reserveUSD
      }
    }
    `,
    {id}
  );

  const data = pairs.map((user: Pair, index: number) => ({
    pair_address: user.id,
         base_address: user.token0?.id,
         base_name: user.token0?.name,
         base_symbol: user.token0?.symbol,
         quote_address: user.token1?.id,
         quote_name: user.token1?.name,
         quote_symbol: user.token1?.symbol,
         price: user.token0Price,
         base_volume: user.volumeToken0,
         quote_volume: user.volumeToken1,
         liquidity: user.reserveUSD,
         liquidity_BNB: user.reserveBNB,
  }));

  return data[0];
}

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method?.toUpperCase() === "OPTIONS") {
    return res.status(204).end();
  }

const id = getAddress(req.query.address.toString()).toLowerCase();

    const data = await getPairX(id);

    return200(res, {updated_at: new Date().getTime(), data});
};