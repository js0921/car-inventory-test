const sql = require("../config/db.js");

const Car = function(car) {
    this.id = car.id;
    this.name = car.name;
    this.model = car.model;
    this.price = car.price;
    this.sku = car.sku;
    this.created_at = car.created_at;
    this.updated_at = car.updated_at;
}

Car.create = (car) => {
   return new Promise((resolve, reject) => {
       sql.query('INSERT INTO cars SET ?', car, (err, res) => {
           if (err) {
               console.log('error during insert new car', err)
               reject(err)
           }
           resolve(res);
       })
   })
}

Car.delete = (carId) => {
   return new Promise((resolve, reject) => {
       sql.query('DELETE FROM cars WHERE id = ?', [carId], (err, res) => {
           if (err) {
               console.log('error during delete the car', err);
               reject(err)
           }
           resolve(res);
       })
   })
}

Car.get = () => {
   return new Promise((resolve, reject) => {
      sql.query('SELECT * FROM cars ORDER BY id DESC', [], (err, res) => {
          if (err) {
              console.log('error during get all cars', err)
              reject(err)
          }
          resolve(res);
      })
  })
}

Car.findById = (carId) => {
    return new Promise((resolve, reject) => {
       sql.query('SELECT * FROM cars WHERE id = ? ', [carId], (err, res) => {
           if (err) {
               console.log('error during get car', err)
               reject(err)
           }
           resolve(res);
       })
   })
 }

module.exports = Car;