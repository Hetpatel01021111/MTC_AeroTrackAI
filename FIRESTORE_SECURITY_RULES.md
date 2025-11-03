# Firestore Security Rules Configuration

## Issue: Missing or Insufficient Permissions

The error "Missing or insufficient permissions" occurs because Firestore has restrictive default security rules that prevent read/write operations.

## Required Firestore Security Rules

To fix the permissions issue, you need to update the Firestore security rules in the Firebase Console:

### 1. Access Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `flighttrackerai`
3. Navigate to **Firestore Database** > **Rules**

### 2. Update Security Rules

Replace the default rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Maintenance entries - users can only access their own entries
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid) &&
        (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
  }
}
```

### 3. Alternative: Development Rules (Less Secure)

For development/testing purposes only, you can use these more permissive rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning**: The development rules above are less secure and should only be used during development.

### 4. Production Rules (Recommended)

For production, use these more secure rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only access their own document
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && isValidUserData(request.resource.data);
    }
    
    // Maintenance collection - users can only access their own entries
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid) &&
        (request.resource == null || request.resource.data.userId == request.auth.uid) &&
        isValidMaintenanceData(request.resource.data);
    }
    
    // Function to validate user data structure
    function isValidUserData(data) {
      return data.keys().hasAll(['uid', 'email', 'displayName', 'createdAt']) &&
             data.uid is string &&
             data.email is string &&
             data.displayName is string;
    }
    
    // Function to validate maintenance data structure
    function isValidMaintenanceData(data) {
      return data.keys().hasAll(['userId', 'flightNumber', 'aircraftType', 'scheduledDate', 'status', 'maintenanceType', 'createdAt']) &&
             data.userId is string &&
             data.flightNumber is string &&
             data.aircraftType is string &&
             data.status in ['Scheduled', 'Pending', 'Completed', 'Cancelled'] &&
             data.maintenanceType in ['A-Check', 'B-Check', 'C-Check'];
    }
  }
}
```

## Current Application Behavior

The application has been updated with comprehensive error handling:

✅ **Graceful Degradation**: Authentication works even if Firestore fails
✅ **Local State Management**: User data is maintained locally when Firestore is unavailable
✅ **Error Logging**: Detailed error messages for debugging
✅ **Non-blocking**: Firestore errors don't prevent user authentication

## Features That Work Without Firestore

- ✅ User authentication (email/password and Google)
- ✅ Basic user profile information
- ✅ Local search history (session-based)
- ✅ All chat functionality

## Features That Require Firestore

- 🔄 Persistent search history across sessions
- 🔄 User profile data persistence
- 🔄 Cross-device data synchronization

## Testing the Fix

1. Update the Firestore security rules as shown above
2. Refresh the application
3. Try signing up or logging in
4. Check browser console - Firestore errors should be resolved

## Troubleshooting

If you still see permission errors:

1. **Check Authentication**: Ensure user is properly authenticated
2. **Verify Rules**: Double-check the security rules syntax
3. **Clear Cache**: Clear browser cache and refresh
4. **Check Console**: Look for detailed error messages in Firebase Console

The application will continue to work with basic functionality even if Firestore permissions are not configured, thanks to the error handling improvements.
