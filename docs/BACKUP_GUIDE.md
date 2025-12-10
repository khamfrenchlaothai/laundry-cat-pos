# 💾 Backup & Restore Guide

**Keep your data safe with regular backups**

---

## 🎯 Why Backup?

Your POS data is stored locally on the tablet. Regular backups protect against:
- ❌ Tablet damage or loss
- ❌ Accidental data deletion
- ❌ Browser cache clearing
- ❌ App reinstallation

✅ **Recommendation**: Backup weekly or after busy days!

---

## 📤 How to Export Data

### Step-by-Step

1. Open the POS app on tablet
2. Tap **"Dashboard"** in the sidebar
3. Scroll to the bottom of the page
4. Tap **"Export Data"** button
5. A file named `laundry-cat-backup-[date].json` will download
6. Save this file safely!

### What Gets Exported?

The backup file contains:
- ✅ All items (services/products)
- ✅ All customers
- ✅ All sales history
- ✅ Export date and version info

### File Format

- **Type**: JSON (text file)
- **Size**: Usually 1-10 MB
- **Name**: `laundry-cat-backup-2024-12-09.json`

---

## 💾 Where to Store Backups

### Option 1: Email to Yourself (Recommended)

1. Export data on tablet
2. Open email app
3. Create new email to yourself
4. Attach the backup file
5. Send!

✅ **Pros**: Easy, accessible from anywhere
❌ **Cons**: Email size limits (usually 25MB)

### Option 2: Cloud Storage

Upload to:
- Google Drive
- Dropbox
- iCloud Drive
- OneDrive

✅ **Pros**: Automatic sync, large storage
❌ **Cons**: Requires cloud account

### Option 3: Computer

1. Connect tablet to computer via USB
2. Copy backup file to computer
3. Store in a dedicated folder

✅ **Pros**: Full control, no internet needed
❌ **Cons**: Manual process

### Option 4: Multiple Locations

Best practice:
1. Email to yourself
2. Upload to cloud
3. Keep one copy on computer

✅ **Pros**: Maximum safety!

---

## 📥 How to Import/Restore Data

### When to Restore

- Setting up new tablet
- After clearing browser data
- Recovering from data loss
- Moving data between devices

### Step-by-Step

1. Open the POS app
2. Go to **Dashboard**
3. Tap **"Import Data"** button
4. Select your backup JSON file
5. Confirm the import
6. Wait for "Data restored successfully!" message
7. Refresh the page

⚠️ **Warning**: Importing will REPLACE all current data!

---

## 🔄 Backup Schedule

### Recommended Schedule

| Frequency | When | Why |
|-----------|------|-----|
| **Daily** | End of busy days | Protect day's sales |
| **Weekly** | Every Sunday | Regular safety net |
| **Monthly** | End of month | Long-term archive |
| **Before Updates** | Before app changes | Safety before changes |

### Setting Reminders

1. Set phone/tablet reminder
2. Every Sunday at closing time
3. Title: "Backup POS Data"
4. Never skip!

---

## 📊 Backup File Contents

### Example Structure

```json
{
  "items": [
    {
      "id": 1,
      "name": "Wash & Fold",
      "price": 15000,
      "category": "Laundry"
    }
  ],
  "customers": [
    {
      "id": "7812976",
      "name": "Room 364",
      "phone": "55559900"
    }
  ],
  "sales": [
    {
      "id": 1733759234567,
      "date": "2024-12-09T15:30:00.000Z",
      "total": 15000,
      "items": [...]
    }
  ],
  "exportDate": "2024-12-09T15:30:00.000Z",
  "version": 1
}
```

---

## 🔍 Verifying Backups

### Check Backup is Valid

1. Open backup file in text editor
2. Should start with `{`
3. Should end with `}`
4. Should contain "items", "customers", "sales"
5. File size should be reasonable (not 0 KB)

### Test Restore (Optional)

1. Export current data (safety backup)
2. Import old backup
3. Verify data loaded correctly
4. Import your safety backup to restore current data

---

## 🆘 Emergency Recovery

### Lost All Data - Have Backup

1. Don't panic!
2. Find your latest backup file
3. Go to Dashboard
4. Tap "Import Data"
5. Select backup file
6. Confirm import
7. Data restored!

### Lost All Data - No Backup

Unfortunately, if you have no backup:
- ❌ Sales history is lost
- ❌ Customer data is lost
- ✅ Items can be re-added manually

**Prevention**: Always keep backups!

---

## 📱 Transferring Data Between Devices

### From Old Tablet to New Tablet

1. **On old tablet**:
   - Export data
   - Email file to yourself

2. **On new tablet**:
   - Open POS app
   - Go to Dashboard
   - Import the backup file
   - All data transferred!

### From Tablet to Computer (for viewing)

1. Export data from tablet
2. Transfer file to computer
3. Open file in text editor or JSON viewer
4. View all sales, customers, items

---

## 🔐 Backup Security

### Protecting Your Backups

- ✅ Use strong email password
- ✅ Enable 2-factor authentication
- ✅ Don't share backup files publicly
- ✅ Store in private cloud folders
- ✅ Delete very old backups (keep last 3 months)

### What's in the Backup?

- Customer names and phone numbers
- Sales amounts and dates
- Item prices
- **NO** payment card details (we don't store those)

---

## 💡 Best Practices

### Do's ✅

- ✅ Backup regularly (weekly minimum)
- ✅ Store in multiple locations
- ✅ Test restore occasionally
- ✅ Keep backups organized by date
- ✅ Verify backup file after export

### Don'ts ❌

- ❌ Rely on single backup
- ❌ Forget to backup for months
- ❌ Delete all old backups
- ❌ Share backup files publicly
- ❌ Ignore backup reminders

---

## 📅 Backup Checklist

### Weekly Backup Routine

- [ ] Open POS app
- [ ] Go to Dashboard
- [ ] Tap "Export Data"
- [ ] Email file to yourself
- [ ] Verify email received
- [ ] (Optional) Upload to cloud
- [ ] Mark task complete

**Time required**: 2-3 minutes

---

## 🔧 Troubleshooting

### Export button not working

- Refresh the page
- Try different browser
- Check browser console for errors

### Import fails

- Verify file is valid JSON
- Check file isn't corrupted
- Try older backup file
- Clear browser cache and retry

### File too large to email

- Use cloud storage instead
- Compress file (zip)
- Delete very old sales first, then export

### Can't find backup file

- Check Downloads folder
- Check email attachments
- Check cloud storage
- Search computer for `.json` files

---

## 📞 Need Help?

### For Backup Issues

1. Check this guide first
2. Verify backup file exists
3. Contact owner with:
   - Screenshot of error
   - Backup file (if available)
   - Description of problem

---

## 🎓 Training

New staff should know:
- [ ] How to export data
- [ ] Where backups are stored
- [ ] When to backup (schedule)
- [ ] How to verify backup worked
- [ ] Who to contact if issues

---

## 📝 Quick Reference

| Task | Steps |
|------|-------|
| **Export** | Dashboard → Export Data → Save file |
| **Import** | Dashboard → Import Data → Select file |
| **Email** | Export → Email app → Attach → Send |
| **Cloud** | Export → Cloud app → Upload |

---

**Remember**: Your data is only as safe as your last backup!

**Made with ❤️ for Laundry Cat Vientiane**
