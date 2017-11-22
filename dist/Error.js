"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, message) {
        this.success = success;
        this.message = message;
        this.subresults = [];
    }
}
exports.Result = Result;
class SubResult {
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}
exports.SubResult = SubResult;
class SqError {
    constructor(error) {
        this.error = error;
    }
    isValidationError() {
        if (this.error.name === 'SequelizeValidationError') {
            return true;
        }
        return false;
    }
    getResults(globalErrorMessage) {
        if (this.isValidationError()) {
            let result = new Result(false, globalErrorMessage);
            this.error.errors.forEach((item) => {
                result.subresults.push(new SubResult(false, item.message));
            });
            return result;
        }
        return null;
    }
}
exports.SqError = SqError;
//# sourceMappingURL=Error.js.map