import Midtrans from "midtrans-client";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default snap;
