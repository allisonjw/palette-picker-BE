
exports.up = function(knex) {
    return knex.schema.table('projects', (table) => {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('projects', (table) => {
        table.integer('updated_at')
        table.integer('created_at')
    })
  };
  