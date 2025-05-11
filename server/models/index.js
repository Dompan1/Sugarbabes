const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Databasuppkoppling
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Modeller
const User = require('./user')(sequelize);
const Profile = require('./profile')(sequelize);
const Post = require('./post')(sequelize);
const Message = require('./message')(sequelize);
const Payment = require('./payment')(sequelize);

// Relationer
User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { 
  as: 'SentMessages', 
  foreignKey: 'sender_id' 
});
Message.belongsTo(User, { 
  as: 'Sender', 
  foreignKey: 'sender_id' 
});

User.hasMany(Message, { 
  as: 'ReceivedMessages', 
  foreignKey: 'receiver_id' 
});
Message.belongsTo(User, { 
  as: 'Receiver', 
  foreignKey: 'receiver_id' 
});

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

// Synka med databasen i dev-miljö
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync error:', err));
}

module.exports = {
  sequelize,
  User,
  Profile,
  Post,
  Message,
  Payment
}; 