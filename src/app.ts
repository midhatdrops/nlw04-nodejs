import 'reflect-metadata';
import express from 'express';
import './database';
import Routes from './routes';
import bodyparser from 'body-parser';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

app.use(bodyparser.json());
app.use(Routes);

export { app };
