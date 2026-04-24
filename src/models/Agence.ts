import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import Filiale from './Filiale';

interface AgenceAttributes {
  id: string;
  nom: string;
  adresse?: string | null;
  slug: string;
  kiosk_password?: string | null;
  filiale_id?: string | null;
  created_at?: Date;
}

interface AgenceCreationAttributes extends Optional<AgenceAttributes, 'id' | 'created_at' | 'slug'> { }

class Agence extends Model<AgenceAttributes, AgenceCreationAttributes> implements AgenceAttributes {
  public id!: string;
  public nom!: string;
  public adresse!: string | null;
  public slug!: string;
  public kiosk_password!: string | null;
  public filiale_id!: string | null;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Agence.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  kiosk_password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  filiale_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Filiale,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'agences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Agence.belongsTo(Filiale, { foreignKey: 'filiale_id', as: 'filiale' });
Filiale.hasMany(Agence, { foreignKey: 'filiale_id', as: 'agences' });

export default Agence;
