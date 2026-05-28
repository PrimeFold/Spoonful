import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv'
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth/auth';
import { router } from './routes/route';
dotenv.config();

const app = express();
const baseUrl = process.env.BASE_URL
const PORT = process.env.PORT || 'http://localhost:3000'
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use(helmet());
app.use('/',router);

app.use(cors({
    origin:baseUrl
}));

app.listen(PORT,()=>{
    console.log(`Server started running on port : ${PORT}`)
})