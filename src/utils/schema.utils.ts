import { sequelize } from '../config/db';
import Agence from '../models/Agence';
import Service from '../models/Service';
import SousService from '../models/SousService';
import Priority from '../models/Priority';
import Guichet from '../models/Guichet';
import Ticket from '../models/Ticket';
import Evaluation from '../models/Evaluation';

export const createSchema = async (schemaName: string) => {
  try {
    // Create the schema if it doesn't exist
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
    console.log(`Schema "${schemaName}" created or already exists.`);

    await Agence.sync({ schema: schemaName });
    await Service.sync({ schema: schemaName });
    await SousService.sync({ schema: schemaName });
    await Priority.sync({ schema: schemaName });
    await Guichet.sync({ schema: schemaName });
    await Ticket.sync({ schema: schemaName });
    await Evaluation.sync({ schema: schemaName });

    console.log(`Tables synced for schema "${schemaName}".`);
  } catch (error) {
    console.error(`Error creating/syncing schema "${schemaName}":`, error);
    throw error;
  }
};

export const deleteSchema = async (schemaName: string) => {
  try {
    await sequelize.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
    console.log(`Schema "${schemaName}" deleted.`);
  } catch (error) {
    console.error(`Error deleting schema "${schemaName}":`, error);
    throw error;
  }
};

export const getTenantSchemaName = (filialeNom: string, id: string) => {
  const safeName = filialeNom
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 20);

  return `f_${safeName}_${id.split('-')[0]}`;
};
