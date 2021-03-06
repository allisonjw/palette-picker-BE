exports.up = function(knex) {
    return Promise.all([
      knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.text('username');
        table.text('password');
        table.timestamps(true, true);
      }),
      
      knex.schema.createTable('projects', table => {
        table.increments('id').primary();      
        table.text('project_name');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
        table.timestamps(true, true);
      }),
      
      knex.schema.createTable('palettes', table => {
        table.increments('id').primary();
        table.text('palette_name');
        table.integer('project_id').unsigned();
        table.foreign('project_id').references('projects.id').onDelete('CASCADE');
        table.string('color_1');
        table.string('color_2');
        table.string('color_3');
        table.string('color_4');
        table.string('color_5');
        table.timestamps(true, true)
      })
    ]);
  };

  exports.down = function(knex) {
    return Promise.all([
      knex.schema.dropTable('palettes'),
      knex.schema.dropTable('projects'),
      knex.schema.dropTable('users')  
    ]);
  };

