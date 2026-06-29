const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, default: '' },
  checkIn:   { type: String, default: '' },
  duration:  { type: String, default: '' },
  message:   { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inquiry', InquirySchema);
