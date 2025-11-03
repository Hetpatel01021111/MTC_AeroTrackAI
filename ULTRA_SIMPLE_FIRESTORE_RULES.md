# 🚨 ULTRA SIMPLE FIRESTORE RULES - IMMEDIATE FIX

## Copy These Rules EXACTLY Into Firebase Console

**Go to Firebase Console → Firestore Database → Rules and replace ALL content with:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## ✅ What This Does

- **Allows ANY authenticated user** to read/write ANY document
- **Simple and permissive** - perfect for development
- **Will fix ALL permission errors** immediately

## 🎯 Steps to Apply

1. **Open**: https://console.firebase.google.com/
2. **Select**: Your `flighttrackerai` project
3. **Click**: Firestore Database (left sidebar)
4. **Click**: Rules tab (top of page)
5. **DELETE** all existing rules
6. **PASTE** the rules above
7. **Click**: Publish

## 🔄 After Applying

- Refresh your application
- All permission errors will disappear
- Search history will save
- Maintenance entries will load
- User names will display properly

## ⚠️ Important Notes

- These rules are VERY permissive (for development only)
- Any authenticated user can access any data
- Perfect for testing and development
- Switch to more secure rules later for production

**Apply these rules RIGHT NOW to fix all issues!**
