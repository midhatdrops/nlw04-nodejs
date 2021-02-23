"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.listen(process.env.PORT, function () {
    return console.log("Server is running at port " + process.env.PORT);
});
