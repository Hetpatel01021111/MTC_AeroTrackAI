import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Test adding a maintenance entry
    const testEntry = {
      userId,
      flightNumber: 'TEST123',
      aircraftType: 'Test Aircraft',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      maintenanceType: 'A-Check',
      description: 'Test maintenance entry',
      createdAt: new Date().toISOString()
    };

    console.log('Attempting to add test maintenance entry:', testEntry);

    const docRef = await addDoc(collection(db, 'maintenance'), testEntry);
    console.log('Successfully added maintenance entry with ID:', docRef.id);

    // Test reading maintenance entries
    const maintenanceCollection = collection(db, 'maintenance');
    const querySnapshot = await getDocs(maintenanceCollection);
    const entries: any[] = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('Found maintenance entries:', entries.length);

    return NextResponse.json({ 
      success: true, 
      message: 'Maintenance test successful',
      testEntryId: docRef.id,
      totalEntries: entries.length,
      entries: entries.slice(0, 3) // Return first 3 entries for testing
    });

  } catch (error) {
    console.error('Error in maintenance test:', error);
    return NextResponse.json(
      { 
        error: 'Maintenance test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Simple connectivity test
    const maintenanceCollection = collection(db, 'maintenance');
    const querySnapshot = await getDocs(maintenanceCollection);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Firebase connection successful',
      entriesCount: querySnapshot.size
    });

  } catch (error) {
    console.error('Error testing Firebase connection:', error);
    return NextResponse.json(
      { 
        error: 'Firebase connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
