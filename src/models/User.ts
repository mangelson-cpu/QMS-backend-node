import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface UserAttributes {
  id: string;
  email: string;
  nom_user: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'user';
  agence_id?: string | null;
  filiale_id?: string | null;
  created_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public nom_user!: string;
  public password!: string;
  public role!: 'super_admin' | 'admin' | 'user';
  public agence_id!: string | null;
  public filiale_id!: string | null;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  nom_user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin', 'user'),
    defaultValue: 'user'
  },
  agence_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  filiale_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'users',
  schema: 'public',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;
