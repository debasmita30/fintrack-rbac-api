import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

type Target = "body" | "query" | "params";

/**
 * Middleware factory that validates a request segment (body, query, params)
 * against a Zod schema. On failure, throws a structured 422 error.
 *
 * Usage:
 *   router.post("/", validate("body", createTransactionSchema), handler)
 */
export function validate(target: Target, schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
        code: e.code,
      }));
      return next(
        new ApiError(422, `Validation failed for request ${target}`, errors)
      );
    }

    // Replace the request segment with the parsed (coerced) values
    req[target] = result.data;
    return next();
  };
}
