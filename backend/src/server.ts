import dotenv from 'dotenv'
dotenv.config();
import { app } from './lib/app';

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Server started running on: http://localhost:${PORT}`)
})