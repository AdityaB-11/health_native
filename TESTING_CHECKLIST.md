# Testing & Verification Checklist

## ✅ Code Quality Checks

### TypeScript Compilation
- [x] MedicineListScreen.tsx - No errors
- [x] ArticleListScreen.tsx - No errors
- [x] ArticleDetailScreen.tsx - No errors
- [x] types/index.ts - Updated with externalUrl field
- [x] mockData.ts - Updated with image URLs and links

### Import Statements
- [x] All use MaterialCommunityIcons from @expo/vector-icons
- [x] LinearGradient imported where needed
- [x] React Native Linking imported for external URLs
- [x] All Paper components properly imported

### Type Safety
- [x] Gradient colors use `as const` for tuple types
- [x] Cart state typed as `{[key: string]: number}`
- [x] Article type includes optional externalUrl field
- [x] All function parameters properly typed

---

## 🛒 Medicines Section Tests

### Cart Functionality
- [ ] **Add to Cart**
  - [ ] Tap "Add to Cart" button
  - [ ] Verify button transforms to [-] 1 [+] controls
  - [ ] Check cart badge shows count
  - [ ] Verify floating cart summary appears

- [ ] **Increase Quantity**
  - [ ] Tap [+] button
  - [ ] Verify quantity increases
  - [ ] Check cart badge updates
  - [ ] Verify total price recalculates

- [ ] **Decrease Quantity**
  - [ ] Tap [-] button
  - [ ] Verify quantity decreases
  - [ ] When quantity reaches 0:
    - [ ] Controls transform back to "Add to Cart"
    - [ ] Item removed from cart
    - [ ] Cart badge decrements

- [ ] **Total Calculation**
  - [ ] Add multiple items
  - [ ] Verify total price = sum of (price × quantity)
  - [ ] Check floating summary shows correct total

### UI/UX
- [ ] **Header**
  - [ ] Orange gradient displays correctly
  - [ ] Cart icon visible in top-right
  - [ ] Badge shows total item count
  - [ ] Badge hidden when cart empty

- [ ] **Search**
  - [ ] Search bar overlaps header by -20px
  - [ ] Search filters by name
  - [ ] Search filters by generic name
  - [ ] Search filters by manufacturer
  - [ ] Search case-insensitive

- [ ] **Category Filter**
  - [ ] All categories display horizontally
  - [ ] Selected category highlighted
  - [ ] Filter works correctly
  - [ ] Combined with search works

- [ ] **Product Cards**
  - [ ] Gradient image area 120px height
  - [ ] Rx badge shows for prescription items
  - [ ] Out of stock chip displays when inStock=false
  - [ ] Price shows with "per unit"
  - [ ] Product info readable
  - [ ] Cards have rounded corners

- [ ] **Floating Cart**
  - [ ] Only visible when cart has items
  - [ ] Fixed at bottom of screen
  - [ ] Shows total price
  - [ ] Shows item count in checkout button
  - [ ] Doesn't overlap content

---

## 📰 Articles Section Tests

### Article List
- [ ] **Header**
  - [ ] Red gradient displays correctly
  - [ ] "Health Blog" title visible
  - [ ] Article count shows (e.g., "5 articles")
  - [ ] "Stay informed" subtitle visible

- [ ] **Search**
  - [ ] Search bar overlaps header
  - [ ] Search filters by title
  - [ ] Search filters by summary
  - [ ] Search filters by category
  - [ ] Search filters by tags

- [ ] **Category Filter**
  - [ ] All 6 categories display
  - [ ] Horizontal scroll works
  - [ ] Selected category red background
  - [ ] Selected category white text
  - [ ] Filter works correctly

- [ ] **Blog Cards**
  - [ ] Hero image/gradient 200px height
  - [ ] Category badge in top-right
  - [ ] Author icon + name displayed
  - [ ] Read time shows (e.g., "5 min")
  - [ ] Title truncates to 2 lines
  - [ ] Summary truncates to 3 lines
  - [ ] Max 3 tags display
  - [ ] Tags show with # prefix
  - [ ] Date visible in footer
  - [ ] "Read More" button with arrow

- [ ] **Navigation**
  - [ ] Tap card navigates to detail
  - [ ] Correct article loaded

### Article Detail
- [ ] **Hero Section**
  - [ ] Hero image loads (if URL valid)
  - [ ] Falls back to gradient if no image
  - [ ] Image is 300px height
  - [ ] Category badge overlays image
  - [ ] Badge in top-right position

- [ ] **Content Card**
  - [ ] White card overlaps hero by -30px
  - [ ] Card has rounded corners (16px)
  - [ ] Card elevated above background
  - [ ] Padding looks correct

- [ ] **Author Section**
  - [ ] Circular avatar icon (40px)
  - [ ] Author name bold
  - [ ] Calendar icon + date
  - [ ] Clock icon + read time
  - [ ] Icons properly aligned

- [ ] **Summary Box**
  - [ ] Orange tinted background
  - [ ] Orange left border (4px)
  - [ ] Text is bold
  - [ ] Box has padding
  - [ ] Slightly elevated

- [ ] **Content**
  - [ ] Full article content displays
  - [ ] Text is justified
  - [ ] Line height makes it readable
  - [ ] Font size 15px
  - [ ] Text color dark but not black

- [ ] **Tags**
  - [ ] "Topics" heading shows
  - [ ] All tags display
  - [ ] Tags have # prefix
  - [ ] Red border and text
  - [ ] Pills properly spaced

- [ ] **External Link**
  - [ ] Button only shows if externalUrl exists
  - [ ] Button is red
  - [ ] "open-in-new" icon displays
  - [ ] Text says "Read Full Article"
  - [ ] Tap opens URL in browser
  - [ ] URL opens successfully

---

## 🎨 Visual Design Tests

### Medicines
- [ ] Orange gradient header (#FF9800 → #F57C00)
- [ ] Cart controls orange gradient
- [ ] Checkout button green (#4CAF50)
- [ ] Rx badge red (#F44336)
- [ ] Product cards white background
- [ ] Proper spacing between cards
- [ ] Icons render correctly
- [ ] Gradient image placeholders colorful

### Articles
- [ ] Red gradient header (#F44336 → #D32F2F)
- [ ] Category chips highlight red when selected
- [ ] Summary box orange tint (#FFF3E0)
- [ ] Tags red text (#F44336)
- [ ] Link button red (#F44336)
- [ ] Article cards white background
- [ ] Hero images/gradients colorful
- [ ] Icons render correctly

---

## 📱 Responsive Tests

### Different Screen Sizes
- [ ] Works on small phones (5-inch)
- [ ] Works on medium phones (6-inch)
- [ ] Works on large phones (6.5+ inch)
- [ ] Works on tablets

### Scrolling
- [ ] **Medicines**
  - [ ] Header stays at top
  - [ ] Search bar scrolls with content
  - [ ] Floating cart stays at bottom
  - [ ] Product list scrolls smoothly
  - [ ] Cart summary doesn't overlap content

- [ ] **Articles**
  - [ ] Header stays at top
  - [ ] Search bar scrolls with content
  - [ ] Article list scrolls smoothly
  - [ ] Article detail scrolls from hero to content
  - [ ] No jerky animations

---

## 🔍 Edge Cases

### Medicines
- [ ] Empty cart state
- [ ] Single item in cart
- [ ] All items out of stock
- [ ] Very long medicine names
- [ ] Very long manufacturer names
- [ ] Price with decimals (e.g., ₹10.50)
- [ ] Price without decimals (e.g., ₹100)
- [ ] Search with no results
- [ ] Category filter with no results

### Articles
- [ ] Article with no image (gradient fallback)
- [ ] Article with broken image URL
- [ ] Article without external URL (button hidden)
- [ ] Very long article title
- [ ] Very long article content
- [ ] Article with 1 tag
- [ ] Article with many tags (only 3 show)
- [ ] Search with no results
- [ ] Category filter with no results

---

## 🌐 External Links Test

### Valid URLs
- [ ] WHO Diabetes: https://www.who.int/health-topics/diabetes
- [ ] Heart.org: https://www.heart.org/en/healthy-living
- [ ] NIMHANS: https://www.nimhans.ac.in/mental-health
- [ ] WHO Nutrition: https://www.who.int/nutrition
- [ ] Yoga Journal: https://www.yogajournal.com/yoga-101/

### Link Behavior
- [ ] Linking.canOpenURL checks before opening
- [ ] Opens in device default browser
- [ ] Doesn't crash if URL invalid
- [ ] Doesn't crash if no internet
- [ ] Returns to app after viewing link

---

## 🐛 Bug Checks

### Common Issues
- [ ] No console errors on mount
- [ ] No console errors on navigation
- [ ] No memory leaks
- [ ] Images load without flickering
- [ ] Gradients render without artifacts
- [ ] Cart state persists during screen
- [ ] Cart resets when leaving screen (expected)
- [ ] No TypeScript errors
- [ ] No warnings in terminal

### Performance
- [ ] List scrolling is smooth
- [ ] No lag when adding to cart
- [ ] No lag when filtering
- [ ] No lag when searching
- [ ] Images load progressively
- [ ] Gradients render instantly

---

## 📊 Data Verification

### Mock Data
- [ ] 5 articles present
- [ ] All articles have imageUrl
- [ ] All articles have externalUrl
- [ ] Categories match filter chips
- [ ] Tags are relevant
- [ ] Read times make sense
- [ ] Dates are recent

- [ ] 6 medicines present
- [ ] All medicines have proper categories
- [ ] Prices are realistic
- [ ] Stock status varies
- [ ] Prescription requirements vary

---

## 🚀 Pre-Production Checklist

### Before Going Live
- [ ] Replace Unsplash URLs with production image CDN
- [ ] Add real external article URLs
- [ ] Implement cart persistence (AsyncStorage)
- [ ] Add cart checkout flow
- [ ] Add payment gateway
- [ ] Add user reviews/ratings
- [ ] Add analytics tracking
- [ ] Add error boundary
- [ ] Add offline support
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security review

---

## 📝 Test Results Log

### Session 1: [Date]
- Tester: _______________
- Platform: iOS / Android
- Device: _______________
- App Version: _______________

| Feature | Status | Notes |
|---------|--------|-------|
| Medicine cart add | ⬜ | |
| Medicine cart remove | ⬜ | |
| Medicine search | ⬜ | |
| Medicine filter | ⬜ | |
| Article browse | ⬜ | |
| Article search | ⬜ | |
| Article filter | ⬜ | |
| Article detail | ⬜ | |
| External links | ⬜ | |

### Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ Sign-Off

- [ ] All critical tests passed
- [ ] All visual designs match specifications
- [ ] All functionality works as expected
- [ ] No breaking bugs found
- [ ] Code reviewed
- [ ] Documentation complete

**Approved by**: _______________
**Date**: _______________

---

**Note**: This checklist should be completed before marking the UI transformation as done. Check items as you test them in the Expo Go app.
