#!/usr/bin/env node

/**
 * Update Articles with Images Script
 * Updates existing articles in Firebase with proper image URLs
 */

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Article image mappings based on title keywords
const articleImageMappings = {
  'heart': 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'diabetes': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'skin': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'yoga': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'mental': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'nutrition': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'exercise': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
  'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
};

function getImageUrlForArticle(title) {
  const titleLower = title.toLowerCase();
  
  for (const [keyword, imageUrl] of Object.entries(articleImageMappings)) {
    if (titleLower.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Default image if no keyword matches
  return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
}

async function updateArticlesWithImages() {
  console.log('🖼️  Updating Articles with Images');
  console.log('===============================');
  
  try {
    // Get all articles
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    
    console.log(`📚 Found ${articlesSnapshot.size} articles to update\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const articleDoc of articlesSnapshot.docs) {
      const articleData = articleDoc.data();
      const articleId = articleDoc.id;
      
      console.log(`📖 Processing: "${articleData.title}"`);
      
      if (!articleData.imageUrl || articleData.imageUrl.trim() === '') {
        // Article needs an image URL
        const newImageUrl = getImageUrlForArticle(articleData.title);
        
        await updateDoc(doc(db, 'articles', articleId), {
          imageUrl: newImageUrl
        });
        
        console.log(`   ✅ Updated with image: ${newImageUrl}`);
        updatedCount++;
      } else {
        console.log(`   ⏭️  Already has image: ${articleData.imageUrl}`);
        skippedCount++;
      }
      
      console.log('');
    }
    
    console.log('=====================================');
    console.log('📊 Update Summary:');
    console.log(`   ✅ Updated: ${updatedCount} articles`);
    console.log(`   ⏭️  Skipped: ${skippedCount} articles`);
    console.log(`   📚 Total: ${articlesSnapshot.size} articles`);
    console.log('=====================================');
    
    if (updatedCount > 0) {
      console.log('\n🎉 Articles successfully updated with images!');
      console.log('📱 Restart your app to see the changes.');
    } else {
      console.log('\n✨ All articles already have images!');
    }
    
  } catch (error) {
    console.error('❌ Error updating articles:', error);
    throw error;
  }
}

// Run the update
updateArticlesWithImages().then(() => {
  console.log('\n✅ Update completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Update failed:', error);
  process.exit(1);
});