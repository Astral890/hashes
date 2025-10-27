import express from 'express';
import bodyParser from 'body-parser';
import { router as hashRouter } from './controllers/hashController.js';


const app = express();
app.use(bodyParser.json());
app.use('/hash', hashRouter);
app.use('/verify', hashRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));