import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
    let statusCode=500;
    let errorMessage="Internal Server Error";
    let errorDetails=err;
    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode=400;
        errorMessage="You provide incorrect field type or missing fields!";
    }
    //prisma jei error gulo niye jane
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
       if(err.code === 'P2025'){
        statusCode=400;
        errorMessage="An operation failed because it depends on one or more records that were required but not found.";
       }
      else if(err.code === 'P2002'){
        statusCode=400;
        errorMessage="Duplicate key error";
       }
       else if(err.code === 'P2003'){
        statusCode=400;
        errorMessage="Foreign key constraint failed on the field";
       }
    }
    //PrismaRustPanicError : jakhon prisma r engine crush kore #task
    //prisma detect korte parena jei error gulo
    else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode=500;
        errorMessage="Error occurred during query execution"
    }
    // prisma connect hote partecena. 
    else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
            statusCode=401,
            errorMessage="Authentication failed against database server at {database_host}"

        }
    }
    res.status(statusCode);
    res.json({message:errorMessage,error:errorDetails})
  }
  
export default errorHandler;