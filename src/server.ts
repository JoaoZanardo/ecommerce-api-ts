import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import userRouter from './routes/userRoute';
import categoryRouter from './routes/categoryRoute';
import productRouter from './routes/productRoute';
import cartRouter from './routes/cartRoute';
import orderRouter from './routes/orderRoute';
import * as middleware from './middlewares/middleware';
import { mongoConnection } from './instances/mongo';

dotenv.config();
mongoConnection();

const app = express();

app.use(passport.initialize());
app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

app.use(middleware.errorHandler);

app.use((req, res) => {
	res.status(404);
	res.json({ error: 'Endpoint not found' });
});

app.listen(process.env.PORT);
