# Regina Villa Website

A luxury long-stay villa website for **Regina Villa**, Galle, Sri Lanka.

## 🚀 Quick Start

```bash
npm install
node server.js
```

Then open **http://localhost:3000** in your browser.

## 📁 Project Structure

```
regina-villa-website/
├── server.js               ← Node.js/Express server
├── package.json
├── data/
│   ├── contact.json        ← Contact info (phone, address, etc.)
│   └── inquiries.json      ← Saved guest inquiries (auto-created)
└── public/
    ├── index.html          ← Homepage
    ├── gallery.html        ← Photo gallery
    ├── book.html           ← Booking inquiry page
    ├── about.html          ← About Galle page
    ├── contact.html        ← Contact page
    ├── admin.html          ← Admin panel (password protected)
    ├── css/style.css       ← Main stylesheet
    ├── js/main.js          ← Main JavaScript
    └── images/             ← Villa photos
```

## 🔐 Admin Panel

Visit **http://localhost:3000/admin**

**Default admin password:** `regina2024admin`

> ⚠️ **Change this password** in `server.js` before deploying! Search for `regina2024admin` and replace with a strong password.

### What the admin can do:
- **Update telephone number** — shown in the Contact section and footer
- **Update WhatsApp number**
- **Update email address**  
- **Update villa address**
- **View all guest inquiries** with names, emails, and duration preferences

## 🌐 Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage with hero slideshow, amenities, booking form |
| `/gallery` | Full photo gallery with lightbox |
| `/book` | Detailed booking inquiry page |
| `/about` | About Galle — lifestyle, attractions, visa info |
| `/contact` | Contact details + Google Maps + contact form |
| `/admin` | Password-protected admin panel |

## 🗺️ Google Maps

The map shows the exact location of Regina Villa at **6.0515405, 80.252308** — Galle, Sri Lanka.

## 📧 Guest Inquiries

All inquiries submitted via the website are saved to `data/inquiries.json` and viewable in the admin panel. You can also set up email notifications by extending `server.js`.

## 🌴 Key Features

- ✅ Minimum 3-month stay selector (3, 4, 5, 6, 9, 12, 18, 24 months)
- ✅ Animated hero slideshow with all villa images
- ✅ Full photo gallery with lightbox zoom
- ✅ Responsive design for mobile & desktop
- ✅ Google Maps embed (exact villa location)
- ✅ Contact details dynamically loaded from admin settings
- ✅ Guest inquiry form with email/phone capture
- ✅ Admin panel for contact info management
- ✅ Luxury dark-gold design aesthetic

## 🚢 Deployment

For production, consider using **PM2** or deploying to platforms like **Railway**, **Render**, or **VPS**:

```bash
npm install -g pm2
pm2 start server.js --name "regina-villa"
pm2 save
```
