import express from 'express';
const Car = require('../models/car.model.js');
const Sale = require('../models/sale.model.js');
const router = express.Router();

router.route('/get')
  .get(async(req, res) => {
    try {
      const result = await Car.get();
      res.send({ success: true, data: result });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

router.route('/sale/get')
  .get(async(req, res) => {
    try {
      const result = await Sale.get();
      console.log("result:", result);
      let newArr = [];
      if(result.length) {
         for(let i = 0; i< result.length; i++) {
            const car = await Car.findById(result[i].car_id);
            let payload = {
               id: result[i].id,
               carId: result[i].car_id,
               carName: car[0].name,
               price: car[0].price,
               amount: result[i].amount,
               description: result[i].description,
               type: result[i].type_out,
               createdAt: result[i].createdAt,
               updatedAt: result[i].updatedAt,
            }
            newArr.push(payload);
         }
      }
      console.log("newArr: ", newArr);
      res.send({ success: true, data: newArr });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

router.route('/create')
  .post(async(req, res) => {
    try {
      const payload = req.body;
      const result = await Car.create(payload);

      res.send({ success: true, data: result });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

router.route('/sale/create')
  .post(async(req, res) => {
    try {
      const payload = req.body;
      const result = await Sale.create(payload);
      res.send({ success: true, data: result });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

router.route('/delete')
  .post(async(req, res) => {
    try {
      const {carId} = req.body;
      await Car.delete(carId);
      res.send({ success: true });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

router.route('/sale/delete')
  .post(async(req, res) => {
    try {
      const {saleId} = req.body;
      await Sale.delete(saleId);
      res.send({ success: true });
    } catch(error) {
      res.send({ success: false, message: error.message || "Something went wrong" });
    }
  })

export default router;