import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize, connectDB } from './config/db';

dotenv.config();

const app = express();

connectDB();

import Filiale from './models/Filiale';
import User from './models/User';

if (process.env.NODE_ENV === 'development') {
  // Sync only global models in public schema
  Filiale.sync({ alter: true })
    .then(() => User.sync({ alter: true }))
    .then(() => console.log('Global database models synced'))
    .catch(err => console.log('Error syncing global models: ', err));
}

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import agenceRoutes from './routes/agence.routes';
import serviceRoutes from './routes/service.routes';
import priorityRoutes from './routes/priority.routes';
import guichetRoutes from './routes/guichet.routes';
import ticketRoutes from './routes/ticket.routes';
import evaluationRoutes from './routes/evaluation.routes';
import filialeRoutes from './routes/filiale.routes';
import { tenantMiddleware } from './middlewares/tenant.middleware';

app.use('/api/auth', authRoutes);
app.use('/api/filiales', filialeRoutes); // Global management

// Tenant-aware routes (middleware will be inside the routes files)
app.use('/api/users', userRoutes);
app.use('/api/agences', agenceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/priorities', priorityRoutes);
app.use('/api/guichets', guichetRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/evaluations', evaluationRoutes);


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to QMS Backend API (TypeScript)' });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
