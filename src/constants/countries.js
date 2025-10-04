// Fetch countries data from REST API
export const fetchCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

// Fetch currency exchange rates from API
export const fetchCurrencies = async () => {
    try {
        // Using exchangerate-api.com free API
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.rates) {
            // Convert rates object to array with currency codes
            return Object.keys(data.rates).map(code => ({
                code: code,
                name: getCurrencyName(code),
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching currencies:', error);
        // Fallback to common currencies
        return [
            { code: 'USD', name: 'US Dollar' },
            { code: 'EUR', name: 'Euro' },
            { code: 'GBP', name: 'British Pound' },
            { code: 'INR', name: 'Indian Rupee' },
            { code: 'JPY', name: 'Japanese Yen' },
        ];
    }
};

// Currency name mappings
const getCurrencyName = (code) => {
    const currencyNames = {
        USD: 'US Dollar',
        EUR: 'Euro',
        GBP: 'British Pound',
        INR: 'Indian Rupee',
        JPY: 'Japanese Yen',
        AUD: 'Australian Dollar',
        CAD: 'Canadian Dollar',
        CHF: 'Swiss Franc',
        CNY: 'Chinese Yuan',
        AED: 'UAE Dirham',
        SAR: 'Saudi Riyal',
        SGD: 'Singapore Dollar',
        NZD: 'New Zealand Dollar',
        MXN: 'Mexican Peso',
        BRL: 'Brazilian Real',
        ZAR: 'South African Rand',
        KRW: 'South Korean Won',
        THB: 'Thai Baht',
        MYR: 'Malaysian Ringgit',
        IDR: 'Indonesian Rupiah',
        PHP: 'Philippine Peso',
        VND: 'Vietnamese Dong',
        TRY: 'Turkish Lira',
        RUB: 'Russian Ruble',
        PLN: 'Polish Zloty',
        SEK: 'Swedish Krona',
        NOK: 'Norwegian Krone',
        DKK: 'Danish Krone',
        HKD: 'Hong Kong Dollar',
    };
    return currencyNames[code] || code;
};