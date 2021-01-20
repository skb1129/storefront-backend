"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("order", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    user_id: {
      type: "string",
      foreignKey: {
        name: "order_user_id_fk",
        table: "user",
        rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
        mapping: "id",
      },
    },
    products: "string",
    quantities: "string",
    status: "string",
  });
};

exports.down = function (db) {
  return db.dropTable("order");
};

exports._meta = {
  version: 1,
};
