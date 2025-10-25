// src/services/watchlistService.js
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

const WATCHLIST_COLLECTION = 'watchlist';

// Add stock to watchlist
export const addToWatchlist = async (userId, stockData) => {
  try {
    const watchlistRef = collection(db, WATCHLIST_COLLECTION);
    
    // Check if stock already exists in watchlist
    const q = query(
      watchlistRef, 
      where('userId', '==', userId),
      where('ticker', '==', stockData.ticker)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Stock already in watchlist');
    }
    
    // Add new watchlist item
    const docRef = await addDoc(watchlistRef, {
      userId,
      ticker: stockData.ticker,
      companyName: stockData.companyName || stockData.ticker,
      dateAdded: serverTimestamp(),
      lastAnalyzedAt: serverTimestamp(),
      entryScore: stockData.entryScore || null,
      qualityGrade: stockData.qualityGrade || null,
      currentPrice: stockData.currentPrice || null,
      note: '',
      targetPrice: null
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

// Get user's watchlist
export const getWatchlist = async (userId) => {
  try {
    const watchlistRef = collection(db, WATCHLIST_COLLECTION);
    const q = query(watchlistRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const watchlist = [];
    querySnapshot.forEach((doc) => {
      watchlist.push({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded?.toDate?.() || new Date()
      });
    });
    
    return watchlist;
  } catch (error) {
    console.error('Error getting watchlist:', error);
    throw error;
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (itemId) => {
  try {
    await deleteDoc(doc(db, WATCHLIST_COLLECTION, itemId));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

// Update note
export const updateWatchlistNote = async (itemId, note) => {
  try {
    const docRef = doc(db, WATCHLIST_COLLECTION, itemId);
    await updateDoc(docRef, { note });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Update price data
export const updateWatchlistPrice = async (itemId, priceData) => {
  try {
    const docRef = doc(db, WATCHLIST_COLLECTION, itemId);
    await updateDoc(docRef, {
      currentPrice: priceData.currentPrice,
      lastAnalyzedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating price:', error);
    throw error;
  }
};