
const Payroll = require("../models/payrollModel")
const UserProfile = require("../models/userProfileModel");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const fetchPayrolls = async (req, res) => {

    try {
        const payrolls = await Payroll.find()
            .populate("employee", "name email role status");
        res.status(200).json({
            status: "Success",
            data: payrolls
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }

}

const fetchPayroll = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(404).json({
                status: 'Error',
                message: 'Employee not found'
            });
        }

        const payroll = await Payroll.findOne({
            employee: userId
        })
            .populate("employee", "name email role status");
        if (!payroll) {
            return res.status(404).json({ message: "No payroll found for this user" });
        }

        res.status(200).json({
            status: "Success",
            data: payroll
        });

    } catch (error) {
        res.status(500).json({
            status: 'Internal Server Error',
            message: error.message
        });
    }
}

const createPayroll = async (req, res) => {
    try {
        const { userId } = req.params
        const {
            employeeId,
            basicMonthPay,
            dailyRate,
            hourlyRate,
            earnings,
            deductions,
            employerContribution,
            netPay
        } = req.body
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        //Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 4. Create payroll
        const payroll = new Payroll({
            employee: userId,
            employeeId,
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
        res.status(500).json({
            status: 'Internal Server Error',
            message: error.message
        });
    }
}



module.exports = {
    fetchPayrolls,
    fetchPayroll,
    createPayroll
}