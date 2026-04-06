export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    isOperational = true
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    // Restore prototype chain (needed for instanceof checks with TypeScript)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Authentication required") {
    return new ApiError(401, message);
  }

  static forbidden(message = "You do not have permission to perform this action") {
    return new ApiError(403, message);
  }

  static notFound(resource = "Resource") {
    return new ApiError(404, `${resource} not found`);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static unprocessable(message: string, errors: unknown[] = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message, [], false);
  }
}
