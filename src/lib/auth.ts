import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { customSession, twoFactor } from "better-auth/plugins"
import nodemailer from 'nodemailer';


const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
      user: "sharintasnia1@gmail.com",
      pass: "cdshxmjtmsflydpp", // must be Gmail App Password
    },
  });

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:['http://localhost:3000'],
    emailAndPassword:{
        enabled:true,
        requireEmailVerification: true,
        autoSignIn:false,
    },
    emailVerification: {
       async afterEmailVerification(user, request) {
            console.log(`${user.email} has been successfully verified!`);
        },
        sendOnSignUp: true,
        sendVerificationEmail: async ( { user, url, token }, request) => {
           await transporter.sendMail({
                from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                to: `${user?.email}`,
                subject: `Email Verification`,
                text: `Hello . token is `, // Plain-text version of the message
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                  <p><b>Hello ${user?.name},</b></p>
                  <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
                  <a href="http://localhost:3000/demo/verification?token=${token}" 
                     style="
                       display: inline-block;
                       padding: 10px 20px;
                       font-size: 16px;
                       color: #ffffff;
                       background-color: #007bff;
                       text-decoration: none;
                       border-radius: 5px;
                     ">
                     Verify Email
                  </a>
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p><a href="http://localhost:3000/demo/verification?token=${token}">http://localhost:3000/demo/verification?token=${token}</a></p>
                </div>
              `,
                            });
            },
        autoSignInAfterVerification:true
          },
        cookies: {
            secure: false,
            sameSite: "lax",
          },
    plugins: [ 
        twoFactor({
          skipVerificationOnEnable:true,
          otpOptions:{
          async sendOTP({ user, otp }, ctx) {
          console.log("user is ",user,otp);
            await transporter.sendMail({
              from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
              to: `${user.email}`,
              subject: `Email Verification`,
              text: `Hello . token is `, // Plain-text version of the message
              html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <p><b>Hello ${user.name},</b></p>
                <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
                <b>Your OTP is ${otp}</b>
              </div>
            `,
                });
          }
          },
         }) ,
        customSession(async ({ user, session }) => {
          const roles = await prisma.user.findMany({
            where: {
              id:session.userId
            },
            select: {
              role: true,
            },
          });          
          return {
              roles,
              user: {
                  ...user,
                  role:roles[0]?.role,
              },
              session
          };
      }),
    ]
});