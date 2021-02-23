import express from 'express';
import Routes from './routes';
import bodyparser from 'body-parser';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

app.use(bodyparser.json());
app.use(Routes);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port ${process.env.PORT}`)
);
