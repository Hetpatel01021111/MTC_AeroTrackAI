# Simple Firestore Rules for Development

## 🚨 IMMEDIATE FIX - Use These Rules

Copy and paste these **simplified rules** into Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write maintenance entries
    // Simplified rule for development
    match /maintenance/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔧 Why This Works

The previous rules were too restrictive and causing permission issues. These simplified rules:

1. **Users Collection**: Users can only access their own user document
2. **Maintenance Collection**: Any authenticated user can read/write maintenance entries (simplified for development)

## 🎯 After Applying These Rules

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `flighttrackerai`
3. **Navigate to**: Firestore Database → Rules
4. **Replace existing rules** with the code above
5. **Click "Publish"**

## ✅ Expected Results

After applying these rules, you should see:
- ✅ No more "Missing or insufficient permissions" errors
- ✅ Search history saves successfully (no more 500 errors)
- ✅ Maintenance entries load properly
- ✅ User names display correctly in maintenance entries
- ✅ Firebase test component shows success

## 🔄 Test Steps

1. Apply the rules above
2. Refresh your application
3. Try the Firebase test on the dashboard
4. Add a maintenance entry
5. Check that it appears with your user name

## 📊 Production Rules (Later)

Once everything is working, you can switch to more secure rules that restrict maintenance entries to only the user who created them. But for now, use the simple rules above to get everything working.

**Apply these rules now and test the application!**
