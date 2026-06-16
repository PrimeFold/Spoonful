import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth/auth';
import { router } from '../routes/route';

const frontendUrl = process.env.FRONTEND_URL;

export const app = express();

app.use(cors({
    origin: [frontendUrl as string, 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.all('/api/auth/*', toNodeHandler(auth));
app.use('/', router);