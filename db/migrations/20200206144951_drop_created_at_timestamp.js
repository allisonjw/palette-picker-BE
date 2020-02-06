
exports.up = function(knex) {
    return knex.schema.table('palettes', (table) => {
      table.dropColumn('created_at')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('palettes', (table) => {
        table.integer('created_at')
    })
  };
  