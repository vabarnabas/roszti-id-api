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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userRouter = (0, express_1.Router)();
//Get Users
userRouter.get("/users", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.send({ data: users });
}));
userRouter.get("/users/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        res.send({ data: user });
    }
    catch (error) {
        res.status(400).send({ error: error });
    }
}));
//Create User
userRouter.post("/users/create", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (!data) {
        res.status(400).json({ error: "Missing argument: Data." });
    }
    try {
        const salt = yield (0, bcrypt_1.genSalt)();
        const newUser = yield prisma.user.create({
            data: Object.assign(Object.assign({}, data), { password: yield (0, bcrypt_1.hash)(data.password, salt) }),
        });
        res.send({ data: newUser });
    }
    catch (error) {
        res.status(400).send({ error: error });
    }
}));
//Update User
userRouter.put("/users/update/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data } = req.body;
    if (!data) {
        res.status(400).json({ error: "Missing argument: Data." });
    }
    if (data === null || data === void 0 ? void 0 : data.password) {
        const salt = yield (0, bcrypt_1.genSalt)();
        data.password = yield (0, bcrypt_1.hash)(data.password, salt);
    }
    try {
        const updateUser = yield prisma.user.update({
            where: { id },
            data: Object.assign({}, data),
        });
        res.send({ data: updateUser });
    }
    catch (error) {
        res.status(400).send({ error: error });
    }
}));
//Delete User
userRouter.delete("/users/delete/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteUser = yield prisma.user.delete({
            where: { id },
        });
        res.json({ data: deleteUser });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
}));
exports.default = userRouter;
