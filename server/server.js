import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './src/routes/user.routes.js'
import transactionRoutes from './src/routes/transaction.routes.js'

import { connectDB } from './src/config/db.config.js';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config()

connectDB();

import cors from "cors";

app.use(
    cors({
        origin: [
            "https://bond-and-budgets.netlify.app",
            "http://localhost:5173",
            "http://localhost:8080",
        ],
       
    })
);


app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: `, PORT)
})
