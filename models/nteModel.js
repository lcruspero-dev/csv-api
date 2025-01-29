const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nteSchema = new Schema({
  nte: {
    employeeId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },
    dateIssued: {
      type: String,
      required: true,
    },
    issuedBy: {
      type: String,
      required: true,
    },
    offenseType: {
      type: String,
      required: true,
    },
    offenseDescription: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
    employeeSignatureDate: {
      type: Date,
    },
    authorizedSignatureDate: {
      type: Date,
    },
  },
  employeeFeedback: {
    name: {
      type: String,
    },
    position: {
      type: String,
    },
    responseDate: {
      type: String,
    },
    responseDetail: {
      type: String,
    },
    employeeSignatureDate: {
      type: Date,
    },
  },
  noticeOfDecision: {
    name: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
    },
    nteIssuanceDate: {
      type: String,
    },
    writtenExplanationReceiptDate: {
      type: String,
    },
    nteDate: {
      type: String,
    },
    receivedDate: {
      type: String,
    },
    cocdViolated: {
      type: String,
    },
    findings: {
      type: String,
    },
    decision: {
      type: String,
    },
    employeeSignatureDate: {
      type: Date,
    },
    authorizedSignatureDate: {
      type: Date,
    },
  },
  status: {
    type: String,
    enum: ["DRAFT", "PER", "PNOD", "PNODA", "FTHR"],
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

nteSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("NTE", nteSchema);
