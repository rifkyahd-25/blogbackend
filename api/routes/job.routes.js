import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createJob, updateJob, deleteJob, getAllJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createJob);
router.get("/getall", getAllJobs);
router.put("/update/:jobId/:userId", verifyToken, updateJob);
router.delete("/delete/:jobId/:userId", verifyToken, deleteJob);

export default router;
