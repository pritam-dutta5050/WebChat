import express, { NextFunction, Request, Response } from "express";
import UserRoute from "./routes/user.route";
import MessageRoute from "./routes/message.route";
import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import {app} from "./socket/socket";

export const runApp =() => {
  // Middlewares
  app.use(express.json());
  app.use(cookieParser());
  // endpoint declaration
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
  app.use("/api/user", UserRoute);
  app.use("/api/message", MessageRoute);
  app.use((req, res, next)=>{
    next(createHttpError(404, "Endpoint not found"));
  });

  // error handling middleware
  app.use((error:unknown, req:Request, res: Response, next: NextFunction)=>{
    let errmsg = "This is a system error";
    let errStatus = 500;
  
    if(isHttpError(error)){
        errStatus = error.status;
        errmsg = error.message;
    }
    res.status(errStatus).json({error: errmsg});
  })
}

