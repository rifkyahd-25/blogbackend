import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    applyLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
