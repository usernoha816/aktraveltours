import { DeviceModel } from '../types';

export const COMPATIBLE_DEVICES: DeviceModel[] = [
  // Apple
  { brand: 'Apple', model: 'iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max', isCompatible: true, dualSimNotes: 'Dual active eSIM + Physical SIM (eSIM-only in US models)', releaseYear: 2024, instructionsSnippet: 'Settings > Cellular / Mobile Service > Add eSIM' },
  { brand: 'Apple', model: 'iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max', isCompatible: true, dualSimNotes: 'Dual active eSIM + Physical SIM (eSIM-only in US models)', releaseYear: 2023, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max', isCompatible: true, dualSimNotes: 'Dual active eSIM + Physical SIM (eSIM-only in US models)', releaseYear: 2022, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone 13 / 13 mini / 13 Pro / 13 Pro Max', isCompatible: true, dualSimNotes: 'Supports Dual eSIMs active simultaneously', releaseYear: 2021, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone 12 / 12 mini / 12 Pro / 12 Pro Max', isCompatible: true, dualSimNotes: '1 Physical SIM + 1 eSIM', releaseYear: 2020, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone 11 / 11 Pro / 11 Pro Max', isCompatible: true, dualSimNotes: '1 Physical SIM + 1 eSIM', releaseYear: 2019, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone XS / XS Max / XR', isCompatible: true, dualSimNotes: '1 Physical SIM + 1 eSIM', releaseYear: 2018, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPhone SE (2nd & 3rd gen)', isCompatible: true, dualSimNotes: '1 Physical SIM + 1 eSIM', releaseYear: 2020, instructionsSnippet: 'Settings > Cellular > Add eSIM' },
  { brand: 'Apple', model: 'iPad Pro / Air / mini (Cellular models)', isCompatible: true, dualSimNotes: 'Embedded eSIM capability', releaseYear: 2019, instructionsSnippet: 'Settings > Cellular Data > Add a New Plan' },

  // Samsung
  { brand: 'Samsung', model: 'Galaxy S25 / S25+ / S25 Ultra', isCompatible: true, dualSimNotes: 'Dual eSIM support + Dual Nano SIM', releaseYear: 2025, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy S24 / S24+ / S24 Ultra', isCompatible: true, dualSimNotes: 'Dual eSIM support + Nano SIM', releaseYear: 2024, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy S23 / S23+ / S23 Ultra / S23 FE', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM active', releaseYear: 2023, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy S22 / S22+ / S22 Ultra', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2022, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy S21 / S21+ / S21 Ultra', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM (regional variants check)', releaseYear: 2021, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy S20 / S20+ / S20 Ultra (Excl. FE)', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM (Except S20 FE which lacks eSIM)', releaseYear: 2020, instructionsSnippet: 'Settings > Connections > SIM card status > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy Z Fold 6 / Flip 6', isCompatible: true, dualSimNotes: 'Dual eSIM + Nano SIM', releaseYear: 2024, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy Z Fold 5 / Flip 5 / Fold 4 / Flip 4', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },
  { brand: 'Samsung', model: 'Galaxy A54 5G / A55 5G / A35 5G', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > Connections > SIM manager > Add eSIM' },

  // Google
  { brand: 'Google', model: 'Pixel 9 / 9 Pro / 9 Pro XL / 9 Pro Fold', isCompatible: true, dualSimNotes: 'Dual eSIM active standby', releaseYear: 2024, instructionsSnippet: 'Settings > Network & internet > SIMs > Add SIM / Download eSIM' },
  { brand: 'Google', model: 'Pixel 8 / 8 Pro / 8a', isCompatible: true, dualSimNotes: 'Dual eSIM active standby', releaseYear: 2023, instructionsSnippet: 'Settings > Network & internet > SIMs > Add SIM' },
  { brand: 'Google', model: 'Pixel 7 / 7 Pro / 7a', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM (Dual eSIM on Android 13+)', releaseYear: 2022, instructionsSnippet: 'Settings > Network & internet > SIMs > Add SIM' },
  { brand: 'Google', model: 'Pixel 6 / 6 Pro / 6a', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2021, instructionsSnippet: 'Settings > Network & internet > SIMs > Add SIM' },
  { brand: 'Google', model: 'Pixel 5 / 5a / 4 / 4a / 4 XL', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2020, instructionsSnippet: 'Settings > Network & internet > SIMs > Add SIM' },

  // Xiaomi & Oppo & Others
  { brand: 'Xiaomi', model: 'Xiaomi 14 / 14 Pro / 14 Ultra / 13 / 13 Pro', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > SIM cards & mobile networks > eSIM' },
  { brand: 'Xiaomi', model: 'Xiaomi 13T / 13T Pro / 12T Pro', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > SIM cards & mobile networks > eSIM' },
  { brand: 'Oppo', model: 'Find X7 Ultra / Find X6 Pro / Find X5 Pro', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > Mobile Network > eSIM' },
  { brand: 'Motorola', model: 'Razr 50 / 40 Ultra / Edge 50 Pro / Edge 40 Pro', isCompatible: true, dualSimNotes: '1 eSIM + 1 Nano SIM', releaseYear: 2023, instructionsSnippet: 'Settings > Network & internet > Mobile network > eSIM' },
];
