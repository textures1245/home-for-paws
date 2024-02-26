import { z } from "zod";
import { reviewModel } from "../../model/review/review";
import prisma from "../../database/prisma/prisma.config";
import prismaHandle from "../../error/prismaHandle";

const reviewParamModel = reviewModel.pick({
  rating: true,
  reviewDetail: true,
  petUuid: true,
  ownerUuid: true,
  toUserUuid: true,
});

export type ReviewParam = z.infer<typeof reviewParamModel>;

export async function createReview(reviewData: ReviewParam) {
  try {
    return prisma.review.create({
      data: {
        rating: reviewData.rating,
        reviewDetail: reviewData.reviewDetail,
        ownerUuid: reviewData.ownerUuid,
        toUserUuid: reviewData.toUserUuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

