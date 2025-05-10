class appError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public stack?: string
  ) {
    super(message);
    this.name = "appError";
    Error.captureStackTrace(this, this.constructor);
  }
}
export default appError;
