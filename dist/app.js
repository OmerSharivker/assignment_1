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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const cors_1 = __importDefault(require("cors")); // Import the cors package
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
// Enable CORS for all routes
app.use((0, cors_1.default)());
const omer = "omer";
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express_1.default.static('public'));
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send("hello");
});
(0, db_1.dbConnect)();
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
app.use('/api', postRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', authRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map