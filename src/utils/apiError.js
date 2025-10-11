class apiError extends Error {
  constructor(
    statusCode = 500,
    message = "Something went wrong!",
    errors = [],
    stack = ""
  ) {
    super(message);

    // ✅ store code in standard property names
    this.statusCode = Number(statusCode);
    this.code = Number(statusCode);
    this.success = false;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default apiError;
