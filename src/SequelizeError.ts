import { Result } from './interfaces';

export class SequelizeError {
  constructor(private sequelizeError: any) { }
  isValidationError() {
    if (this.sequelizeError.name === 'SequelizeValidationError') {
      return true;
    }
    return false;
  }

  getResults(globalErrorMessage: string): Result {
    if (this.isValidationError()) {
      let result: Result = {
        message: globalErrorMessage,
        success: false,
        subresults: []
      };
      this.sequelizeError.errors.forEach((item: any) => {
        result.subresults.push({
          success: false,
          message: item.message
        });
      });
      return result;
    }
    return null;
  }
}