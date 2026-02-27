import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("Webhook hit");
    console.log("Method:", req.method);
    console.log("Body:", req.body);

    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const body = req.body;

    if (!body) {
      console.error("Body is empty");
      return res.status(400).send("No body");
    }

    const { order_id, status_code, gross_amount, signature_key } = body;

    if (!order_id) {
      console.error("order_id missing");
      return res.status(400).send("Invalid body");
    }

    const hash = crypto
      .createHash("sha512")
      .update(
        order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY,
      )
      .digest("hex");

    if (hash !== signature_key) {
      console.error("Invalid signature");
      return res.status(403).send("Invalid signature");
    }

    // 🔥 BALAS DULU KE MIDTRANS
    res.status(200).send("OK");

    // Forward async
    axios
      .post(
        "https://gxdtcyyjkqltlnwjzncl.supabase.co/functions/v1/midtrans-webhook",
        body,
        {
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      )
      .catch(console.error);
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).send("Server error");
  }
}
