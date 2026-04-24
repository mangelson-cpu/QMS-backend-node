import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import Service from './Service';

interface SousServiceAttributes {
  id: string;
  nom_sous_service: string;
  service_id: string;
  created_at?: Date;
}

interface SousServiceCreationAttributes extends Optional<SousServiceAttributes, 'id' | 'created_at'> { }

class SousService extends Model<SousServiceAttributes, SousServiceCreationAttributes> implements SousServiceAttributes {
  public id!: string;
  public nom_sous_service!: string;
  public service_id!: string;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

SousService.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom_sous_service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Service,
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
  tableName: 'sous_services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
Service.hasMany(SousService, { foreignKey: 'service_id', as: 'sous_services' });
SousService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

export default SousService;
