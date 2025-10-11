class apiResponse {
  constructor(statusCode, data, message = "success") {
    this.code = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { apiResponse };
