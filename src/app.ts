import 'reflect-metadata';
import express from 'express';
import createConnection from './database';
import Routes from './routes';
import bodyparser from 'body-parser';
import cors from 'cors';
const app = express();

createConnection();
import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(bodyparser.json());
app.use(Routes);

export { app };
