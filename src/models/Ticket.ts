import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import Agence from './Agence';
import Service from './Service';
import Priority from './Priority';
import Guichet from './Guichet';
import User from './User';

interface TicketAttributes {
  id: string;
  numero: string;
  status: 'en_attente' | 'en_cours' | 'termine' | 'annule' | 'rappelle';
  agence_id: string;
  service_id: string;
  priority_id: string;
  guichet_id?: string | null;
  user_id?: string | null;
  created_at?: Date;
  called_at?: Date | null;
  started_at?: Date | null;
  ended_at?: Date | null;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id' | 'status' | 'guichet_id' | 'user_id' | 'created_at' | 'called_at' | 'started_at' | 'ended_at'> { }

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: string;
  public numero!: string;
  public status!: 'en_attente' | 'en_cours' | 'termine' | 'annule' | 'rappelle';
  public agence_id!: string;
  public service_id!: string;
  public priority_id!: string;
  public guichet_id!: string | null;
  public user_id!: string | null;

  public readonly created_at!: Date;
  public called_at!: Date | null;
  public started_at!: Date | null;
  public ended_at!: Date | null;
  public readonly updatedAt!: Date;
}

Ticket.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('en_attente', 'en_cours', 'termine', 'annule', 'rappelle'),
    defaultValue: 'en_attente'
  },
  agence_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Agence, key: 'id' }
  },
  service_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Service, key: 'id' }
  },
  priority_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Priority, key: 'id' }
  },
  guichet_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: Guichet, key: 'id' }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: User, key: 'id' } // User is in public schema
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  called_at: { type: DataTypes.DATE, allowNull: true },
  started_at: { type: DataTypes.DATE, allowNull: true },
  ended_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
Ticket.belongsTo(Agence, { foreignKey: 'agence_id', as: 'agence' });
Ticket.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Ticket.belongsTo(Priority, { foreignKey: 'priority_id', as: 'priority' });
Ticket.belongsTo(Guichet, { foreignKey: 'guichet_id', as: 'guichet' });
Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'agent' });

export default Ticket;
