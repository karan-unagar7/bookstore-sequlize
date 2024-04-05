const {Sequelize,DataTypes} = require('sequelize')
const {DBNAME,USER_NAME,PASSWORD,HOST,DIALECT} = require('../config/config');


const sequelize=new Sequelize(DBNAME,USER_NAME,PASSWORD,{
    host: HOST,
    dialect: DIALECT,
    logging:false
})

const connectionDb = ()=>{
    try {
        sequelize.authenticate();
        console.log(`Connection Successfully`);
    } catch (error) {
        console.log(error);
    }
}
connectionDb();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model')(sequelize,DataTypes)
db.books = require('./book.model')(sequelize,DataTypes)


db.users.hasMany(db.books, { foreignKey: 'userId' });
db.books.belongsTo(db.users);


db.sequelize.sync({force:false}).then('Tables Created').catch((e)=>console.log(e.message));
module.exports =db