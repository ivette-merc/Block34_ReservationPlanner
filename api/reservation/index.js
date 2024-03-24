const { fetchReservation } = require("../../db ");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const reservation = await fetchReservation();
    res.status(200).send(reservation);
  } catch (error) {
    next(error);
  }
});

router.delete("/:reservation_id", async (req, res, next) => {
  try {
    await deleteReservation({
      //   customer_id: req.params.customer_id,
      id: req.params.id,
    });
    res.status(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
