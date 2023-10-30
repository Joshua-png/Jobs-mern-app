import { nanoid } from "nanoid";
import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { UnauthorizedError } from "../errors/CustomErrors.js";
import day from "dayjs";

export const getAllJobs = async (req, res) => {
  const { search, jobType, jobStatus, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { company: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  const page = Number(req.query.page) || 1; // The frontend would provide the page
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  // const jobs = await Job.find({ createdBy: req.user.userId });

  const totalNumberOfJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalNumberOfJobs / limit);
  res.status(StatusCodes.OK).json({
    totalJob: totalNumberOfJobs,
    numOfPages,
    currentPage: page,
    jobs: jobs,
  });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getSingleJob = async (req, res) => {
  const { id } = req.params;

  //   const job = jobs.find((job) => job.id === id);
  const job = await Job.findById(id);
  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Job with id not found" });
  }

  console.log(`req.user.role: ${req.user.role}`);
  const admin = req.user.role === "admin";
  console.log(
    `req.user.userId: ${
      req.user.userId
    }, job.createdBy.toString(): ${job.createdBy.toString()}`
  );
  const owner = req.user.userId === job.createdBy.toString();
  console.log(`admin: ${admin} and owner: ${owner}`);

  if (!admin && !owner)
    throw new UnauthorizedError("not authorized to access this route");

  res.status(200).json({ job });
};

export const editJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Job with id not found" });
  }

  const admin = req.user.role === "admin";
  const owner = req.user.userId === job.createdBy.toString();

  if (!admin && !owner)
    throw new UnauthorizedError("not authorized to access this route");

  res.status(StatusCodes.OK).json({ job });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);
  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Job with id not found" });
  }

  const admin = req.user.role === "admin";
  const owner = req.user.userId === job.createdBy.toString();

  if (!admin && !owner)
    throw new UnauthorizedError("not authorized to access this route");

  res.status(StatusCodes.OK).json({ job, msg: "Job Deleted" });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((accumulator, currentValue) => {
    const { _id: title, count } = currentValue;
    accumulator[title] = count;
    return accumulator;
  }, {});
  // console.log(stats);

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 6,
    },
  ]);

  // monthlyApplications = monthlyApplications.reduce(
  //   (accumulator, currentValue, index) => {
  //     const { _id, count } = currentValue;
  //     accumulator[index] = { date: `${_id.month} ${_id.year}`, count };
  //     return accumulator;
  //   },
  //   []
  // );

  monthlyApplications = monthlyApplications
    .map((application) => {
      const {
        _id: { year, month },
        count,
      } = application;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");

      return { date, count };
    })
    .reverse();
  // console.log(monthlyApplications);

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
