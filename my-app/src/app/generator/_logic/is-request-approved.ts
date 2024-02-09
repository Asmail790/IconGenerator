import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";
import { totalCostLimit } from "@/global.config/totalCostLimit";
type TApproved = {
  isApproved: true;
};

type TNotApproved = {
  isApproved: false;
  message: string;
};

type TApprovedStatus = TApproved | TNotApproved;

async function isRequestApproved(args: {
  userId: string;
  numberOfImages: number;
  db: IDB;
  totalCostLimit: number;
}): Promise<TApprovedStatus> {
  const { userId, numberOfImages, db, totalCostLimit } = args;
  const currentCost = await db.getTotalCost();
  const condition1 = currentCost < totalCostLimit;
  let friendlyMessage: string;

  if (!condition1) {
    friendlyMessage = `Request have been denied due to budget constraint.`;
    return {
      isApproved: false,
      message: friendlyMessage,
    };
  }

  const userTokens = await db.getNumberOfTokens(userId);

  const condition2 = 0 < (await db.getNumberOfTokens(userId));
  if (condition2) {
    return { isApproved: true };
  }

  const missingTokens = numberOfImages - userTokens;

  if (userTokens === 0) {
    friendlyMessage = "you have zero tokens left.";
  } else {
    friendlyMessage = `To generate ${numberOfImages} images requires at least ${missingTokens} tokens but you have ${userTokens} left.`;
  }

  return {
    isApproved: false,
    message: friendlyMessage,
  };
}

export function createRequestApprover(config: {
  db: IDB;
  totalCostLimit: number;
}) {
  return (requestArgs: { userId: string; numberOfImages: number }) =>
    isRequestApproved({ ...requestArgs, ...config });
}

export const defaultRequestApprover = createRequestApprover({
  db,
  totalCostLimit,
});
