# Test Receipt Images for OCR

## How to Test OCR Functionality

### Quick Test Steps:
1. **Start the app**: `npm run dev`
2. **Go to Employee Dashboard** → Click "New Expense" button
3. **Upload a receipt image** in the "Attach Receipt" field
4. **Watch OCR extract data automatically**:
   - Progress bar shows scanning progress
   - Green alert displays extracted data
   - Form fields auto-fill with scanned information

## Where to Find Test Receipts:

### Option 1: Use Real Receipt Photos
- Take a photo of any receipt with your phone
- Make sure the text is clear and readable
- Supported formats: JPG, PNG, WEBP

### Option 2: Download Sample Receipts Online
Search for "sample receipt images" and download:
- Restaurant receipts
- Store receipts
- Service receipts

### Option 3: Create a Simple Text Receipt
Open any text editor and create a simple receipt like:

```
STARBUCKS COFFEE
123 Main Street

Date: 10/04/2025
Time: 2:30 PM

Coffee                $5.50
Sandwich             $8.00
Tax                  $1.08
-----------------------------
Total:              $14.58

Thank you!
```

Then take a screenshot and save as an image.

## What OCR Will Extract:

The OCR system will automatically detect and extract:

✅ **Merchant Name**: "Starbucks Coffee"
✅ **Total Amount**: "14.58"
✅ **Currency**: "USD" (auto-detected from $ symbol)
✅ **Date**: "10/04/2025"
✅ **Category**: "Food" (auto-detected from keywords)

## Tips for Best Results:

1. **Good lighting** - Make sure receipt is well-lit
2. **Clear text** - Receipt should not be crumpled or faded
3. **Straight angle** - Take photo from directly above
4. **High contrast** - Dark text on light background works best
5. **Supported formats**: PNG, JPG, JPEG, WEBP

## Example Test Flow:

```
1. Click "New Expense" → Dialog opens
2. Click "Attach Receipt" → Select image file
3. OCR starts automatically → Shows "Scanning receipt..." with progress bar
4. After 3-5 seconds → Green success card appears with:
   - ✅ Merchant: Starbucks Coffee
   - ✅ Amount: USD 14.58
   - ✅ Date: 10/04/2025
   - ✅ Category: Food
5. Form fields are pre-filled → Review and edit if needed
6. Click "Submit" → Expense created!
```

## Troubleshooting:

**If OCR doesn't work:**
- Make sure the file is an image (not PDF for OCR)
- Check browser console for errors
- Try a clearer receipt image
- Ensure text is readable and not too small

**If extraction is incorrect:**
- The form is editable - just correct the fields manually
- OCR confidence varies based on image quality
- The system shows what it extracted so you can verify

## Testing Different Receipt Types:

1. **Restaurant Receipt** → Should auto-detect "Food" category
2. **Uber/Taxi Receipt** → Should auto-detect "Travel" category
3. **Office Depot Receipt** → Should auto-detect "Office Supplies"
4. **Software Purchase** → Should auto-detect "Software" category
5. **Hotel Bill** → Should auto-detect "Travel" category

Happy Testing! 🎉
