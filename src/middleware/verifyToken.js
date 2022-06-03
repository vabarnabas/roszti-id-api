"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearerToken = bearerHeader.slice(7);
        jsonwebtoken_1.default.verify(bearerToken, "ESTIEM2022", (err, decoded) => {
            if (err) {
                res.status(401).json({ error: "Unathorized or expired token." });
            }
            else if (decoded) {
                req.body = Object.assign(Object.assign({}, req.body), { decoded });
                next();
            }
        });
    }
    else {
        res.status(401).json({ error: "Missing argument Authorization Header." });
    }
};
exports.verifyToken = verifyToken;
