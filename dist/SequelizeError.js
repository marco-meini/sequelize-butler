"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeError = void 0;
class SequelizeError {
    constructor(sequelizeError) {
        this.sequelizeError = sequelizeError;
    }
    isValidationError() {
        if (this.sequelizeError.name === 'SequelizeValidationError') {
            return true;
        }
        return false;
    }
    getResults(globalErrorMessage) {
        if (this.isValidationError()) {
            let result = {
                message: globalErrorMessage,
                success: false,
                subresults: []
            };
            this.sequelizeError.errors.forEach((item) => {
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
exports.SequelizeError = SequelizeError;
//# sourceMappingURL=SequelizeError.js.map