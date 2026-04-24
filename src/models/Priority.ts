import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface PriorityAttributes {
  id: string;
  nom: string;
  valeur: number;
  couleur: string;
  created_at?: Date;
}

interface PriorityCreationAttributes extends Optional<PriorityAttributes, 'id' | 'created_at' | 'couleur'> { }

class Priority extends Model<PriorityAttributes, PriorityCreationAttributes> implements PriorityAttributes {
  public id!: string;
  public nom!: string;
  public valeur!: number;
  public couleur!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Priority.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valeur: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    allowNull: false
  },
  couleur: {
    type: DataTypes.STRING,
    defaultValue: '#8b5cf6'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'priorities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Priority;
