import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAddress } from "@ethersproject/address";
import { getTopPairs } from "../../utils";
import { return200, return500 } from "../../utils/response";

interface ReturnShape {
  [tokenIds: string]: {
    id: string;
  };
}

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const topPairs = await getTopPairs();

    const transactions = topPairs.reduce<ReturnShape>((accumulator, pair): ReturnShape => {
      const pId = getAddress(pair.id);

      accumulator[`${pId}`] = {
        id: pId,
      };

      return accumulator;
    }, {});

    return200(res, { updated_at: new Date().getTime(), data: transactions });
  } catch (error) {
    return500(res, error);
  }
}
