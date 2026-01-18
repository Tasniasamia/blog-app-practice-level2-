import type { NextFunction, Request, Response } from 'express';
import  {auth as betterAuth} from '../lib/auth';

export enum userRole{
    USER="USER",
    ADMIN="ADMIN"
}

export const auth=(...roles:userRole[])=>{

   return async(req:Request,res:Response,next:NextFunction)=>{
   
    const session=await betterAuth.api.getSession({headers:req?.headers as any});
     if(!session){
        return res.status(401).json(
            {
                success:false,
                message:"You are not authorized"

            }
        )
     }


     if(!session?.user?.emailVerified){
        res.status(403).json({
            success:false,
            message:"Email Verification Required. Please verify your email"
        })
     }

     if(!roles?.length && !roles.includes(req?.user?.role as userRole)){
     res.status(403).json({
        success:false,
        message:"Forbidden: You don't have permission to access this resources"
     })
     }
console.log('session',session?.user)
     req.user={
        id:session?.user?.id,
        email:session?.user?.email,
        name:session?.user?.name,
        role:session?.user.role,
        emailVerified:session?.user?.emailVerified
     }

    
     next();
    }
}