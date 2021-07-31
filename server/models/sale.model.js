const sql = require("../config/db.js");

const Sale = function(sale) {
    this.id = sale.id;
    this.description = sale.description;
    this.amount = sale.amount;
    this.car_id = sale.car_id;
    this.created_at = sale.created_at;
    this.updated_at = saleupdated_at;
}

Sale.create = (car) => {
   return new Promise((resolve, reject) => {
       sql.query('INSERT INTO sales SET ?', car, (err, res) => {
           if (err) {
               console.log('error during insert new sale', err)
               reject(err)
           }
           resolve(res);
       })
   })
}

Sale.delete = (saleId) => {
   return new Promise((resolve, reject) => {
       sql.query('DELETE FROM sales WHERE id = ?', [saleId], (err, res) => {
           if (err) {
               console.log('error during delete the sale', err);
               reject(err)
           }
           resolve(res);
       })
   })
}

Sale.get = () => {
   return new Promise((resolve, reject) => {
      sql.query('SELECT * FROM sales ORDER BY id DESC', [], (err, res) => {
          if (err) {
              console.log('error during get all sales', err)
              reject(err)
          }
          resolve(res);
      })
  })
}

module.exports = Sale;