const bcrypt= require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      interest: {
        type: DataTypes.JSON, 
        defaultValue: JSON.stringify([]),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      tableName: "tbl_user",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password && user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  );

  User.prototype.checkPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  };
  
  return User;
};
