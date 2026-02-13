import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'odevtube',
  'devuser',
  'devpass',
  {
    host: 'localhost',
    dialect: 'mariadb',
    logging: console.log,
  }
);

async function migrate() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully.');

    // Check if isPublic column exists
    const results = await sequelize.query(
      "SHOW COLUMNS FROM channels LIKE 'isPublic'",
      { type: sequelize.QueryTypes.SELECT }
    );

    if (results.length === 0) {
      console.log('Adding isPublic column...');
      await sequelize.query(
        'ALTER TABLE channels ADD COLUMN isPublic TINYINT(1) DEFAULT 1',
        { type: sequelize.QueryTypes.RAW }
      );
      console.log('isPublic column added successfully.');
    } else {
      console.log('isPublic column already exists.');
    }

    // Check if accountId column exists
    const results2 = await sequelize.query(
      "SHOW COLUMNS FROM channels LIKE 'accountId'",
      { type: sequelize.QueryTypes.SELECT }
    );

    if (results2.length === 0) {
      console.log('Adding accountId column...');
      await sequelize.query(
        'ALTER TABLE channels ADD COLUMN accountId VARCHAR(255)',
        { type: sequelize.QueryTypes.RAW }
      );
      console.log('accountId column added successfully.');
    } else {
      console.log('accountId column already exists.');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
