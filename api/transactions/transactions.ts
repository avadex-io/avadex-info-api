import { VercelRequest, VercelResponse } from "@vercel/node";
import { gql, request } from "graphql-request";
import { return200 } from "../../utils/response";
import { getAddress } from "@ethersproject/address";

export const TRANSACTIONS_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/avadex-io/exchange";

interface Transaction {
  id: string;
}

export async function getTransactionX(address: string): Promise<Transaction> {
  const id = address
  const {transactions} = await request(
    TRANSACTIONS_SUBGRAPH,
    gql`    
    query Transaction($id: ID!){
      transactions(
        where: { id: $id }
      ) {
        id
      }
    }
    `,
    {id}
  );

  const data = transactions.map((transaction: Transaction, index: number) => ({
    id: transaction.id,
  }));

  return data[0];
}

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method?.toUpperCase() === "OPTIONS") {
    return res.status(204).end();
  }

const id = req.query.address.toString().toLowerCase();

    const data = await getTransactionX(id);

    return200(res, {updated_at: new Date().getTime(), data});
};