import { Router } from "express";
import {
  getAllJobs,
  getSingleJob,
  createJob,
  editJob,
  deleteJob,
  showStats,
} from "../controllers/JobController.js";
import {
  validateIdParams,
  validateJob,
} from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJob, createJob);

router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(validateIdParams, getSingleJob)
  .patch(checkForTestUser, validateJob, validateIdParams, editJob)
  .delete(checkForTestUser, validateIdParams, deleteJob);

export default router;
