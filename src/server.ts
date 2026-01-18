import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = process.env.PORT || 5000;
(async () => {
  try {
    await prisma.$connect().then(()=>{
        console.log('database connected successfully')
    })
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (err: any) {
    await prisma.$disconnect();
    process.exit(1);
    throw err;
  }
})();
