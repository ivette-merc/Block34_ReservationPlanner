const router = require("express").Router();

router.use("/customer", require("./customer"));
router.use("/restaurant", require("./restaurant"));
router.use("/reservation", require("./reservation"));

module.exports = router;
