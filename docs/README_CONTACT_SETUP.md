# 📧 Contact Form Setup Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Install PHP (if not already installed)

**Windows:**
1. Download PHP from https://windows.php.net/download/
2. Extract to `C:\php`
3. Add `C:\php` to your system PATH

**Mac:**
```bash
brew install php
```

**Linux:**
```bash
sudo apt install php
```

### Step 2: Start PHP Server
Open terminal/command prompt in your project folder and run:

```bash
php -S localhost:8000
```

### Step 3: Open Your Website
Open your browser and go to:
```
http://localhost:8000/main.html
```

## ✅ How It Works

1. **User fills contact form** → Form data sent to `contact.php`
2. **PHP processes data** → Validates and formats email
3. **Email sent to you** → Beautiful HTML email sent to `asnanp875@gmail.com`
4. **Success feedback** → User sees confirmation with animations

## 📧 Email Features

- **Your Email:** asnanp875@gmail.com
- **Beautiful HTML Format:** Professional styling with gradients
- **Backup System:** All messages saved to `contact_backup.json`
- **Security:** Input validation and sanitization
- **Logging:** Successful submissions logged to `contact_log.txt`

## 🎯 What You'll Receive

When someone submits the form, you'll get an email like this:

```
Subject: New Portfolio Contact Message from [Name]

🚀 New Portfolio Contact Message

👤 Name: John Doe
📧 Email: john@example.com
💬 Message: Hi Asnan, I'd love to discuss a project...

Sent from your portfolio website contact form
Time: 2024-01-15 14:30:25
```

## 🔧 Troubleshooting

**Problem:** "Connection refused" error
**Solution:** Make sure PHP server is running with `php -S localhost:8000`

**Problem:** Email not sending
**Solution:** Check your server's mail configuration or use SMTP (see advanced setup below)

**Problem:** Form shows error
**Solution:** Check browser console for detailed error messages

## 🚀 Advanced SMTP Setup (Optional)

For better email delivery, you can configure SMTP. Edit `contact.php` and add:

```php
// Add at the top after <?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

// Replace the mail() function with PHPMailer for better delivery
```

## 📁 Files Created

- `contact.php` - Main email handler
- `contact_backup.json` - Backup of all messages
- `contact_log.txt` - Log of successful submissions
- `README_CONTACT_SETUP.md` - This setup guide

## 🎉 Features

✅ **Real Email Sending** - Actually sends emails to your Gmail
✅ **Beautiful HTML Emails** - Professional formatting with your branding
✅ **Form Validation** - Client and server-side validation
✅ **Success Animations** - Beautiful particle effects on success
✅ **Error Handling** - Graceful error messages
✅ **Backup System** - All messages saved locally
✅ **Security** - Input sanitization and validation
✅ **Responsive** - Works on all devices
✅ **Logging** - Track all submissions

## 🌐 Production Deployment

To deploy to a live server:

1. Upload all files to your web hosting
2. Make sure PHP is enabled
3. Configure SMTP if needed
4. Update any domain-specific settings

Your contact form is now fully functional! 🚀📧
