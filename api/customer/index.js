const {
  fetchCustomer,
  createCustomer,
  createReservation,

  deleteReservation,
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

router.post("/:customer_id/reservation", async (req, res, next) => {
  try {
    const reservation = await createReservation({
      customer_id: req.params.customer_id,
      party_count: req.body.party_count,
      restaurant_id: req.body.restaurant_id,
      reservation_date: req.body.reservation_date,
    });
    res.status(201).send(reservation);
  } catch (error) {
    next(error);
  }
});

router.delete("/:customer_id/reservation/:id", async (req, res) => {
  const { customer_id, id } = req.params;
  try {
    await deleteReservation(customer_id, id);
    res.status(200).send("Favorite deleted successfully");
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
