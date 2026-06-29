const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  email:    { type: String, default: '' },
  whatsapp: { type: String, default: '' },
}, { _id: false });

module.exports = mongoose.model('Contact', ContactSchema);
