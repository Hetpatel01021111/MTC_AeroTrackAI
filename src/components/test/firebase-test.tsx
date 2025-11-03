"use client";

import { useState } from "react";
import { useMaintenance } from "@/contexts/maintenance-context";
import { useAuth } from "@/contexts/AuthContext";

export function FirebaseTest() {
  const { addMaintenanceEntry, maintenanceEntries, loading } = useMaintenance();
  const { user } = useAuth();
  const [testStatus, setTestStatus] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    if (!user) {
      setTestStatus("❌ No user authenticated");
      return;
    }

    setIsRunning(true);
    setTestStatus("🔄 Testing Firebase connection...");

    try {
      // Test adding a maintenance entry
      const testEntry = {
        icao24: 'TEST123',
        flightNumber: `TEST-${Date.now()}`,
        aircraftType: 'Test Aircraft',
        scheduledDate: new Date().toISOString().split('T')[0],
        status: 'Scheduled' as const,
        maintenanceType: 'A-Check' as const,
        description: 'Firebase connectivity test',
        estimatedDuration: '1 hour'
      };

      await addMaintenanceEntry(testEntry);
      
      setTestStatus("✅ Firebase test successful! Maintenance entry added.");
      
      // Wait a moment and check if it appears in the list
      setTimeout(() => {
        const found = maintenanceEntries.find(entry => 
          entry.flightNumber === testEntry.flightNumber
        );
        if (found) {
          setTestStatus("✅ Test complete! Entry saved and retrieved successfully.");
        } else {
          setTestStatus("⚠️ Entry added but not yet visible in list (may take a moment)");
        }
      }, 2000);

    } catch (error) {
      console.error('Firebase test failed:', error);
      setTestStatus(`❌ Firebase test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Firebase Test</h3>
        <p className="text-yellow-700">Please log in to test Firebase connectivity.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Firebase Connectivity Test</h3>
      <p className="text-blue-700 mb-4">
        User: {user.email} | Entries: {maintenanceEntries.length}
      </p>
      
      <button
        onClick={runTest}
        disabled={isRunning || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunning ? "Testing..." : "Test Firebase Connection"}
      </button>
      
      {testStatus && (
        <div className="mt-4 p-3 bg-white border rounded-lg">
          <p className="text-sm">{testStatus}</p>
        </div>
      )}
      
      {maintenanceEntries.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-blue-800 mb-2">Recent Entries:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {maintenanceEntries.slice(0, 3).map((entry, index) => (
              <li key={`test-${entry.id}-${index}`}>
                {entry.flightNumber} - {entry.status} - {entry.maintenanceType}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
