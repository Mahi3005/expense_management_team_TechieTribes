import { createWorker } from 'tesseract.js';

/**
 * Extract text from an image file using Tesseract OCR
 * @param {File} imageFile - The image file to process
 * @param {Function} onProgress - Callback for progress updates (0-1)
 * @returns {Promise<{success: boolean, text: string, error?: string}>}
 */
export async function extractTextFromImage(imageFile, onProgress = null) {
    try {
        const worker = await createWorker('eng', 1, {
            logger: (m) => {
                if (onProgress && m.status === 'recognizing text') {
                    onProgress(m.progress);
                }
            },
        });

        const { data: { text } } = await worker.recognize(imageFile);
        await worker.terminate();

        return {
            success: true,
            text: text,
        };
    } catch (error) {
        console.error('OCR Error:', error);
        return {
            success: false,
            text: '',
            error: error.message,
        };
    }
}

/**
 * Parse receipt text to extract structured data
 * @param {string} text - The OCR extracted text
 * @returns {Object} Parsed receipt data
 */
export function parseReceiptData(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    const result = {
        merchant: '',
        amount: '',
        currency: 'USD',
        date: '',
        category: '',
        confidence: {
            merchant: 0,
            amount: 0,
            date: 0,
        }
    };

    // Extract amount with currency
    // Patterns: $123.45, USD 123.45, ₹123.45, INR 123.45, €123.45, £123.45, etc.
    const amountPatterns = [
        /(?:total|amount|sum|grand\s*total)[:\s]*([₹$€£¥]?)\s*([\d,]+\.?\d*)/i,
        /([₹$€£¥])\s*([\d,]+\.?\d*)/,
        /(USD|INR|EUR|GBP|JPY|AUD|CAD)\s*([\d,]+\.?\d*)/i,
        /([\d,]+\.?\d*)\s*(USD|INR|EUR|GBP|JPY|AUD|CAD)/i,
    ];

    for (const line of lines) {
        for (const pattern of amountPatterns) {
            const match = line.match(pattern);
            if (match) {
                // Extract currency symbol or code
                let currencySymbol = match[1] || '';
                let amountValue = match[2] || match[1];

                if (match[0].match(/USD|INR|EUR|GBP|JPY|AUD|CAD/i)) {
                    const currMatch = match[0].match(/(USD|INR|EUR|GBP|JPY|AUD|CAD)/i);
                    if (currMatch) {
                        result.currency = currMatch[1].toUpperCase();
                    }
                    amountValue = match[2] || match[1];
                } else {
                    // Map symbols to currency codes
                    const symbolMap = {
                        '$': 'USD',
                        '₹': 'INR',
                        '€': 'EUR',
                        '£': 'GBP',
                        '¥': 'JPY',
                    };
                    result.currency = symbolMap[currencySymbol] || 'USD';
                }

                result.amount = amountValue.replace(/,/g, '');
                result.confidence.amount = 0.8;
                break;
            }
        }
        if (result.amount) break;
    }

    // Extract date
    const datePatterns = [
        /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
        /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,
        /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})/i,
    ];

    for (const line of lines) {
        for (const pattern of datePatterns) {
            const match = line.match(pattern);
            if (match) {
                result.date = match[1];
                result.confidence.date = 0.7;
                break;
            }
        }
        if (result.date) break;
    }

    // Extract merchant name (usually first few lines, look for capitalized text)
    const merchantPatterns = [
        /^([A-Z][A-Za-z\s&]+(?:Ltd|Inc|LLC|Restaurant|Store|Shop|Cafe|Hotel|Market)?)/,
    ];

    for (const line of lines.slice(0, 5)) {
        if (line.length > 3 && line.length < 50) {
            for (const pattern of merchantPatterns) {
                const match = line.match(pattern);
                if (match) {
                    result.merchant = match[1].trim();
                    result.confidence.merchant = 0.6;
                    break;
                }
            }
        }
        if (result.merchant) break;
    }

    // If no merchant found, use first non-empty line
    if (!result.merchant && lines.length > 0) {
        result.merchant = lines[0].substring(0, 50);
        result.confidence.merchant = 0.3;
    }

    // Auto-detect category based on keywords
    const textLower = text.toLowerCase();
    const categoryKeywords = {
        'Food': ['restaurant', 'cafe', 'food', 'burger', 'pizza', 'dinner', 'lunch', 'breakfast', 'meal'],
        'Travel': ['uber', 'lyft', 'taxi', 'flight', 'hotel', 'airbnb', 'booking', 'travel', 'train', 'bus'],
        'Office Supplies': ['staples', 'office', 'depot', 'supplies', 'paper', 'pen', 'desk'],
        'Software': ['software', 'subscription', 'saas', 'license', 'app', 'digital'],
        'Training': ['training', 'course', 'workshop', 'seminar', 'education', 'learning'],
        'Entertainment': ['movie', 'theater', 'entertainment', 'show', 'concert'],
        'Healthcare': ['pharmacy', 'medical', 'doctor', 'hospital', 'clinic', 'health'],
        'Utilities': ['electric', 'water', 'gas', 'utility', 'internet', 'phone'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => textLower.includes(keyword))) {
            result.category = category;
            break;
        }
    }

    return result;
}

/**
 * Process a receipt image and extract structured data
 * @param {File} imageFile - The receipt image file
 * @param {Function} onProgress - Progress callback (0-1)
 * @returns {Promise<Object>} Extracted receipt data
 */
export async function processReceipt(imageFile, onProgress = null) {
    const ocrResult = await extractTextFromImage(imageFile, onProgress);

    if (!ocrResult.success) {
        return {
            success: false,
            error: ocrResult.error,
            data: null,
        };
    }

    const parsedData = parseReceiptData(ocrResult.text);

    return {
        success: true,
        data: {
            ...parsedData,
            rawText: ocrResult.text,
        },
    };
}
