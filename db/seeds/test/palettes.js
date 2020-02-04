const palettes = require('../../../data/palettesData');

exports.seed = async knex => {
  await knex('palettes').del()
  await knex('palettes').insert(palettes);
};
