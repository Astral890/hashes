import express from 'express';
import bodyParser from 'body-parser';
import { router as hashRouter } from './controllers/hashController.js';
import path from "path";
import { fileURLToPath } from "url";


const app = express();
app.use(bodyParser.json());
app.use('/hash', hashRouter);
app.use('/verify', hashRouter);
const _dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(_dirname+"/public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));