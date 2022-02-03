'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemCompra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemCompra.belongsTo(models.Compra, {foreignKey: 'CompraId', as: 'compras'}); 
      ItemCompra.belongsTo(models.Produto, {foreignKey: 'ProdutoId', as: 'produtos'});
    }
  };
  ItemCompra.init({
    quantidade: DataTypes.INTEGER,
    valor: DataTypes.FLOAT,
    ProdutoId: DataTypes.INTEGER,
    CompraId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemCompra',
  });
  return ItemCompra;
};