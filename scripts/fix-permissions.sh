#!/bin/bash

# Quick Fix Script for Firebase Permission Error
# This script helps you set Firestore to test mode temporarily

echo "🔧 Firebase Permission Fix Script"
echo "=================================="
echo ""
echo "⚠️  You're getting a PERMISSION_DENIED error because Firestore"
echo "    is in production mode and blocking writes."
echo ""
echo "📋 Here's what you need to do:"
echo ""
echo "1️⃣  Go to Firestore Rules:"
echo "    https://console.firebase.google.com/project/health-manage01/firestore/rules"
echo ""
echo "2️⃣  Replace ALL existing rules with this (TEMPORARY):"
echo ""
echo "    rules_version = '2';"
echo "    service cloud.firestore {"
echo "      match /databases/{database}/documents {"
echo "        match /{document=**} {"
echo "          allow read, write: if true;"
echo "        }"
echo "      }"
echo "    }"
echo ""
echo "3️⃣  Click 'Publish' button"
echo ""
echo "4️⃣  Wait 10 seconds, then run:"
echo "    /usr/bin/node scripts/initFirebase.js"
echo ""
echo "5️⃣  After successful initialization, deploy production rules"
echo "    from the 'firestore.rules' file"
echo ""
echo "=================================="
echo ""
read -p "Press Enter to open Firebase Console in browser..."

# Try to open browser (works on most Linux systems)
if command -v xdg-open &> /dev/null; then
    xdg-open "https://console.firebase.google.com/project/health-manage01/firestore/rules"
elif command -v gnome-open &> /dev/null; then
    gnome-open "https://console.firebase.google.com/project/health-manage01/firestore/rules"
else
    echo "Please manually open: https://console.firebase.google.com/project/health-manage01/firestore/rules"
fi

echo ""
echo "📝 After setting test mode rules, run:"
echo "   /usr/bin/node scripts/initFirebase.js"
echo ""
