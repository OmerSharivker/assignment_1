"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Keep original filename with extension
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload.single('photo');
//# sourceMappingURL=multerMiddleware.js.map