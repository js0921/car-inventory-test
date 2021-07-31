/**
 * Create sale table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.up = function (knex) {
   return knex.schema.createTable('sales', table => {
       table.increments('id').primary().unsigned();
       table.text('description').notNullable();
       table.string('amount').notNullable();
       table.string('car_id').notNullable();
       table.integer('type_out').notNullable();
       table.timestamp('created_at').defaultTo(knex.fn.now());
       table.timestamp('updated_at').defaultTo(knex.fn.now());
   });
 };
 
 /**
 * Drop sales table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.down = function (knex) {
   return knex.schema.dropTable('sales');
 };
 