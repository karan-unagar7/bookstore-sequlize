module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "book",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,

        get() {
          const value = this.getDataValue("name");
          return value
            ? value.replace(/\b\w/g, (char) => char.toUpperCase())
            : value;
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const value = this.getDataValue("description");
          return value
            ? value.replace(/\b\w/g, (char) => char.toUpperCase())
            : value;
        },
      },
      no_of_pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const value = this.getDataValue("author");
          return value
            ? value.replace(/\b\w/g, (char) => char.toUpperCase())
            : value;
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const value = this.getDataValue("category");
          return value
            ? value.replace(/\b\w/g, (char) => char.toUpperCase())
            : value;
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      released_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "tbl_book",
      timestamps: true,
      updatedAt: false,
    }
  );

  Book.associate = (models) => {
    Book.belongsTo(models.user, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return Book;
};
