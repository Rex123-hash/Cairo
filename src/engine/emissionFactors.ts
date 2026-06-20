import type { DietType, TransportMode } from "./types";

/**
 * Published emission factors used by the calculator.
 *
 * Sources (rounded regional averages, for awareness — not compliance reporting):
 *  - Transport: UK DEFRA / IPCC passenger-km averages, kg CO2e per km.
 *  - Diet: Scarborough et al. (2014) dietary GHG study, kg CO2e per day.
 *  - Electricity: ~0.40 kg CO2e per kWh (mixed grid average).
 *
 * Keeping these as plain constants makes every number in the app traceable to a
 * source and trivially unit-testable.
 */

/** kg CO2e per passenger-km. */
export const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  car_electric: 0.053,
  bus: 0.105,
  train: 0.041,
  metro: 0.035,
  motorbike: 0.103,
  bike: 0,
  walk: 0,
  flight: 0.255,
};

/** kg CO2e per day attributable to diet. */
export const DIET_FACTORS: Record<DietType, number> = {
  meat_heavy: 7.2,
  meat_medium: 5.6,
  pescatarian: 3.9,
  vegetarian: 3.8,
  vegan: 2.9,
};

/** kg CO2e per kWh of grid electricity. */
export const ELECTRICITY_FACTOR = 0.4;

/** Approx. kWh drawn by one hour of air-conditioning / heating. */
export const AC_KWH_PER_HOUR = 1.5;

/** kg CO2e embodied in an average newly manufactured consumer item. */
export const SHOPPING_ITEM_FACTOR = 15;

/** Average days per month, used to normalise weekly/daily figures. */
export const DAYS_PER_MONTH = 30;

/** Average weeks per month, used to normalise weekly figures. */
export const WEEKS_PER_MONTH = 4.345;
