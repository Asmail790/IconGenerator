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

 function isRequestApproved(args: {
  numberOfImages: number;
  totalCostLimit: number;
  currentTotalCost:number,
  currentUserTokens:number,

}): TApprovedStatus {
  const { currentTotalCost, numberOfImages, currentUserTokens, totalCostLimit } = args;
  const condition1 = currentTotalCost < totalCostLimit;
  let friendlyMessage: string;

  if (!condition1) {
    friendlyMessage = `Request have been denied due to budget constraint.`;
    return {
      isApproved: false,
      message: friendlyMessage,
    };
  }


  const condition2 = 0 < currentUserTokens;
  if (condition2) {
    return { isApproved: true };
  }

  const missingTokens = numberOfImages - currentUserTokens;

  if (currentUserTokens === 0) {
    friendlyMessage = "you have zero tokens left.";
  } else {
    friendlyMessage = `To generate ${numberOfImages} images requires at least ${missingTokens} tokens but you have ${currentUserTokens} left.`;
  }

  return {
    isApproved: false,
    message: friendlyMessage,
  };
}

export function createRequestApprover(config: {
  totalCostLimit: number;
}) {
  return (requestArgs: { currentUserTokens:number,currentTotalCost:number, numberOfImages: number }) =>
    isRequestApproved({ ...requestArgs, ...config });
}

export const defaultRequestApprover = createRequestApprover({
  totalCostLimit,
});
