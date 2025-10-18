import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ strict: false }));

const port = process.env.PORT || 5000;

app.use('/api/test', testRoutes);
app.use('/reports', express.static('reports'));

app.get('/', (req, res) => {
  res.send('Hello World from Node.js!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});