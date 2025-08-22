const Payroll = require("../models/payrollModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fetch all payrolls with employee details
const fetchPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find()
            .populate("employee", "name email role status");
        // populate will fetch only selected fields from User

        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payrolls", error });
    }
};

// Fetch payroll by User ID
const fetchPayrollByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const payroll = await Payroll.findOne({ employee: userId })
            .populate("employee", "name email role status");

        if (!payroll) {
            return res.status(404).json({ message: "No payroll found for this user" });
        }

        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payroll by user", error });
    }
};

// Fetch payroll by email dynamically
const fetchPayrollByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payroll = await Payroll.findOne({ employee: user._id })
            .populate("employee", "name email role status");

        if (!payroll) {
            return res.status(404).json({ message: "No payroll found for this user" });
        }

        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payroll by email", error });
    }
};

module.exports = {
    fetchPayrolls,
    fetchPayrollByUserId,
    fetchPayrollByEmail,
};


const Payroll = require("../models/payrollModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create payroll for a user
const createPayroll = async (req, res) => {
    try {
        const { userId } = req.params; // userId from route
        const {
            employeeID,
            basicMonthPay,
            dailyRate,
            hourlyRate,
            earnings,
            deductions,
            employerContribution,
            netPay,
        } = req.body;

        // 1. Validate ObjectId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        // 2. Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Check if payroll already exists for this user (optional)
        const existingPayroll = await Payroll.findOne({ employee: userId });
        if (existingPayroll) {
            return res
                .status(400)
                .json({ message: "Payroll already exists for this user" });
        }

        // 4. Create payroll
        const payroll = new Payroll({
            employee: userId,
            employeeID,
            basicMonthPay,
            dailyRate,
            hourlyRate,
            earnings,
            deductions,
            employerContribution,
            netPay,
        });

        await payroll.save();

        // 5. Return response
        res.status(201).json({
            message: "Payroll created successfully",
            payroll: await payroll.populate("employee", "name email role status"),
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating payroll", error });
    }
};

module.exports = {
    createPayroll,
};
