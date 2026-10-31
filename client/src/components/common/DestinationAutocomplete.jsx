import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Mountain,
  Palmtree,
  Waves,
  Landmark,
  Building2,
  Compass,
  Search,
  X,
  Sparkles,
  Flame,
  Globe,
  Loader2,
  Check,
} from 'lucide-react';
import { getDestinationMedia } from '../../services/destinationMediaService';
import weatherService from '../../services/weatherService';

const LIVE_GEO_CACHE = new Map();

/**
 * Category groups for filtering destinations
 */
export const DESTINATION_CATEGORIES = [
  { id: 'ALL', label: 'All Places', icon: Compass },
  { id: 'POPULAR', label: 'Top Highlights', icon: Flame },
  { id: 'PHILIPPINES', label: 'Philippines', icon: Sparkles },
  { id: 'GLOBAL', label: 'International', icon: Globe },
  { id: 'BEACH_ISLAND', label: 'Beaches & Islands', icon: Palmtree },
  { id: 'HIGHLAND_NATURE', label: 'Highlands & Nature', icon: Mountain },
  { id: 'HERITAGE_CULTURE', label: 'Heritage & Culture', icon: Landmark },
  { id: 'METRO_FOOD', label: 'Metro & Urban', icon: Building2 },
];

/**
 * Curated catalog of top Philippine travel destinations
 */
export const PHILIPPINE_DESTINATIONS = [
  {
    city: 'Baguio City',
    shortName: 'Baguio',
    province: 'Benguet',
    region: 'Cordillera (CAR)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: '1,470m Cool Weather • Pine Forests • Burnham Lake',
    tag: 'Summer Capital',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['baguio', 'benguet', 'burnham', 'camp john hay', 'mines view', 'cordillera', 'highland', 'strawberry'],
    latitude: 16.4023,
    longitude: 120.5960,
  },
  {
    city: 'Boracay',
    shortName: 'Boracay',
    province: 'Aklan',
    region: 'Western Visayas (Region 6)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Beach & Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'White Beach • Crystal Cove • Sunset Sailing',
    tag: 'Tropical Island',
    icon: Palmtree,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    keywords: ['boracay', 'aklan', 'white beach', 'caticlan', 'island', 'beach', 'sunset'],
    latitude: 11.9674,
    longitude: 121.9248,
  },
  {
    city: 'Siargao Island',
    shortName: 'Siargao',
    province: 'Surigao del Norte',
    region: 'Caraga (Region 13)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Surf & Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Cloud 9 Surf Reef • Magpupungko Pools • Sugba Lagoon',
    tag: 'Surfing Capital',
    icon: Waves,
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    keywords: ['siargao', 'cloud 9', 'general luna', 'surigao', 'surfing', 'island', 'lagoon'],
    latitude: 9.8584,
    longitude: 126.0469,
  },
  {
    city: 'El Nido',
    shortName: 'El Nido',
    province: 'Palawan',
    region: 'MIMAROPA (Region 4B)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Beach & Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Bacuit Bay Lagoons • Big Lagoon • Limestone Cliffs',
    tag: 'Eco Paradise',
    icon: Palmtree,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    keywords: ['el nido', 'palawan', 'bacuit', 'big lagoon', 'island hopping', 'beach', 'limestone'],
    latitude: 11.1956,
    longitude: 119.4075,
  },
  {
    city: 'Coron',
    shortName: 'Coron',
    province: 'Palawan',
    region: 'MIMAROPA (Region 4B)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Beach & Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Kayangan Lake • Twin Lagoons • Shipwreck Diving',
    tag: 'Island Sanctuary',
    icon: Waves,
    badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    keywords: ['coron', 'palawan', 'kayangan', 'twin lagoon', 'shipwreck', 'diving', 'snorkeling'],
    latitude: 12.0000,
    longitude: 120.2000,
  },
  {
    city: 'Cebu City',
    shortName: 'Cebu',
    province: 'Cebu',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Metro & Heritage',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Kawasan Falls • Temple of Leah • Magellan Cross',
    tag: 'Queen of the South',
    icon: Landmark,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['cebu', 'cebu city', 'mandaue', 'lapu-lapu', 'kawasan', 'oslob', 'mactan', 'lechon'],
    latitude: 10.3157,
    longitude: 123.8854,
  },
  {
    city: 'Tagaytay City',
    shortName: 'Tagaytay',
    province: 'Cavite',
    region: 'CALABARZON (Region 4A)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: '634m Cool Ridge • Taal Volcano Views • Bulalo Dining',
    tag: 'Scenic Ridge',
    icon: Mountain,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    keywords: ['tagaytay', 'cavite', 'taal', 'volcano', 'highlands', 'bulalo', 'ridge'],
    latitude: 14.1153,
    longitude: 120.9621,
  },
  {
    city: 'Bohol (Panglao)',
    shortName: 'Bohol',
    province: 'Bohol',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Nature & Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Chocolate Hills • Philippine Tarsiers • Loboc River',
    tag: 'Eco Island',
    icon: Palmtree,
    badgeColor: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
    keywords: ['bohol', 'panglao', 'tagbilaran', 'chocolate hills', 'tarsier', 'loboc'],
    latitude: 9.6729,
    longitude: 123.8730,
  },
  {
    city: 'Batanes (Basco)',
    shortName: 'Batanes',
    province: 'Batanes',
    region: 'Cagayan Valley (Region 2)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland Coast',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Rolling Hills • Basco Lighthouse • Ivatan Stone Houses',
    tag: 'Northern Frontier',
    icon: Mountain,
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    keywords: ['batanes', 'basco', 'marlboro hills', 'ivatan', 'lighthouse', 'rolling hills'],
    latitude: 20.4485,
    longitude: 121.9702,
  },
  {
    city: 'Sagada',
    shortName: 'Sagada',
    province: 'Mountain Province',
    region: 'Cordillera (CAR)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: '1,500m Sea of Clouds • Kiltepan Peak • Hanging Coffins',
    tag: 'Mountain Haven',
    icon: Mountain,
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    keywords: ['sagada', 'kiltepan', 'hanging coffins', 'sumaguing', 'cave', 'cordillera', 'clouds'],
    latitude: 17.0833,
    longitude: 120.9000,
  },
  {
    city: 'Vigan City',
    shortName: 'Vigan',
    province: 'Ilocos Sur',
    region: 'Ilocos (Region 1)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Calle Crisologo • Spanish Colonial Architecture • Empanada',
    tag: 'UNESCO World Heritage',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['vigan', 'ilocos sur', 'calle crisologo', 'spanish', 'heritage', 'empanada'],
    latitude: 17.5747,
    longitude: 120.3869,
  },
  {
    city: 'La Union (San Juan)',
    shortName: 'La Union',
    province: 'La Union',
    region: 'Ilocos (Region 1)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Surf & Coast',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Urbiztondo Beach • Sunset Surfing • Specialty Cafes',
    tag: 'Surfing Capital of the North',
    icon: Waves,
    badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    keywords: ['la union', 'san juan', 'elyu', 'urbiztondo', 'surfing', 'beach', 'sunset'],
    latitude: 16.6667,
    longitude: 120.3333,
  },
  {
    city: 'Davao City',
    shortName: 'Davao',
    province: 'Davao del Sur',
    region: 'Davao Region (Region 11)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Metro & Nature',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Mount Apo Trails • Philippine Eagle Center • Durian Dining',
    tag: 'King City of the South',
    icon: Building2,
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    keywords: ['davao', 'davao city', 'mount apo', 'eagle center', 'samal', 'durian'],
    latitude: 7.1907,
    longitude: 125.4553,
  },
  {
    city: 'Iloilo City',
    shortName: 'Iloilo',
    province: 'Iloilo',
    region: 'Western Visayas (Region 6)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Molo Church • Esplanade River Walk • La Paz Batchoy',
    tag: 'City of Love',
    icon: Landmark,
    badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    keywords: ['iloilo', 'iloilo city', 'molo', 'jaro', 'batchoy', 'esplanade', 'heritage'],
    latitude: 10.7202,
    longitude: 122.5621,
  },
  {
    city: 'Bacolod City',
    shortName: 'Bacolod',
    province: 'Negros Occidental',
    region: 'Negros Island',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'The Ruins (Talisay) • MassKara Festival • Chicken Inasal',
    tag: 'City of Smiles',
    icon: Landmark,
    badgeColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    keywords: ['bacolod', 'negros', 'the ruins', 'inasal', 'masskara', 'talisay'],
    latitude: 10.6766,
    longitude: 122.9509,
  },
  {
    city: 'Cagayan de Oro',
    shortName: 'CDO',
    province: 'Misamis Oriental',
    region: 'Northern Mindanao (Region 10)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Adventure',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Whitewater River Rafting • Dahilayan Adventure Park',
    tag: 'City of Golden Friendship',
    icon: Waves,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['cagayan de oro', 'cdo', 'rafting', 'dahilayan', 'bukidnon', 'whitewater'],
    latitude: 8.4542,
    longitude: 124.6319,
  },
  {
    city: 'Puerto Princesa',
    shortName: 'Puerto Princesa',
    province: 'Palawan',
    region: 'MIMAROPA (Region 4B)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Nature & Coast',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Underground River • Honda Bay Islands • Firefly Watching',
    tag: 'Eco City',
    icon: Palmtree,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    keywords: ['puerto princesa', 'palawan', 'underground river', 'honda bay'],
    latitude: 9.7392,
    longitude: 118.7353,
  },
  {
    city: 'Metro Manila',
    shortName: 'Manila',
    province: 'National Capital Region',
    region: 'NCR',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Metro & Heritage',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Intramuros • Bonifacio Global City • National Museum',
    tag: 'Capital Megacity',
    icon: Building2,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['manila', 'metro manila', 'makati', 'bgc', 'taguig', 'quezon city', 'intramuros', 'pasay'],
    latitude: 14.5995,
    longitude: 120.9842,
  },
  {
    city: 'Legazpi City',
    shortName: 'Legazpi',
    province: 'Albay',
    region: 'Bicol Region (Region 5)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland Volcano',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Mayon Volcano Perfect Cone • Cagsawa Ruins • ATV Trails',
    tag: 'Volcano City',
    icon: Mountain,
    badgeColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    keywords: ['legazpi', 'albay', 'mayon', 'volcano', 'cagsawa', 'bicol', 'atv'],
    latitude: 13.1391,
    longitude: 123.7438,
  },
  {
    city: 'Bantayan Island',
    shortName: 'Bantayan',
    province: 'Cebu',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Beach & Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Sugar Beach • Virgin Island • Ogtong Cave Pool',
    tag: 'Pristine Haven',
    icon: Palmtree,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    keywords: ['bantayan', 'cebu', 'sugar beach', 'virgin island', 'island', 'beach'],
    latitude: 11.2000,
    longitude: 123.7333,
  },
  {
    city: 'Siquijor Island',
    shortName: 'Siquijor',
    province: 'Siquijor',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Island Nature',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Cambugahay Falls • Paliton Beach Sunsets • Balete Tree',
    tag: 'Island of Fire',
    icon: Waves,
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    keywords: ['siquijor', 'cambugahay', 'paliton', 'falls', 'island', 'beach'],
    latitude: 9.2144,
    longitude: 123.5156,
  },
  {
    city: 'Moalboal',
    shortName: 'Moalboal',
    province: 'Cebu',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Marine Adventure',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Sardine Run • Panagsama Snorkeling • White Beach',
    tag: 'Marine Wonder',
    icon: Waves,
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    keywords: ['moalboal', 'cebu', 'sardines', 'panagsama', 'diving', 'snorkeling', 'turtle'],
    latitude: 9.9567,
    longitude: 123.4008,
  },
  {
    city: 'Dumaguete',
    shortName: 'Dumaguete',
    province: 'Negros Oriental',
    region: 'Central Visayas (Region 7)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Coastal City',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Rizal Boulevard • Siliman University • Apo Island Turtles',
    tag: 'City of Gentle People',
    icon: Landmark,
    badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    keywords: ['dumaguete', 'negros oriental', 'apo island', 'siliman', 'boulevard', 'silvanas'],
    latitude: 9.3068,
    longitude: 123.3054,
  },
  {
    city: 'Baler (Aurora)',
    shortName: 'Baler',
    province: 'Aurora',
    region: 'Central Luzon (Region 3)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Surf & Nature',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Sabang Beach Surf • Ditumabo Falls • Millennium Balete Tree',
    tag: 'Birthplace of Philippine Surfing',
    icon: Waves,
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    keywords: ['baler', 'aurora', 'sabang', 'surfing', 'ditumabo', 'balete'],
    latitude: 15.7592,
    longitude: 121.5622,
  },
  {
    city: 'Camiguin Island',
    shortName: 'Camiguin',
    province: 'Camiguin',
    region: 'Northern Mindanao (Region 10)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Volcanic Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'White Island Sandbar • Sunken Cemetery • Katibawasan Falls',
    tag: 'Island Born of Fire',
    icon: Mountain,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['camiguin', 'white island', 'sunken cemetery', 'volcano', 'sandbar', 'lanzones'],
    latitude: 9.1733,
    longitude: 124.7297,
  },
  {
    city: 'Antipolo City',
    shortName: 'Antipolo',
    province: 'Rizal',
    region: 'CALABARZON (Region 4A)',
    country: 'Philippines',
    countryCode: 'PH',
    category: 'Highland Ridge',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Hinulugang Taktak • Pinto Art Museum • Skyline Overlooks',
    tag: 'Pilgrimage & Art Haven',
    icon: Mountain,
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    keywords: ['antipolo', 'rizal', 'pinto art', 'hinulugang taktak', 'overlook', 'tanay'],
    latitude: 14.5842,
    longitude: 121.1764,
  },
];

/**
 * Curated catalog of top world travel destinations
 */
export const GLOBAL_DESTINATIONS = [
  {
    city: 'Tokyo, Japan',
    shortName: 'Tokyo',
    province: 'Kanto',
    region: 'East Asia',
    country: 'Japan',
    countryCode: 'JP',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Shinjuku Neon • Shibuya Crossing • Senso-ji Temple',
    tag: 'World Megacity',
    icon: Building2,
    badgeColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    keywords: ['tokyo', 'japan', 'shibuya', 'shinjuku', 'ginza', 'akihabara', 'ramen', 'sushi'],
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    city: 'Paris, France',
    shortName: 'Paris',
    province: 'Île-de-France',
    region: 'Western Europe',
    country: 'France',
    countryCode: 'FR',
    category: 'Culture & Art',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Eiffel Tower • Louvre Museum • Seine River Cruise',
    tag: 'City of Light',
    icon: Landmark,
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    keywords: ['paris', 'france', 'eiffel', 'louvre', 'seine', 'champs-elysees', 'montmartre'],
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    city: 'New York City, USA',
    shortName: 'New York',
    province: 'New York',
    region: 'North America',
    country: 'United States',
    countryCode: 'US',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Central Park • Times Square • Statue of Liberty',
    tag: 'The Big Apple',
    icon: Building2,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['new york', 'nyc', 'manhattan', 'brooklyn', 'times square', 'central park', 'usa'],
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    city: 'London, UK',
    shortName: 'London',
    province: 'England',
    region: 'Western Europe',
    country: 'United Kingdom',
    countryCode: 'GB',
    category: 'Heritage & Metro',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Big Ben • Tower Bridge • British Museum • Hyde Park',
    tag: 'Historic Capital',
    icon: Landmark,
    badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    keywords: ['london', 'uk', 'england', 'big ben', 'tower bridge', 'thames', 'british museum'],
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    city: 'Singapore',
    shortName: 'Singapore',
    province: 'Central Region',
    region: 'Southeast Asia',
    country: 'Singapore',
    countryCode: 'SG',
    category: 'Futuristic City',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Gardens by the Bay • Marina Bay Sands • Sentosa',
    tag: 'Garden City',
    icon: Building2,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    keywords: ['singapore', 'marina bay', 'gardens by the bay', 'sentosa', 'changi', 'orchard'],
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    city: 'Seoul, South Korea',
    shortName: 'Seoul',
    province: 'Seoul Capital Area',
    region: 'East Asia',
    country: 'South Korea',
    countryCode: 'KR',
    category: 'Culture & Metro',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Gyeongbokgung Palace • N Seoul Tower • Hongdae Street',
    tag: 'Dynamic Capital',
    icon: Building2,
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    keywords: ['seoul', 'korea', 'south korea', 'gangnam', 'hongdae', 'myeongdong', 'palace'],
    latitude: 37.5665,
    longitude: 126.9780,
  },
  {
    city: 'Rome, Italy',
    shortName: 'Rome',
    province: 'Lazio',
    region: 'Southern Europe',
    country: 'Italy',
    countryCode: 'IT',
    category: 'Ancient Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Colosseum • Vatican Museums • Trevi Fountain',
    tag: 'Eternal City',
    icon: Landmark,
    badgeColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    keywords: ['rome', 'italy', 'colosseum', 'vatican', 'trevi', 'pantheon', 'pasta', 'pizza'],
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    city: 'Sydney, Australia',
    shortName: 'Sydney',
    province: 'New South Wales',
    region: 'Oceania',
    country: 'Australia',
    countryCode: 'AU',
    category: 'Harbor & Beach',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Sydney Opera House • Bondi Beach • Harbor Bridge',
    tag: 'Harbor City',
    icon: Waves,
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    keywords: ['sydney', 'australia', 'opera house', 'bondi', 'harbour', 'manly'],
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    city: 'Dubai, UAE',
    shortName: 'Dubai',
    province: 'Dubai Emirate',
    region: 'Middle East',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    category: 'Futuristic Luxury',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Burj Khalifa • Dubai Mall • Desert Safari • Palm Jumeirah',
    tag: 'City of Gold',
    icon: Building2,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['dubai', 'uae', 'burj khalifa', 'desert', 'palm jumeirah', 'safari'],
    latitude: 25.2048,
    longitude: 55.2708,
  },
  {
    city: 'Bangkok, Thailand',
    shortName: 'Bangkok',
    province: 'Central Thailand',
    region: 'Southeast Asia',
    country: 'Thailand',
    countryCode: 'TH',
    category: 'Culture & Food',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Grand Palace • Wat Arun • Chatuchak Weekend Market',
    tag: 'City of Angels',
    icon: Landmark,
    badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    keywords: ['bangkok', 'thailand', 'wat arun', 'palace', 'street food', 'siam'],
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    city: 'Barcelona, Spain',
    shortName: 'Barcelona',
    province: 'Catalonia',
    region: 'Southern Europe',
    country: 'Spain',
    countryCode: 'ES',
    category: 'Art & Coast',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Sagrada Familia • Park Güell • Barceloneta Beach',
    tag: 'Catalan Capital',
    icon: Landmark,
    badgeColor: 'text-red-500 bg-red-500/10 border-red-500/20',
    keywords: ['barcelona', 'spain', 'sagrada familia', 'gaudi', 'catalonia', 'ramblas'],
    latitude: 41.3879,
    longitude: 2.1699,
  },
  {
    city: 'Bali, Indonesia',
    shortName: 'Bali',
    province: 'Bali Province',
    region: 'Southeast Asia',
    country: 'Indonesia',
    countryCode: 'ID',
    category: 'Island Paradise',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Ubud Rice Terraces • Uluwatu Temple • Seminyak Sunset',
    tag: 'Island of the Gods',
    icon: Palmtree,
    badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    keywords: ['bali', 'indonesia', 'ubud', 'seminyak', 'canggu', 'kuta', 'uluwatu'],
    latitude: -8.6705,
    longitude: 115.2126,
  },
  {
    city: 'Los Angeles, USA',
    shortName: 'Los Angeles',
    province: 'California',
    region: 'North America',
    country: 'United States',
    countryCode: 'US',
    category: 'Coast & Cinema',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Hollywood Hills • Santa Monica Pier • Griffith Observatory',
    tag: 'City of Angels',
    icon: Building2,
    badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    keywords: ['los angeles', 'la', 'california', 'hollywood', 'santa monica', 'beverly hills', 'usa'],
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    city: 'Chicago, USA',
    shortName: 'Chicago',
    province: 'Illinois',
    region: 'North America',
    country: 'United States',
    countryCode: 'US',
    category: 'Architecture & Metro',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Millennium Park • Willis Tower • Navy Pier • Lake Michigan',
    tag: 'The Windy City',
    icon: Building2,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    keywords: ['chicago', 'illinois', 'millennium park', 'bean', 'willis tower', 'lake michigan', 'usa'],
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    city: 'San Francisco, USA',
    shortName: 'San Francisco',
    province: 'California',
    region: 'North America',
    country: 'United States',
    countryCode: 'US',
    category: 'Bay & Coast',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Golden Gate Bridge • Fisherman Wharf • Alcatraz Island',
    tag: 'City by the Bay',
    icon: Landmark,
    badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    keywords: ['san francisco', 'sf', 'california', 'golden gate', 'bay', 'alcatraz', 'usa'],
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    city: 'Kyoto, Japan',
    shortName: 'Kyoto',
    province: 'Kansai',
    region: 'East Asia',
    country: 'Japan',
    countryCode: 'JP',
    category: 'Ancient Temples',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Fushimi Inari Torii • Arashiyama Bamboo Grove • Kinkaku-ji',
    tag: 'Ancient Imperial Capital',
    icon: Landmark,
    badgeColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    keywords: ['kyoto', 'japan', 'fushimi inari', 'arashiyama', 'bamboo', 'temple', 'geisha'],
    latitude: 35.0116,
    longitude: 135.7681,
  },
  {
    city: 'Amsterdam, Netherlands',
    shortName: 'Amsterdam',
    province: 'North Holland',
    region: 'Western Europe',
    country: 'Netherlands',
    countryCode: 'NL',
    category: 'Canal City',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Historic Canals • Van Gogh Museum • Rijksmuseum',
    tag: 'Venice of the North',
    icon: Waves,
    badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    keywords: ['amsterdam', 'netherlands', 'holland', 'canals', 'van gogh', 'bikes'],
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    city: 'Vienna, Austria',
    shortName: 'Vienna',
    province: 'Vienna State',
    region: 'Central Europe',
    country: 'Austria',
    countryCode: 'AT',
    category: 'Imperial Culture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Schönbrunn Palace • St. Stephen Cathedral • Opera House',
    tag: 'City of Music',
    icon: Landmark,
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    keywords: ['vienna', 'austria', 'schonbrunn', 'mozart', 'opera', 'palace'],
    latitude: 48.2082,
    longitude: 16.3738,
  },
  {
    city: 'Zurich, Switzerland',
    shortName: 'Zurich',
    province: 'Zurich Canton',
    region: 'Central Europe',
    country: 'Switzerland',
    countryCode: 'CH',
    category: 'Alpine Lake',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Lake Zurich • Alpine Footprints • Old Town Altstadt',
    tag: 'Alpine Metropolis',
    icon: Mountain,
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    keywords: ['zurich', 'switzerland', 'swiss', 'lake zurich', 'alps', 'interlaken'],
    latitude: 47.3769,
    longitude: 8.5417,
  },
  {
    city: 'Vancouver, Canada',
    shortName: 'Vancouver',
    province: 'British Columbia',
    region: 'North America',
    country: 'Canada',
    countryCode: 'CA',
    category: 'Mountains & Coast',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Stanley Park • Grouse Mountain • Capilano Suspension Bridge',
    tag: 'Pacific Gateway',
    icon: Mountain,
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    keywords: ['vancouver', 'canada', 'british columbia', 'stanley park', 'grouse mountain', 'ski'],
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    city: 'Reykjavik, Iceland',
    shortName: 'Reykjavik',
    province: 'Capital Region',
    region: 'Northern Europe',
    country: 'Iceland',
    countryCode: 'IS',
    category: 'Glaciers & Aurora',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Northern Lights • Blue Lagoon • Golden Circle Geysers',
    tag: 'Land of Fire & Ice',
    icon: Sparkles,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    keywords: ['reykjavik', 'iceland', 'aurora', 'northern lights', 'geysir', 'blue lagoon', 'glacier'],
    latitude: 64.1466,
    longitude: -21.9426,
  },
];

/**
 * Combined database of all curated destinations worldwide and in the Philippines.
 */
export const ALL_DESTINATIONS = [
  ...GLOBAL_DESTINATIONS,
  ...PHILIPPINE_DESTINATIONS,
];

/**
 * Modern Google Maps & Apple Maps style destination search and autocomplete component.
 * Supports instant search across the local catalog, live worldwide geocoding, and category browsing.
 */
export default function DestinationAutocomplete({
  value = '',
  onChange,
  onSelectDestination,
  placeholder = 'Search any city, town, island, or country worldwide...',
  label = 'Destination City',
  required = false,
  id = 'destination-autocomplete-input',
  className = '',
  inputClassName = 'py-2.5 text-xs',
  roundedClassName = 'rounded-2xl',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = (query || '').trim();
  const normalizedQuery = cleanQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Instant local matching (0ms) across curated places
  const localFilteredDestinations = useMemo(() => {
    if (!cleanQuery) {
      return ALL_DESTINATIONS.filter((dest) => {
        if (selectedCategory === 'ALL') return true;
        if (selectedCategory === 'POPULAR') return dest.popular;
        if (selectedCategory === 'PHILIPPINES') return dest.country === 'Philippines';
        if (selectedCategory === 'GLOBAL') return dest.country !== 'Philippines';
        return dest.categoryGroup === selectedCategory;
      });
    }

    const tokens = normalizedQuery.split(/[\s,.-]+/).filter(Boolean);

    return ALL_DESTINATIONS.filter((dest) => {
      const haystack = [
        dest.city,
        dest.shortName,
        dest.province,
        dest.region,
        dest.country,
        dest.tag || '',
        ...(dest.keywords || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (haystack.includes(normalizedQuery)) return true;
      return tokens.length > 0 && tokens.every((tok) => haystack.includes(tok));
    });
  }, [cleanQuery, selectedCategory, normalizedQuery]);

  // 2. High-speed Live Worldwide Geocoding Search
  useEffect(() => {
    if (!cleanQuery || cleanQuery.length < 1) {
      setLiveResults([]);
      setIsSearching(false);
      return;
    }

    const cacheKey = normalizedQuery;
    if (LIVE_GEO_CACHE.has(cacheKey)) {
      setLiveResults(LIVE_GEO_CACHE.get(cacheKey));
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        let results = [];

        // Primary: Query SkyPlan backend /api/weather/locations
        try {
          results = await weatherService.searchLocations(cleanQuery, 25, controller.signal);
        } catch (backendErr) {
          // If aborted, exit quietly
          if (controller.signal.aborted) return;
        }

        // Secondary fallback: Direct Open-Meteo & Photon geocoding from client if backend was empty
        if (!Array.isArray(results) || results.length === 0) {
          const directUrls = [
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery.split(',')[0].trim())}&count=20&language=en`,
            `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=20&lang=en`,
          ];

          const [omRes, phRes] = await Promise.allSettled(
            directUrls.map((u) => fetch(u, { signal: controller.signal }))
          );

          const directList = [];

          if (omRes.status === 'fulfilled' && omRes.value.ok) {
            const data = await omRes.value.json();
            if (Array.isArray(data.results)) {
              for (const r of data.results) {
                const cc = (r.country_code || '').toUpperCase();
                const isPh = cc === 'PH' || r.country === 'Philippines';
                const admin1 = r.admin1 || r.admin2 || '';
                const display = admin1 && admin1 !== r.name ? `${r.name}, ${admin1}` : r.country ? `${r.name}, ${r.country}` : r.name;
                directList.push({
                  name: r.name,
                  city: display,
                  admin1: admin1 || r.country || (isPh ? 'Philippines' : 'Worldwide'),
                  country: r.country || (isPh ? 'Philippines' : 'Worldwide'),
                  countryCode: cc || (isPh ? 'PH' : ''),
                  latitude: Number(r.latitude),
                  longitude: Number(r.longitude),
                  elevation: r.elevation,
                  isPh,
                });
              }
            }
          }

          if (phRes.status === 'fulfilled' && phRes.value.ok) {
            const data = await phRes.value.json();
            if (Array.isArray(data.features)) {
              for (const f of data.features) {
                const p = f.properties || {};
                const coords = f.geometry?.coordinates;
                if (!p.name || !coords) continue;
                const cc = (p.countrycode || '').toUpperCase();
                const isPh = cc === 'PH' || (p.country && p.country.toLowerCase().includes('philippines'));
                const admin1 = p.state || p.county || p.city || '';
                const display = admin1 && admin1 !== p.name ? `${p.name}, ${admin1}` : p.country ? `${p.name}, ${p.country}` : p.name;
                directList.push({
                  name: p.name,
                  city: display,
                  admin1: admin1 || p.country || (isPh ? 'Philippines' : 'Worldwide'),
                  country: p.country || (isPh ? 'Philippines' : 'Worldwide'),
                  countryCode: cc || (isPh ? 'PH' : ''),
                  latitude: Number(coords[1]),
                  longitude: Number(coords[0]),
                  isPh,
                });
              }
            }
          }

          results = directList;
        }

        const formatted = results.map((r) => {
          const isPh = r.countryCode === 'PH' || (r.country && r.country.toLowerCase().includes('philippines'));
          const cleanName = r.name || r.city.split(',')[0].trim();
          const media = getDestinationMedia(cleanName);

          return {
            city: r.city || cleanName,
            shortName: cleanName,
            province: r.admin1 || r.country || (isPh ? 'Philippines' : 'Worldwide'),
            region: r.region || r.country || (isPh ? 'Philippines' : 'International'),
            country: r.country || (isPh ? 'Philippines' : 'Worldwide'),
            countryCode: r.countryCode || (isPh ? 'PH' : ''),
            category: isPh ? 'Local Destination' : 'Worldwide Destination',
            categoryGroup: isPh ? 'PHILIPPINES' : 'GLOBAL',
            popular: false,
            highlight: media.landmark || `${cleanName} • ${r.admin1 ? `${r.admin1}, ` : ''}${r.country || 'Worldwide'}`,
            tag: r.country || (isPh ? 'Philippines' : 'Worldwide'),
            icon: Globe,
            badgeColor: isPh ? 'text-primary bg-primary/10 border-primary/20' : 'text-sky-400 bg-sky-400/10 border-sky-400/20',
            latitude: Number(r.latitude),
            longitude: Number(r.longitude),
            elevation: r.elevation,
            isLive: true,
          };
        });

        if (!isCancelled && !controller.signal.aborted) {
          LIVE_GEO_CACHE.set(cacheKey, formatted);
          if (LIVE_GEO_CACHE.size > 200) {
            const first = LIVE_GEO_CACHE.keys().next().value;
            LIVE_GEO_CACHE.delete(first);
          }
          setLiveResults(formatted);
        }
      } catch (err) {
        if (!isCancelled && !controller.signal.aborted) {
          setLiveResults([]);
        }
      } finally {
        if (!isCancelled && !controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 120);

    return () => {
      isCancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [cleanQuery, normalizedQuery]);

  // Seamlessly merge local curated matches + live geocoding results
  const displayedDestinations = useMemo(() => {
    if (!cleanQuery) {
      return localFilteredDestinations;
    }

    const merged = [...localFilteredDestinations];

    if (liveResults.length > 0) {
      for (const liveDest of liveResults) {
        const liveName = (liveDest.shortName || liveDest.city).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        const liveCountry = (liveDest.country || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

        const exists = merged.some((d) => {
          const dName = (d.shortName || d.city).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const dCountry = (d.country || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

          if (dName === liveName && dCountry === liveCountry) return true;

          // Coordinate proximity check
          if (
            Number.isFinite(d.latitude) &&
            Number.isFinite(liveDest.latitude) &&
            Number.isFinite(d.longitude) &&
            Number.isFinite(liveDest.longitude)
          ) {
            const latDiff = Math.abs(d.latitude - liveDest.latitude);
            const lonDiff = Math.abs(d.longitude - liveDest.longitude);
            if (latDiff < 0.25 && lonDiff < 0.25) return true;
          }
          return false;
        });

        if (!exists) {
          merged.push(liveDest);
        }
      }
    }

    // Rank results by relevance
    merged.sort((a, b) => {
      const aName = (a.shortName || a.city).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const bName = (b.shortName || b.city).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const aExact = aName === normalizedQuery;
      const bExact = bName === normalizedQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aName.startsWith(normalizedQuery);
      const bStarts = bName.startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });

    return merged;
  }, [cleanQuery, localFilteredDestinations, liveResults, normalizedQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(val);
    }
  };

  const handleSelect = (dest) => {
    const displayName = dest.city || dest.shortName;
    setQuery(displayName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(displayName, dest);
    }
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  const handleSelectCustom = () => {
    if (!cleanQuery) return;
    setIsOpen(false);
    setHighlightedIndex(-1);

    // If there is an exact or top match in results, use its coordinates
    const topMatch = displayedDestinations[0];
    const customDest = topMatch || {
      city: cleanQuery,
      shortName: cleanQuery.split(',')[0].trim(),
      province: 'Worldwide',
      region: 'Worldwide',
      country: 'Global Region',
      popular: false,
      tag: 'Custom Query',
      isCustom: true,
    };

    if (onChange) {
      onChange(customDest.city || cleanQuery, customDest);
    }
    if (onSelectDestination) {
      onSelectDestination(customDest);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      } else if (e.key === 'Enter') {
        if (cleanQuery) {
          handleSelectCustom();
        }
      }
      return;
    }

    const totalItems = displayedDestinations.length + (cleanQuery ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < displayedDestinations.length) {
        handleSelect(displayedDestinations[highlightedIndex]);
      } else if (highlightedIndex === displayedDestinations.length && cleanQuery) {
        handleSelectCustom();
      } else if (displayedDestinations.length > 0) {
        handleSelect(displayedDestinations[0]);
      } else {
        handleSelectCustom();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setHighlightedIndex(-1);
    setLiveResults([]);
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  const highlightMatch = (text, q) => {
    if (!q || !text) return text;
    const index = text.toLowerCase().indexOf(q.toLowerCase());
    if (index === -1) return text;
    const before = text.substring(0, index);
    const match = text.substring(index, index + q.length);
    const after = text.substring(index + q.length);
    return (
      <>
        {before}
        <span className="text-primary font-bold underline decoration-primary/50 underline-offset-2">
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-semibold block mb-1 text-xs text-on-surface">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      {/* Input container */}
      <div
        className={`relative flex items-center bg-surface-container-high border border-white/10 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-specular-inset ${roundedClassName}`}
      >
        <div className="pl-3.5 pr-1 flex items-center pointer-events-none text-primary">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full bg-transparent px-2 text-on-surface placeholder:text-outline focus:outline-none ${inputClassName}`}
        />

        {isSearching && (
          <div className="mr-2 flex items-center text-primary" title="Searching worldwide locations...">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        )}

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Clear destination"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-surface-container-low/95 backdrop-blur-2xl border border-white/15 shadow-2xl divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          {/* Header Bar */}
          <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-outline font-medium bg-surface-container/60 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-on-surface font-semibold">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              )}
              {cleanQuery
                ? `Worldwide Locations (${displayedDestinations.length} found)`
                : `Suggested Destinations (${displayedDestinations.length})`}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Live Global Satellite Data
            </span>
          </div>

          {/* Category Tabs (shown when empty or for quick browsing) */}
          {!cleanQuery && (
            <div className="px-2 py-2 bg-surface-container-high/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-white/5">
              {DESTINATION_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon || Compass;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setHighlightedIndex(-1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-glow font-semibold'
                        : 'bg-surface-container text-outline hover:text-on-surface hover:bg-surface-container-highest border border-white/5'
                    }`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Destination Results List */}
          <div className="max-h-[320px] sm:max-h-[380px] overflow-y-auto overscroll-contain p-1.5 space-y-1 scrollbar-thin">
            {displayedDestinations.length > 0 ? (
              displayedDestinations.map((dest, index) => {
                const isSelected = highlightedIndex === index;
                const isExactActive = (value || '').toLowerCase() === (dest.city || dest.shortName).toLowerCase();
                const media = getDestinationMedia(dest.shortName || dest.city);

                return (
                  <button
                    key={`${dest.city}-${dest.country || ''}-${dest.latitude || ''}-${index}`}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-surface-container-highest text-on-surface ring-1 ring-primary/40'
                        : 'hover:bg-surface-container/80 text-on-surface-variant'
                    } ${isExactActive ? 'border-l-2 border-primary bg-primary/5' : ''}`}
                  >
                    {/* Thumbnail Photo Preview */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm bg-surface-container group-hover:border-primary/40 transition-all">
                      <img
                        src={media?.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'}
                        alt={dest.shortName || dest.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Location Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors truncate">
                          {highlightMatch(dest.shortName || dest.city, cleanQuery)}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {dest.countryCode && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-container border border-white/10 text-on-surface">
                              {dest.countryCode}
                            </span>
                          )}
                          {dest.popular && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-caution/15 text-caution border border-caution/30">
                              HOT
                            </span>
                          )}
                          {dest.tag && (
                            <span
                              className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${dest.badgeColor || 'border-white/10 text-outline'} hidden sm:inline-block`}
                            >
                              {dest.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-outline truncate mt-0.5">
                        {highlightMatch(`${dest.province || ''}${dest.province && dest.country ? ', ' : ''}${dest.country || ''}`, cleanQuery)}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-outline/80 mt-1">
                        {dest.highlight && (
                          <span className="truncate max-w-[240px] text-on-surface-variant font-medium">
                            {dest.highlight}
                          </span>
                        )}
                        {dest.latitude !== undefined && (
                          <span className="shrink-0 text-[9px] text-outline hidden md:inline-block">
                            ({Number(dest.latitude).toFixed(2)}°, {Number(dest.longitude).toFixed(2)}°)
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : isSearching ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                <p className="text-xs font-semibold text-on-surface">Searching worldwide locations...</p>
                <p className="text-[11px] text-outline">Connecting to live global geocoding satellites for "{cleanQuery}".</p>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-outline">
                  <Compass className="w-5 h-5 text-outline" />
                </div>
                <p className="font-semibold text-xs text-on-surface">No places found for "{cleanQuery}"</p>
                <p className="text-[11px] text-outline max-w-xs mx-auto">
                  Click below or press <span className="text-primary font-bold">Enter</span> to search worldwide weather telemetry directly.
                </p>
              </div>
            )}

            {/* Custom Exact Query Search Button */}
            {cleanQuery && (
              <button
                type="button"
                onClick={handleSelectCustom}
                onMouseEnter={() => setHighlightedIndex(displayedDestinations.length)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border-t border-white/5 ${
                  highlightedIndex === displayedDestinations.length
                    ? 'bg-surface-container-highest text-primary ring-1 ring-primary/40'
                    : 'hover:bg-surface-container/60 text-outline'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-primary shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-on-surface">
                    Search weather for: <span className="text-primary font-bold">"{cleanQuery}"</span>
                  </span>
                  <p className="text-[10px] text-outline">Press Enter or click to fetch live satellite forecast for this place</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
