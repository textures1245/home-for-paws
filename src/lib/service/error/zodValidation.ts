import { ZodError, ZodObject, ZodRawShape } from "zod";

export function schemaValidate<SchemaValidatorT extends ZodObject<ZodRawShape>>(
  schema: SchemaValidatorT
) {
  return <ObjT>(req: ObjT) => {
    const validateReq = schema.safeParse(req);
    if (!validateReq.success) {
      throw new ZodError(validateReq.error.issues);
    }
    return validateReq.data as ObjT;
  };
}
