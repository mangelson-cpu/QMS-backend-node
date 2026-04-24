import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface ServiceAttributes {
  id: string;
  nom_service: string;
  code: string;
  created_at?: Date;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'created_at'> { }

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: string;
  public nom_service!: string;
  public code!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

Service.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom_service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: 'A'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Service;
