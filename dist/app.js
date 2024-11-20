"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const body_parser_1 = __importDefault(require("body-parser"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
//middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send("hello");
});
(0, db_1.dbConnect)();
app.use('/api', postRoutes_1.default);
app.use('/api', commentRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map