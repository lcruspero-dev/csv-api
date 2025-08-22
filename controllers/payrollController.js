const Payroll = require("../models/payrollModel");
const User = require("../models/userModel"); // 🔥 fixed
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fetch all payrolls
const fetchPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find()
            .populate("employee", "name email role status");
        res.status(200).json({ status: "Success", data: payrolls });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

// Fetch payrolls for one employee
const fetchPayroll = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                status: "Error",
                message: "Invalid employee ObjectId"
            });
        }

        const payrolls = await Payroll.find({ employee: id })
            .populate("employee", "name email role status");

        if (!payrolls || payrolls.length === 0) {
            return res.status(404).json({ message: "No payrolls found for this user" });
        }

        res.status(200).json({ status: "Success", data: payrolls });

    } catch (error) {
        res.status(500).json({ status: "Internal Server Error", message: error.message });
    }
};


const createPayroll = async (req, res) => {
    try {
        const {
            employee,      // ObjectId of User
            employeeId,    // optional, can be same as employee
            basicMonthPay,
            dailyRate,
            hourlyRate,
            earnings,
            deductions,
            employerContribution,
            netPay
        } = req.body;

        if (!isValidObjectId(employee)) {
            return res.status(400).json({ message: "Invalid Employee ObjectId" });
        }

        const user = await User.findById(employee);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payroll = new Payroll({
            employee,
            employeeId: employeeId || employee, // ✅ keep same as user _id if not given
            basicMonthPay,
            dailyRate,
            hourlyRate,
            earnings,
            deductions,
            employerContribution,
            netPay,
        });

        await payroll.save();

        res.status(201).json({
            message: "Payroll created successfully",
            payroll: await payroll.populate("employee", "name email role status"),
        });

    } catch (error) {
        res.status(500).json({ status: "Internal Server Error", message: error.message });
    }
};


module.exports = {
    fetchPayrolls,
    fetchPayroll,
    createPayroll
};
