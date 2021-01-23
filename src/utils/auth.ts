import { NextFunction, Request, Response } from "express";

import { AuthRequestHandler } from "../types";
import { verify } from "./token";

export function requiresAuth(fn: AuthRequestHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send();
    const [type, token] = authorization.split(" ");
    if (!token || type.toLowerCase() !== "bearer") return res.status(401).send();
    const data = verify(token);
    if (!data) return res.status(401).send();
    fn(req, res, data, next);
  };
}
