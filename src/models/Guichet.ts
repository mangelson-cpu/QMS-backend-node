import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import Agence from './Agence';

interface GuichetAttributes {
  id: string;
  nom: string;
  type: string;
  status: 'ouvert' | 'ferme' | 'pause';
  agence_id: string;
  created_at?: Date;
}

interface GuichetCreationAttributes extends Optional<GuichetAttributes, 'id' | 'created_at' | 'status'> { }

class Guichet extends Model<GuichetAttributes, GuichetCreationAttributes> implements GuichetAttributes {
  public id!: string;
  public nom!: string;
  public type!: string;
  public status!: 'ouvert' | 'ferme' | 'pause';
  public agence_id!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Guichet.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
  },
  status: {
    type: DataTypes.ENUM('ouvert', 'ferme', 'pause'),
    defaultValue: 'ferme'
  },
  agence_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Agence,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'guichets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
Agence.hasMany(Guichet, { foreignKey: 'agence_id', as: 'guichets' });
Guichet.belongsTo(Agence, { foreignKey: 'agence_id', as: 'agence' });

export default Guichet;
