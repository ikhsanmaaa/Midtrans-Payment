const express = require("express");
const crypto = require("crypto");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = body;

    const hash = crypto
      .createHash("sha512")
      .update(
        order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY,
      )
      .digest("hex");

    if (hash !== signature_key) {
      return res.status(403).send("Invalid signature");
    }

    console.log("Webhook verified:", order_id);

    if (order_id.startsWith("SUPA-")) {
      await axios.post(
        "https://your-supabase-url/functions/v1/midtrans-webhook",
        body,
      );
    }

    if (order_id.startsWith("WEB-")) {
      await axios.post("https://your-express-app.com/midtrans/webhook", body);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
