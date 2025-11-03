"use client";

import { useState, useEffect } from "react";
import { useMaintenance } from "@/contexts/maintenance-context";
import { Calendar, Plane } from "lucide-react";
import { FirebaseTest } from "@/components/test/firebase-test";
import { RulesTest } from "@/components/test/rules-test";

export function Dashboard() {
  const { maintenanceEntries, loading } = useMaintenance();
  const [totalFlights, setTotalFlights] = useState(0);
  const [maintenanceCompleted, setMaintenanceCompleted] = useState(0);
  const [maintenanceDue, setMaintenanceDue] = useState(0);

  // Calculate real statistics from maintenance entries
  const completedEntries = maintenanceEntries.filter(entry => entry.status === 'Completed').length;
  const scheduledEntries = maintenanceEntries.filter(entry => entry.status === 'Scheduled').length;
  const totalEntries = maintenanceEntries.length;

  // Get the last 5 maintenance entries (most recent first) and ensure uniqueness
  const uniqueEntries = maintenanceEntries.filter((entry, index, arr) => 
    arr.findIndex(e => e.id === entry.id) === index
  );
  const lastFiveEntries = uniqueEntries.slice(0, 5);

  useEffect(() => {
    const animateCounter = (setter: (value: number) => void, target: number, duration: number) => {
      const startTime = Date.now();
      const startValue = 0;
      
      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
        
        setter(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    };

    // Animate counters with real data when maintenance entries change
    if (maintenanceEntries.length > 0) {
      setTimeout(() => animateCounter(setTotalFlights, totalEntries, 1500), 100);
      setTimeout(() => animateCounter(setMaintenanceCompleted, completedEntries, 1200), 300);
      setTimeout(() => animateCounter(setMaintenanceDue, scheduledEntries, 1000), 500);
    }
  }, [maintenanceEntries, totalEntries, completedEntries, scheduledEntries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMaintenanceTypeColor = (maintenanceType: string) => {
    switch (maintenanceType) {
      case "A-Check":
        return "bg-yellow-100 text-yellow-800";
      case "B-Check":
        return "bg-orange-100 text-orange-800";
      case "C-Check":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Firebase Test Component */}
      <FirebaseTest />
      
      {/* Rules Test Component */}
      <RulesTest />
      
      {/* Key Metrics Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Maintenance Entries Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-2 hover:border-blue-500 transition-colors duration-200 cursor-pointer">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Maintenance</h3>
            <p className="text-3xl font-bold text-gray-900">{totalFlights}</p>
          </div>

          {/* Maintenance Completed Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-2 hover:border-green-500 transition-colors duration-200 cursor-pointer">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{maintenanceCompleted}</p>
          </div>

          {/* Maintenance Scheduled Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-2 hover:border-blue-500 transition-colors duration-200 cursor-pointer">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Scheduled</h3>
            <p className="text-3xl font-bold text-blue-600">{maintenanceDue}</p>
          </div>
        </div>

        {/* Maintenance Schedule Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Maintenance Entries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aircraft Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maintenance Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-500">Loading maintenance entries...</span>
                      </div>
                    </td>
                  </tr>
                ) : lastFiveEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <Plane className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No maintenance entries yet</p>
                        <p className="text-sm">Add maintenance entries through the chat or maintenance scheduler</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  lastFiveEntries.map((entry, index) => (
                    <tr key={`dashboard-${entry.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-800">
                                {(entry.userDisplayName || entry.userEmail || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.userDisplayName || entry.userEmail?.split('@')[0] || 'User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{entry.flightNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{entry.aircraftType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {new Date(entry.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceTypeColor(entry.maintenanceType || 'A-Check')}`}>
                          {entry.maintenanceType || 'A-Check'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
