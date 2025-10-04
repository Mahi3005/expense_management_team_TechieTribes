// Currency conversion utility
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await response.json();
        
        if (data.rates && data.rates[toCurrency]) {
            const convertedAmount = amount * data.rates[toCurrency];
            return {
                success: true,
                amount: convertedAmount.toFixed(2),
                rate: data.rates[toCurrency],
                fromCurrency,
                toCurrency
            };
        }
        return { success: false, error: 'Currency not found' };
    } catch (error) {
        console.error('Currency conversion error:', error);
        return { success: false, error: 'Conversion failed' };
    }
};

// Parse amount string (e.g., "USD 100" or "100 rs" or "₹ 500")
export const parseAmount = (amountString) => {
    if (!amountString) return { amount: 0, currency: 'INR' };
    
    // Remove all spaces and currency symbols
    const cleanString = amountString.toString().trim();
    
    // Try to extract currency code (USD, EUR, INR, etc.)
    const currencyMatch = cleanString.match(/[A-Z]{3}/);
    const currency = currencyMatch ? currencyMatch[0] : 'INR';
    
    // Extract numeric value
    const numericValue = cleanString.replace(/[^0-9.]/g, '');
    const amount = parseFloat(numericValue) || 0;
    
    return { amount, currency };
};

// Format currency for display
export const formatCurrency = (amount, currency = 'INR', symbol = '₹') => {
    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return `${symbol} ${formatter.format(amount)}`;
};
