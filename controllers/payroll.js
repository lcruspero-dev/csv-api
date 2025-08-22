const mongoose = require("mongoose")

const payrollSchema = mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: [
                "user",
                "HR",
                "IT",
                "SUPERADMIN",
                "TL",
                "ACCOUNTING"
            ]
        },
        sss: {
            type: String,
            required: [
                true,
                "SSS is Required"
            ]
        },
        pagIbig: {
            type: String,
            required: [
                true,
                "Pag-Ibig is required"
            ]
        },
        philHealth: {
            type: String,
            required: [
                true,
                "Philhealth  is required"
            ]
        }

    }
);

module.exports = mongoose.model('Payroll', payrollSchema);