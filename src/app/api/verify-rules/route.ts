import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    console.log('🔍 Testing Firestore rules...');

    // Test 1: Try to read from maintenance collection
    const maintenanceCollection = collection(db, 'maintenance');
    const maintenanceSnapshot = await getDocs(maintenanceCollection);
    console.log('✅ Read test passed - found', maintenanceSnapshot.size, 'maintenance entries');

    // Test 2: Try to read from users collection
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    console.log('✅ Users read test passed - found', usersSnapshot.size, 'user entries');

    // Test 3: Try to write a test document
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firestore rules verification test'
    };

    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Write test passed - created document with ID:', docRef.id);

    // Test 4: Clean up test document
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('✅ Delete test passed - cleaned up test document');

    return NextResponse.json({
      success: true,
      message: '🎉 All Firestore rules tests passed!',
      details: {
        maintenanceEntries: maintenanceSnapshot.size,
        userEntries: usersSnapshot.size,
        writeTest: 'success',
        deleteTest: 'success'
      }
    });

  } catch (error) {
    console.error('❌ Firestore rules test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Check for specific permission errors
    if (errorMessage.includes('Missing or insufficient permissions')) {
      return NextResponse.json({
        success: false,
        error: 'Firestore security rules are not configured correctly',
        message: '🚨 Please apply the ultra simple rules from ULTRA_SIMPLE_FIRESTORE_RULES.md',
        details: errorMessage
      }, { status: 403 });
    }

    return NextResponse.json({
      success: false,
      error: 'Firestore connection failed',
      message: '❌ There was an error testing Firestore',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function POST() {
  return GET(); // Same test for both GET and POST
}
