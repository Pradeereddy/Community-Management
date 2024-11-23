import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import apiRoutes from './routes/api.routes';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, TypeScript Express!' });
});



app.use('/api/auth', authRoutes);

app.use('/api/v1' , apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});