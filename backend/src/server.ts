import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth/auth';
import { router } from './routes/route';

const app = express();
const baseUrl = process.env.BASE_URL;
const frontendUrl = process.env.FRONTEND_URL;
if(!baseUrl){
    console.log("base url not found")
    process.exit(1);
}
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin:[frontendUrl as string, 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.all('/api/auth/*', toNodeHandler(auth));
app.use('/',router);


app.listen(PORT,()=>{
    console.log(`Server started running on: http://localhost:${PORT}`)
})