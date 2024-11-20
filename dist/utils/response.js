"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseReturn = void 0;
const responseReturn = (res, code, data) => {
    return res.status(code).json(data);
};
exports.responseReturn = responseReturn;
//# sourceMappingURL=response.js.map