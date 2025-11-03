import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    // Check if all required config values are present
    const configCheck = {
      apiKey: !!firebaseConfig.apiKey,
      authDomain: !!firebaseConfig.authDomain,
      projectId: !!firebaseConfig.projectId,
      storageBucket: !!firebaseConfig.storageBucket,
      messagingSenderId: !!firebaseConfig.messagingSenderId,
      appId: !!firebaseConfig.appId,
      measurementId: !!firebaseConfig.measurementId
    };

    const allConfigPresent = Object.values(configCheck).every(Boolean);

    return NextResponse.json({
      success: true,
      message: 'Firebase configuration test',
      configCheck,
      allConfigPresent,
      projectId: firebaseConfig.projectId
    });

  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Firebase configuration test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
