import { Prisma } from "@prisma/client";

export default function prismaHandle(
  e: Prisma.PrismaClientKnownRequestError | unknown
) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    throw new Error(
      JSON.stringify({
        code: e.code,
        meta: e.meta,
        message: e.message,
      })
    );
  }
  return e;
}
