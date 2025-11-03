import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId, query, results } = await request.json();

    if (!userId || !query) {
      return NextResponse.json({ error: 'User ID and query are required' }, { status: 400 });
    }

    // Get current user data or create if doesn't exist
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    let userData;
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      userData = {
        uid: userId,
        searchHistory: [],
        createdAt: new Date(),
        lastUpdated: new Date()
      };
    } else {
      userData = userDoc.data();
    }

    const currentSearchHistory = userData.searchHistory || [];

    // Create new search item
    const searchItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      results
    };

    // Add to search history (keep last 50 searches)
    const updatedSearchHistory = [searchItem, ...currentSearchHistory].slice(0, 50);

    // Update user document
    await setDoc(userDocRef, {
      ...userData,
      searchHistory: updatedSearchHistory,
      lastUpdated: new Date()
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Search history saved successfully',
      searchItem 
    });

  } catch (error) {
    console.error('Error saving search history:', error);
    return NextResponse.json(
      { error: 'Failed to save search history' }, 
      { status: 500 }
    );
  }
}
