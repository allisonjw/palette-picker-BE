
exports.up = function(knex) {
    return knex.schema.table('palettes', (table) => {
      table.dropColumn('updated_at')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('palettes', (table) => {
        table.integer('updated_at')
    })
  };