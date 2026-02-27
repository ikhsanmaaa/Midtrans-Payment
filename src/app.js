require("dotenv").config();
const express = require("express");

const createTransactionRoute = require("./routes/createTransaction");
const webhookRoute = require("./routes/webhook");

const app = express();

app.use(express.json());

app.use("/create-transaction", createTransactionRoute);
app.use("/webhook", webhookRoute);

app.get("/", (req, res) => {
  res.send("Payment Service Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
