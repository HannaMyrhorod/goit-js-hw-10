import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js";

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const country = e.target.value.trim();

    fetchCountries(country)
        .then(checkQueryForRender)
        .catch(() => {
            if (country.length <= 0) {
                return Notify.info('Please enter country name', {
                timeout: 3500,
                clickToClose: true,
                borderRadius: '4px',
                });;
            };
            Notify.failure('Oops, there is no country with that name', {
                timeout: 3500,
                clickToClose: true,
                borderRadius: '4px',
            });
        })
        .finally(clearSearchResults())
};

function clearSearchResults() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
};

function checkQueryForRender(data) {
    if (data.length === 1) {
        renderCountryInfo(data[0]);  
    } else if (data.length > 1 && data.length <= 10) {
        renderCountryList(data);
    } else {
        Notify.info('Too many matches found. Please enter a more specific name.', {
            timeout: 3500,
            clickToClose: true,
            borderRadius: '4px',
        });
    };
};

function renderCountryInfo({ flags: { svg }, name, capital, population, languages }) {
    
    const language = languages.map(el => (el.name)).join(', ');
    
    const markup = `
        <div class="wrapper">
        <img class="country-flag" src="${svg}" alt="The Flag of ${name}" width = 40px>
        <h2 class="country-name">${name}</h2>
        </div>  
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${language}</p>
    `;

    return refs.countryInfo.innerHTML = markup;
};

function renderCountryList(countries) {
    
    const markup = countries.reduce((acc, { name, flags: { svg } }) => {
        return acc + `
        <li class="wrapper">
            <img class="country-flag" src="${svg}" alt="Flag" width = 30px>
            <h2>${name}</h2>
        </li>
        `
    }, '');

    return refs.countryList.innerHTML = markup;
};
