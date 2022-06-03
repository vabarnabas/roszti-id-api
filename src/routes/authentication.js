"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const authenticationRouter = (0, express_1.Router)();
//Authenticate User
authenticationRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData) {
        res.send(400).json({ error: "Missing argument from body." });
    }
    const user = yield prisma.user.findMany({
        where: { email: userData.email },
    });
    if (user && (yield (0, bcrypt_1.compare)(userData.password, user[0].password))) {
        jsonwebtoken_1.default.sign({ id: user[0].id }, "ESTIEM2022", { algorithm: "HS256", expiresIn: "2h" }, function (err, token) {
            res.json({ data: { token } });
        });
    }
    else {
        res
            .status(401)
            .json({ error: "Invalid login credentials or missing user." });
    }
}));
authenticationRouter.post("/current", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded } = req.body;
    if (!decoded.id) {
        res.status(401);
    }
    const user = yield prisma.user.findUnique({ where: { id: decoded.id } });
    res.json({ data: user });
}));
exports.default = authenticationRouter;
