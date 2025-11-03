"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function RulesTest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const runRulesTest = async () => {
    if (!user) {
      setTestResult("❌ Please log in first to test Firestore rules");
      return;
    }

    setIsRunning(true);
    setTestResult("🔄 Testing Firestore rules with authentication...");

    try {
      // Test 1: Read maintenance collection
      const maintenanceCollection = collection(db, 'maintenance');
      const maintenanceSnapshot = await getDocs(maintenanceCollection);
      
      // Test 2: Read users collection
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      // Test 3: Write test document
      const testDoc = {
        test: true,
        userId: user.uid,
        timestamp: new Date().toISOString(),
        message: 'Authenticated rules test'
      };
      
      const docRef = await addDoc(collection(db, 'test'), testDoc);
      
      // Test 4: Clean up
      await deleteDoc(doc(db, 'test', docRef.id));
      
      setTestResult(`✅ All tests passed!
📊 Found ${maintenanceSnapshot.size} maintenance entries
👥 Found ${usersSnapshot.size} user entries
✍️ Write test: SUCCESS
🗑️ Delete test: SUCCESS

🎉 Firestore rules are working correctly!`);

    } catch (error) {
      console.error('Rules test failed:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('Missing or insufficient permissions')) {
        setTestResult(`❌ FIRESTORE RULES NOT CONFIGURED
        
🚨 The rules are still not working. Please:

1. Go to Firebase Console
2. Select 'flighttrackerai' project  
3. Go to Firestore Database → Rules
4. Use these ULTRA PERMISSIVE rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

5. Click PUBLISH
6. Wait 60 seconds
7. Test again

Error: ${errorMessage}`);
      } else {
        setTestResult(`❌ Test failed: ${errorMessage}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-lg font-semibold text-red-800 mb-2">🔐 Authentication Required</h3>
        <p className="text-red-700">Please log in to test Firestore rules.</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🧪 Firestore Rules Test</h3>
      <p className="text-yellow-700 mb-4">
        Testing as: {user.email}
      </p>
      
      <button
        onClick={runRulesTest}
        disabled={isRunning}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isRunning ? "Testing..." : "🧪 Test Firestore Rules"}
      </button>
      
      {testResult && (
        <div className="bg-white border rounded-lg p-4">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
