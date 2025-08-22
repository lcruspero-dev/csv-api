const mongoose = require("mongoose");

// Earnings schema
const earningsSchema = new mongoose.Schema({
    basicPay: {
        type: Number,
        required: [true, "Basic Pay required"]
    },
    lateUndertime: Number,
    regOT: Number,
    resDayOT: Number,
    resDayOTExcess: Number,
    regularHolidayWork: Number,
    regularHolidayOT: Number,
    regularHolidayRD: Number,
    regularHolidayRDOT: Number,
    specialHolWorked: Number,
    specialHolOTExcess: Number,
    specialHolRDOTExcess: Number,
    noPay: Number,
    noOTPay: Number,
    noRDPay: Number,
    noRHPay: Number,
    noRHRDPay: Number,
    noSHPay: Number,
    noSHRDPay: Number,
    salaryAdjustment: Number,
    overtimeAdjustment: Number,
    bonus: Number,
    thirteenMonthPay: Number,
    nonTaxableAllowance: Number,
    performanceBonusCommision: Number,
    totalEarnings: Number,
});

// Deductions schema
const deductionsSchema = new mongoose.Schema({
    sssPremium: Number,
    wisp: Number,
    philhealth: Number,
    hdmfPremium: Number,
    sssPhicHdmfAdj: Number,
    withHoldingTax: Number,
    sssSalaryLoan: Number,
    sssCalamityLoan: Number,
    pagIbigLoan: Number,
    taxDuePayable: Number,
    advancesToEmployee: Number,
    totalDeductions: Number,
});

// Employer contributions schema
const employerContributionSchema = new mongoose.Schema({
    sssPremium: Number,
    ecEr: Number,
    philhealth: Number,
    hdmfPremium: Number,
    total: Number,
});

// Payroll schema
const payrollSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        employeeId: {   // 🔥 fixed name
            type: String,
            required: [true, "Employee ID is required"],
        },
        basicMonthPay: {
            type: Number,
            required: [true, "Basic Monthly Rate is required"],
        },
        dailyRate: {
            type: Number,
            required: [true, "Daily Rate is required"],
        },
        hourlyRate: {
            type: Number,
            required: [true, "Hourly Rate is required"],
        },
        earnings: earningsSchema,
        deductions: deductionsSchema,
        employerContribution: employerContributionSchema,
        netPay: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;
