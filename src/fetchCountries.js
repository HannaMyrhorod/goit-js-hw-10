const BASE_URL = 'https://restcountries.com/v2';
const FILTER = '?fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
    const url = `${BASE_URL}/name/${name}${FILTER}`;
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error();
        };
        return response.json();
    });
};