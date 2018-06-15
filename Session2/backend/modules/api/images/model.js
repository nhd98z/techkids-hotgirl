const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentModel = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true }
  },
  { timestamps: { createdAt: "createdAt" } }
);

const imageModel = new Schema(
  {
    image: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    comment: { type: [commentModel], default: [] }
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("images", imageModel);
