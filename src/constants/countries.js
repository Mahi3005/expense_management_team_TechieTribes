// Fetch countries with currencies from API
export const fetchCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
        const data = await response.json();

        // Transform API data to our format
        const countries = data
            .map(country => {
                const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
                const currencyData = currencyCode ? country.currencies[currencyCode] : null;

                return {
                    name: country.name.common,
                    code: country.name.common,
                    currency: currencyCode,
                    symbol: currencyData?.symbol || '',
                    currencyName: currencyData?.name || ''
                };
            })
            .filter(country => country.currency) // Only countries with currency
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        return countries;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};
