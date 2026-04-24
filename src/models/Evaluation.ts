import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import Ticket from './Ticket';

interface EvaluationAttributes {
  id: string;
  ticket_id: string;
  score: number;
  commentaire?: string;
  created_at?: Date;
}

interface EvaluationCreationAttributes extends Optional<EvaluationAttributes, 'id' | 'created_at' | 'commentaire'> { }

class Evaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public id!: string;
  public ticket_id!: string;
  public score!: number;
  public commentaire!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Evaluation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Un seul avis par ticket
    references: {
      model: Ticket,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'evaluations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
Ticket.hasOne(Evaluation, { foreignKey: 'ticket_id', as: 'evaluation' });
Evaluation.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

export default Evaluation;
