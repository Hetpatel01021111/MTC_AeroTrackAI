"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Plane, Plus, Edit, Trash2, Filter, Search, CheckSquare, Square } from "lucide-react";
import { useMaintenance } from "@/contexts/maintenance-context";
import { AddFlightForm } from "./add-flight-form";

export function ScheduleMaintenance() {
  const { maintenanceEntries, updateMaintenanceEntry, deleteMaintenanceEntry, loading } = useMaintenance();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState<string>("all");
  const [updatingEntries, setUpdatingEntries] = useState<Set<string>>(new Set());

  // Debug: Log the data to see what we're working with
  console.log('Maintenance entries in scheduler:', maintenanceEntries);
  console.log('Loading state:', loading);
  
  // Debug: Log maintenance types to see exact values
  if (maintenanceEntries.length > 0) {
    console.log('Maintenance types in data:', maintenanceEntries.map(e => ({
      flight: e.flightNumber,
      type: e.maintenanceType,
      typeLength: e.maintenanceType?.length,
      typeChars: e.maintenanceType?.split('')
    })));
  }

  // Filter out duplicates and ensure unique keys
  const uniqueEntries = maintenanceEntries.filter((entry, index, arr) => 
    arr.findIndex(e => e.id === entry.id) === index
  );

  // Apply filters and search
  const filteredEntries = useMemo(() => {
    console.log('Filtering entries:', {
      total: uniqueEntries.length,
      searchTerm,
      statusFilter,
      maintenanceTypeFilter
    });

    return uniqueEntries.filter(entry => {
      // Enhanced search that includes maintenance type and status
      const searchLower = searchTerm.toLowerCase().trim();
      
      let matchesSearch = true;
      if (searchTerm) {
        // Log the search attempt
        console.log('Searching for:', searchLower, 'in entry:', {
          flightNumber: entry.flightNumber,
          maintenanceType: entry.maintenanceType,
          status: entry.status
        });

        matchesSearch = (
          entry.flightNumber.toLowerCase().includes(searchLower) ||
          entry.aircraftType.toLowerCase().includes(searchLower) ||
          (entry.userDisplayName || '').toLowerCase().includes(searchLower) ||
          (entry.description || '').toLowerCase().includes(searchLower) ||
          (entry.maintenanceType || '').toLowerCase().includes(searchLower) ||
          (entry.status || '').toLowerCase().includes(searchLower) ||
          // Special handling for "a check" -> "a-check"
          (searchLower === 'a check' && (entry.maintenanceType || '').toLowerCase() === 'a-check') ||
          (searchLower === 'b check' && (entry.maintenanceType || '').toLowerCase() === 'b-check') ||
          (searchLower === 'c check' && (entry.maintenanceType || '').toLowerCase() === 'c-check') ||
          // Handle partial matches
          (searchLower.includes('check') && (entry.maintenanceType || '').toLowerCase().includes(searchLower.replace(/\s+/g, '-')))
        );
      }
      
      const matchesStatus = statusFilter === "all" || (entry.status && entry.status.trim() === statusFilter);
      const matchesType = maintenanceTypeFilter === "all" || (entry.maintenanceType && entry.maintenanceType.trim() === maintenanceTypeFilter);
      
      // Debug the filter matching
      if (maintenanceTypeFilter !== "all") {
        console.log('Type filter check:', {
          filterValue: maintenanceTypeFilter,
          entryValue: entry.maintenanceType,
          matches: matchesType,
          flightNumber: entry.flightNumber
        });
      }
      
      const result = matchesSearch && matchesStatus && matchesType;
      
      if (searchTerm && result) {
        console.log('Entry matches search:', {
          flightNumber: entry.flightNumber,
          maintenanceType: entry.maintenanceType,
          status: entry.status,
          searchTerm
        });
      }
      
      return result;
    });
  }, [uniqueEntries, searchTerm, statusFilter, maintenanceTypeFilter]);

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    console.log('Changing status:', { id, newStatus });
    
    // Add to updating set
    setUpdatingEntries(prev => new Set([...prev, id]));
    
    try {
      await updateMaintenanceEntry(id, { status: newStatus as any });
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      // Remove from updating set
      setUpdatingEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleMaintenanceTypeChange = async (id: string, newMaintenanceType: string) => {
    console.log('Changing maintenance type:', { id, newMaintenanceType });
    
    // Add to updating set
    setUpdatingEntries(prev => new Set([...prev, id]));
    
    try {
      await updateMaintenanceEntry(id, { maintenanceType: newMaintenanceType as any });
      console.log('Maintenance type updated successfully');
    } catch (error) {
      console.error('Failed to update maintenance type:', error);
      alert('Failed to update maintenance type. Please try again.');
    } finally {
      // Remove from updating set
      setUpdatingEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this maintenance entry?')) {
      deleteMaintenanceEntry(id);
    }
  };

  const handleSelectEntry = (id: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEntries(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(entry => entry.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedEntries.size === 0) return;
    
    const count = selectedEntries.size;
    if (confirm(`Are you sure you want to delete ${count} maintenance entries?`)) {
      selectedEntries.forEach(id => {
        deleteMaintenanceEntry(id);
      });
      setSelectedEntries(new Set());
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedEntries.size === 0) return;
    
    console.log('Bulk updating status:', { count: selectedEntries.size, newStatus });
    
    try {
      // Update all selected entries
      const updatePromises = Array.from(selectedEntries).map(id => 
        updateMaintenanceEntry(id, { status: newStatus as any })
      );
      
      await Promise.all(updatePromises);
      console.log('Bulk status update completed successfully');
      setSelectedEntries(new Set());
    } catch (error) {
      console.error('Failed to bulk update status:', error);
      alert('Failed to update some entries. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMaintenanceTypeFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Main Content */}
      <div className="px-6 py-8 flex-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Add Button */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h2>
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Entry</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flights, aircraft, users, maintenance types (e.g., 'a check')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Maintenance Type Filter */}
              <select
                value={maintenanceTypeFilter}
                onChange={(e) => setMaintenanceTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="A-Check">A-Check</option>
                <option value="B-Check">B-Check</option>
                <option value="C-Check">C-Check</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Clear all filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => {
                  setMaintenanceTypeFilter('A-Check');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                A-Check
              </button>
              <button
                onClick={() => {
                  setMaintenanceTypeFilter('B-Check');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors"
              >
                B-Check
              </button>
              <button
                onClick={() => {
                  setMaintenanceTypeFilter('C-Check');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
              >
                C-Check
              </button>
              <button
                onClick={() => {
                  setStatusFilter('Scheduled');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
              >
                Scheduled
              </button>
              <button
                onClick={() => {
                  setStatusFilter('Completed');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
              >
                Completed
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedEntries.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedEntries.size} entries selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('Completed')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('Scheduled')}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Mark Scheduled
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-6 py-2 bg-yellow-50 border-t border-yellow-200 text-xs">
              <div className="text-yellow-800">
                <strong>Debug:</strong> Total entries: {maintenanceEntries.length} | 
                Unique: {uniqueEntries.length} | 
                Filtered: {filteredEntries.length} | 
                Loading: {loading ? 'Yes' : 'No'}
                {searchTerm && ` | Search: "${searchTerm}"`}
                {statusFilter !== "all" && ` | Status: ${statusFilter}`}
                {maintenanceTypeFilter !== "all" && ` | Type: ${maintenanceTypeFilter}`}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredEntries.length} of {uniqueEntries.length} entries
                {(searchTerm || statusFilter !== "all" || maintenanceTypeFilter !== "all") && 
                  " (filtered)"
                }
              </span>
              {selectedEntries.size > 0 && (
                <span className="text-blue-600 font-medium">
                  {selectedEntries.size} selected
                </span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center justify-center w-full"
                    >
                      {selectedEntries.size === filteredEntries.length && filteredEntries.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading maintenance entries...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {uniqueEntries.length === 0 
                        ? "No maintenance entries yet. Add your first entry above." 
                        : searchTerm || statusFilter !== "all" || maintenanceTypeFilter !== "all" 
                          ? `No entries match your filters. Showing 0 of ${uniqueEntries.length} entries.`
                          : "No maintenance entries found"}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <tr 
                      key={`${entry.id}-${index}`} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedEntries.has(entry.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectEntry(entry.id)}
                          className="flex items-center justify-center"
                        >
                          {selectedEntries.has(entry.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {(entry.userDisplayName || entry.userEmail || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.userDisplayName || entry.userEmail?.split('@')[0] || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">{entry.userEmail}</div>
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
                        <span className="text-sm text-gray-600">{entry.scheduledDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={entry.status}
                          onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                          disabled={updatingEntries.has(entry.id)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(entry.status)} ${
                            updatingEntries.has(entry.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {updatingEntries.has(entry.id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={entry.maintenanceType || 'A-Check'}
                          onChange={(e) => handleMaintenanceTypeChange(entry.id, e.target.value)}
                          disabled={updatingEntries.has(entry.id)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getMaintenanceTypeColor(entry.maintenanceType || 'A-Check')} ${
                            updatingEntries.has(entry.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <option value="A-Check">A-Check</option>
                          <option value="B-Check">B-Check</option>
                          <option value="C-Check">C-Check</option>
                        </select>
                        {updatingEntries.has(entry.id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Contact Us
            </a>
          </div>
          <div className="text-gray-600 text-sm">
            © 2024 AeroTrack AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Add Flight Form Modal */}
      <AddFlightForm 
        isOpen={isAddFormOpen} 
        onClose={() => setIsAddFormOpen(false)} 
      />
    </div>
  );
}