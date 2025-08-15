import Job from "../models/job.model.js";
import { errorHandler } from "../utils/error.js";

// Create Job
export const createJob = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a job"));
  }
  if (!req.body.title || !req.body.description || !req.body.company) {
    return next(errorHandler(400, "Title, company, and description are required"));
  }

  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9 -]/g, "");

  const newJob = new Job({
    ...req.body,
    slug,
    userId: req.user.id,
    author: req.user.id,
  });

  try {
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    next(error);
  }
};

// Get all jobs with filters
export const getAllJobs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const jobs = await Job.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.author && { author: req.query.author }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.jobId && { _id: req.query.jobId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { company: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .populate("author", "username profilePicture")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalJobs = await Job.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthJobs = await Job.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ jobs, totalJobs, lastMonthJobs });
  } catch (error) {
    next(error);
  }
};

// Update Job
export const updateJob = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this job"));
  }
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      {
        $set: {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          type: req.body.type,
          description: req.body.description,
          requirements: req.body.requirements,
          category: req.body.category,
          applyLink: req.body.applyLink,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// Delete Job
export const deleteJob = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this job"));
  }
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.status(200).json("The job has been deleted");
  } catch (error) {
    next(error);
  }
};
