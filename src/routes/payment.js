const express = require("express");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const razorpayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");

const { userAuth } = require("../middlewares/auth");

const Payment = require("../models/payment");
const User = require("../models/user");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { _id, firstName, lastName, emailId } = req.user;
    const { membership } = req.body;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membership] * 100, // this amount is in lower denomination like paisa, cents, etc
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membership,
      },
    });
    const payment = new Payment({ ...order, userId: _id });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ message: "Webhook signature is invalid" });
    }

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ id: paymentDetails.order_id });

    payment.status = paymentDetails.status;

    await payment.save();

    const user = await User.findOne({ _id: payment.userId });

    user.isPremium = true;
    user.membership = payment.notes.membership;

    await user.save();

    // Don't forget to do this otherwise razorpay will keep calling this PAI in a loop.
    return res.status(200).json({ message: "Webhook recieved successfully" });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

paymentRouter.post("/premium/verify", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user.toJSON();

    if (loggedInUser.isPremium) {
      res.json({ isPremium: true });
    }

    res.json({ isPremium: false });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = paymentRouter;
