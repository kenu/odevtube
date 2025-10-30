const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Synchronize all models
exports.syncDatabase = async () => {
  try {
    await testConnection();
    
    // Import models
    const User = require('./models/User');
    const UserChannel = require('./models/UserChannel');
    
    // Set up associations
    User.associate({ UserChannel });
    UserChannel.associate({ User });
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Export the sequelize instance and models
module.exports = {
  sequelize,
  Sequelize,
  models: {
    User: require('./models/User'),
    UserChannel: require('./models/UserChannel'),
  },
};
