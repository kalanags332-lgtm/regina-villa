require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');
const Contact  = require('./models/Contact');
const Inquiry  = require('./models/Inquiry');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── MongoDB Connection ────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reginavilla';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed default contact info if not yet present
    const existing = await Contact.findById('singleton');
    if (!existing) {
      await Contact.create({
        _id:      'singleton',
        phone:    '+94 91 234 5678',
        address:  'Regina Villa, Galle Road, Galle 80000, Southern Province, Sri Lanka',
        email:    'stay@reginavilla.lk',
        whatsapp: '+94 77 123 4567',
      });
      console.log('✅ Default contact info seeded');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    // App still starts — API calls will return 503 if DB is down
  });

// ─── Helpers ───────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'regina2024admin';

function checkAdmin(password) {
  return password === ADMIN_PASSWORD;
}

// ─── API ROUTES ────────────────────────────────────────────────────────────────

// GET /api/contact  — public
app.get('/api/contact', async (req, res) => {
  try {
    const contact = await Contact.findById('singleton');
    if (!contact) return res.json({ phone: '', address: '', email: '', whatsapp: '' });
    res.json({
      phone:    contact.phone,
      address:  contact.address,
      email:    contact.email,
      whatsapp: contact.whatsapp,
    });
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// POST /api/admin/contact  — update contact info (admin only)
app.post('/api/admin/contact', async (req, res) => {
  const { phone, address, email, whatsapp, adminPassword } = req.body;

  if (!checkAdmin(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updated = await Contact.findByIdAndUpdate(
      'singleton',
      { $set: { phone, address, email, whatsapp } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

// POST /api/inquiry  — submit a guest inquiry (public)
app.post('/api/inquiry', async (req, res) => {
  const { name, email, phone, checkIn, duration, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const inquiry = await Inquiry.create({ name, email, phone, checkIn, duration, message });
    console.log('📩 New inquiry from:', name, email);
    res.json({ success: true, message: 'Inquiry received! We will contact you shortly.', id: inquiry._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// GET /api/admin/inquiries  — view all inquiries (admin only)
app.get('/api/admin/inquiries', async (req, res) => {
  const { adminPassword } = req.query;

  if (!checkAdmin(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const inquiries = await Inquiry.find().sort({ timestamp: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// DELETE /api/admin/inquiries/:id  — delete a single inquiry (admin only)
app.delete('/api/admin/inquiries/:id', async (req, res) => {
  const { adminPassword } = req.query;

  if (!checkAdmin(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// ─── HTML Routes ───────────────────────────────────────────────────────────────
app.get('/',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));
app.get('/about',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/book',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'book.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/admin',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ─── 404 Catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌴 Regina Villa website running at http://localhost:${PORT}\n`);
});
