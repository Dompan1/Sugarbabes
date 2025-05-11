const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_ai_generated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    attachment_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'messages',
    timestamps: false,
    indexes: [
      {
        fields: ['sender_id', 'receiver_id']
      },
      {
        fields: ['sent_at']
      }
    ]
  });

  return Message;
}; 