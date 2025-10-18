import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();

// Configure CORS to allow your frontend
const allowedOrigins = [
  'https://kaleidoscopic-madeleine-99e25d.netlify.app',
  'http://localhost:5173' // for local dev
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

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