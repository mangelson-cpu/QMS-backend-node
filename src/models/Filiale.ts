import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface FilialeAttributes {
  id: string;
  nom: string;
  schema_name?: string;
  created_at?: Date;
}

interface FilialeCreationAttributes extends Optional<FilialeAttributes, 'id' | 'created_at'> { }

class Filiale extends Model<FilialeAttributes, FilialeCreationAttributes> implements FilialeAttributes {
  public id!: string;
  public nom!: string;
  public schema_name!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Filiale.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  schema_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'filiales',
  schema: 'public',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Filiale;
