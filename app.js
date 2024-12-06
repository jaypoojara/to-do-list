import 'dotenv/config'
import express from 'express';
import * as path from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import routers from "./routes/index.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by')

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',routers)

export default app;
