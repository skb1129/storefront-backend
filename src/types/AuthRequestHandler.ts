import { NextFunction, Request, Response } from "express";

import { TokenData } from "./TokenData";

export type AuthRequestHandler = (req: Request, res: Response, user: TokenData, next: NextFunction) => void;
