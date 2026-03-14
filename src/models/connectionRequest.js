const { Schema, model } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    status: {
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
      type: String,
    },
    toUserId: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId))
    throw new Error("You can't send connection request to yourself");

  next();
});

const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
