import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import orderRoute from './route/order.routes.js';
import userRoutes from './route/userRoutes.js';
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public' )));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use('/', userRoutes);
app.use("/orders", orderRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
