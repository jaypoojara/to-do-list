import express from "express";
import usersRouter from "./users.js";
import tasksRouter from "./tasks.js";
import { notFoundRoutesHandling } from "../services/notFoundRoutesHandlingService.js";
const router = express.Router();

router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);

// Handle non-existing routes
router.all('*', notFoundRoutesHandling)

export default router;
