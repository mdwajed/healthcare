class appError extends Error {
  //   statusCode: number;
  //   constructor(statusCode: number, message: string | undefined, stack: "") {
  //     super(message);
  //     this.statusCode = statusCode;
  //     if (stack) {
  //       this.stack = stack;
  //     } else {
  //       Error.captureStackTrace(this, this.constructor);
  //     }
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
