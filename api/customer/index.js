const {
  fetchCustomer,
  createCustomer,
  
} = require("../../db ");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const customer = await fetchCustomer();
    res.status(200).send(customer);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const customer = await createCustomer(name);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});



// router.post('/:customer_id/reservation', async (req, res, next) => {
//     try {
//       const reservation = await createReservation({customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, reservation_date: req.body.reservation_date});
//       res.status(201).send(reservation)
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = router;
