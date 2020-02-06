
exports.up = function(knex, Promise) {
  return knex.schema.table('palettes', (table) => {
    table.integer('timestamps')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('palettes', (table) => {
      table.dropColumn('timestamps')
  })
};
