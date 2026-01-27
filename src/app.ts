import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Mount API v1
app.use('/v1', apiRouter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
