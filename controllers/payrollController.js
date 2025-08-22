
const asyncHandler = require("express-async-handler");
const Payroll = require("../models/payrollModel")
const UserProfile = require("../models/userProfileModel");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);