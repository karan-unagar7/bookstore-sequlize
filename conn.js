const { Sequelize, DataTypes } = require("sequelize");
const path = require('path');
const fs = require('fs');
const {
  DBNAME,
  USER_NAME,
  PASSWORD,
  HOST,
  DIALECT,
} = require("./config/config");
const { log } = require("console");

const sequelize = new Sequelize(DBNAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate(); // Added await here
    console.log(`Connection Successfully`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})(); 

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.users = require("./model/user.model")(sequelize, DataTypes);
// db.books = require("./model/book.model")(sequelize, DataTypes);

// db.users.hasMany(db.books, { foreignKey: "userId" });
// db.books.belongsTo(db.users);


const modelsDir = path.join(__dirname , "models")

fs.readdirSync(modelsDir).forEach(file=>{
  const model=require(path.join(modelsDir, file))(sequelize,DataTypes);
  db[model.name]=model;
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize
  .sync({ force: false })
  .then(() => console.log("Tables Created")) 
  .catch((e) => console.error('Error syncing database:', e.message)); 
  
module.exports = db;
