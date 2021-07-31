/**
 * Create car table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.up = function (knex) {
   return knex.schema.createTable('cars', table => {
       table.increments('id').primary().unsigned();
       table.string('name').notNullable();
       table.string('model').notNullable();
       table.string('price').notNullable();
       table.string('sku').notNullable();
       table.timestamp('created_at').defaultTo(knex.fn.now());
       table.timestamp('updated_at').defaultTo(knex.fn.now());
   });
 };
 
 /**
 * Drop cars table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.down = function (knex) {
   return knex.schema.dropTable('cars');
 };
 