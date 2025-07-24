import { Country, State } from "country-state-city";

// Get all countries
export const countries = Country.getAllCountries().map((country) => ({
  code: country.isoCode,
  name: country.name,
}));

// Get states by country code
export const getStatesByCountry = (countryCode: string) => {
  return State.getStatesOfCountry(countryCode).map((state) => ({
    name: state.name,
    stateCode: state.isoCode,
  }));
};
