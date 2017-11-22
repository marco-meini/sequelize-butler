export class Result {
  public success: boolean;
  public message: string;
  public subresults: Array<SubResult>;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
    this.subresults = [];
  }
}

export class SubResult {
  public success: boolean;
  public message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}

export class SqError {
  private error: any;

  constructor(error: any) {
    this.error = error;
  }

  isValidationError() {
    if (this.error.name === 'SequelizeValidationError') {
      return true;
    }
    return false;
  }

  getResults(globalErrorMessage: string) {
    if (this.isValidationError()) {
      let result = new Result(false, globalErrorMessage);
      this.error.errors.forEach((item: any) => {
        result.subresults.push(new SubResult(false, item.message));
      });
      return result;
    }
    return null;
  }
}