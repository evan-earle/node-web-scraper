import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dealLink: {
      type: String,
    },
    retailer: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
