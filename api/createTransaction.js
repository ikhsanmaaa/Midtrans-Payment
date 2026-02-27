import snap from "../services/midtrans.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { orderId, grossAmount } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating transaction" });
  }
}
