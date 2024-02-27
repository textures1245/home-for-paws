export class TError extends Error {
  type: string;
  statusCode: number;
  redirectTo: string | undefined;
  constructor(
    message: string,
    type: string,
    statusCode: number,
    redirectTo?: string
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.redirectTo = redirectTo;
  }
}
