
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';

dotenv.config();


const NODE_ENV = process.env.NODE_ENV;
var ms = 1000*60*15;
var max = 5;

if(NODE_ENV=='development'){
    ms = 1000*60*15,
    max = 100;
    
}

export const limiter = rateLimit({
    windowMs:ms,
    max:max,
}) 



