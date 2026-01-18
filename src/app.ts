import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { json } from 'node:stream/consumers';
import { postRouter } from './modules/post/post.route';

const app=express();

app.use(cors({origin:'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded());
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use('/post',postRouter);
// app.post('/signup',async(req:Request,res:Response)=>{
//     const {email,  password, name,  image,  callbackURL}=await req?.body;
//     const response = await auth.api.signUpEmail({
//         body: {
//             email,  password, name,  image, callbackURL: "http://localhost:3000"

//         },
//         asResponse: true 
//     });
//     console.log(JSON.stringify(response));
//     if(response){
//         res.status(200).json({
//             success:true,
//             message:"Signup successfully",
//             data:response
//         })
//     }
// })
app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World');
});

export default app;