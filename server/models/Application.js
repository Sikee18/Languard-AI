import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING'],
    default: 'SUBMITTED'
  },
  ownerName: { type: String, required: true },
  surveyNumber: { type: String, required: true },
  plotArea: { type: Number, required: true },
  location: { type: String, required: true },
  coordinates: { type: String },
  zoneType: { type: String, required: true },
  proposedFloors: { type: Number, required: true },
  hasBasement: { type: Boolean, default: false },
  payment: {
    transactionId: String,
    amount: Number,
    method: String,
    timestamp: Date,
    status: { type: String, default: 'PENDING' }
  },
  complianceResult: {
    decision: String,
    riskScore: Number,
    violatedRules: [String],
    officerRemarks: String
  },
  blockchainHash: String
});

export default mongoose.model('Application', ApplicationSchema);
