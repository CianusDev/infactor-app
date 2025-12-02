import { HTTP_STATUS } from "./constant";
import { NextResponse } from "next/server";
import { Logger } from "./helpers";

export class GenericError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = GenericError.name; // stack traces display correctly now
  }
}

export class NotFoundError extends GenericError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = NotFoundError.name;
  }
}

export class ValidationError extends GenericError {
  constructor(message = "Validation failed") {
    super(message, HTTP_STATUS.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ValidationError.name;
  }
}

export class UnauthorizedError extends GenericError {
  constructor(message = "Unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = UnauthorizedError.name;
  }
}

export class ForbiddenError extends GenericError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ForbiddenError.name;
  }
}

export class ConflictError extends GenericError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ConflictError.name;
  }
}

export class InternalServerError extends GenericError {
  constructor(message = "Internal server error") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = InternalServerError.name;
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ValidationError) {
    Logger.warn(`${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
  if (error instanceof GenericError) {
    Logger.warn(`${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
  // logger.("Erreur API inconnue :", error);
  Logger.error(`${JSON.stringify(error)}`);
  // Erreur inconnue
  return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 },
  );
}
