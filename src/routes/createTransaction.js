const express = require("express");
const router = express.Router();
const snap = require("../services/midtrans");

router.post("/", async (req, res) => {
  try {
    const { orderId, grossAmount, project } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating transaction" });
  }
});

module.exports = router;
