import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
      console.error("Invalid signature");
      return res.status(403).send("Invalid signature");
    }

    console.log("Webhook verified:", order_id);

    if (order_id.startsWith("RPOS-")) {
      await axios.post(
        "https://gxdtcyyjkqltlnwjzncl.supabase.co/functions/v1/midtrans-webhook",
        body,
      );
    }

    if (order_id.startsWith("MERN-")) {
      await axios.post(
        "https://mern-project-gamma-jet.vercel.app/midtrans/webhook",
        body,
      );
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Server error");
  }
}
