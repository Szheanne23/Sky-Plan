import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  Check,
  Flame,
  Sun,
  Trees,
  Utensils,
  Camera,
  Globe,
  Plane,
} from 'lucide-react';

/**
 * Category groups for filtering destinations
 */
export const DESTINATION_CATEGORIES = [
  { id: 'ALL', label: 'All Worldwide', icon: Compass },
  { id: 'POPULAR', label: 'Top Highlights', icon: Flame },
  { id: 'GLOBAL', label: 'International', icon: Globe },
  { id: 'PHILIPPINES', label: 'Philippines', icon: Sparkles },
  { id: 'BEACH_ISLAND', label: 'Beaches & Islands', icon: Palmtree },
  { id: 'HIGHLAND_NATURE', label: 'Highlands & Nature', icon: Mountain },
  { id: 'HERITAGE_CULTURE', label: 'Heritage & Culture', icon: Landmark },
  { id: 'SURF_ADVENTURE', label: 'Surf & Adventure', icon: Waves },
  { id: 'METRO_FOOD', label: 'Metro & Food', icon: Utensils },
];

/**
 * Curated database of 65+ Philippine destinations with authentic metadata, highlights, and search keywords.
 */
export const PHILIPPINE_DESTINATIONS = [
  {
    city: 'Baguio City',
    shortName: 'Baguio',
    province: 'Benguet',
    region: 'Cordillera (CAR)',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: '1,470m Cool Weather • Pine Forests • Burnham Lake',
    tag: 'Summer Capital',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['baguio', 'benguet', 'cordillera', 'summer capital', 'pines', 'cool', 'cold', 'strawberries', 'camp john hay', 'mines view'],
  },
  {
    city: 'Siargao Island',
    shortName: 'Siargao',
    province: 'Surigao del Norte',
    region: 'Caraga Region',
    category: 'Island',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'Cloud 9 Surfing • Sugba Lagoon • Magpupungko Rock Pools',
    tag: 'Surfing Capital',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['siargao', 'surigao', 'cloud 9', 'surf', 'surfing', 'general luna', 'island', 'sugba lagoon', 'pacific'],
  },
  {
    city: 'Boracay',
    shortName: 'Boracay',
    province: 'Malay, Aklan',
    region: 'Western Visayas',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'White Sand Beach • Paraw Sailing • Nightlife & Water Sports',
    tag: 'World-Renowned Beach',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['boracay', 'aklan', 'malay', 'white beach', 'station 1', 'station 2', 'puka', 'island', 'visayas'],
  },
  {
    city: 'Palawan (El Nido)',
    shortName: 'El Nido',
    province: 'Northern Palawan',
    region: 'MIMAROPA',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Bacuit Bay Lagoons • Hidden Beaches • Towering Limestone Karsts',
    tag: 'Turquoise Lagoons',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['palawan', 'el nido', 'bacuit', 'lagoons', 'island hopping', 'secret beach', 'mimaropa'],
  },
  {
    city: 'Coron',
    shortName: 'Coron',
    province: 'Calamian Islands, Palawan',
    region: 'MIMAROPA',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Kayangan Lake • Twin Lagoons • WWII Shipwreck Diving',
    tag: 'Wreck Diving & Lakes',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['coron', 'palawan', 'kayangan', 'barracuda', 'diving', 'shipwreck', 'calamian', 'twin lagoon'],
  },
  {
    city: 'Tagaytay',
    shortName: 'Tagaytay',
    province: 'Cavite',
    region: 'Calabarzon',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Taal Volcano & Lake Ridge • Steaming Bulalo • Cool Breeze',
    tag: 'Scenic Ridge Getaway',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['tagaytay', 'cavite', 'taal', 'lake', 'volcano', 'ridge', 'bulalo', 'cool', 'picnic grove', 'calabarzon'],
  },
  {
    city: 'Manila',
    shortName: 'Manila',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Intramuros Historic Walled City • Manila Baywalk • Museums',
    tag: 'Historic Capital',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['manila', 'metro manila', 'ncr', 'intramuros', 'makati', 'bgc', 'rizal park', 'luneta', 'binondo', 'national museum'],
  },
  {
    city: 'Cebu City',
    shortName: 'Cebu',
    province: 'Cebu',
    region: 'Central Visayas',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Magellan’s Cross • Crispy Lechon • Gateway to Oslob & Kawasan',
    tag: 'Queen City of the South',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['cebu', 'cebu city', 'mactan', 'kawasan', 'oslob', 'moalboal', 'lechon', 'temple of leah', 'visayas'],
  },
  {
    city: 'Bohol (Panglao)',
    shortName: 'Bohol',
    province: 'Bohol',
    region: 'Central Visayas',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Chocolate Hills • Philippine Tarsiers • Alona Beach & Coral Reefs',
    tag: 'Nature & White Beach',
    icon: Compass,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['bohol', 'panglao', 'chocolate hills', 'tarsier', 'alona', 'loboc', 'balicasag', 'tagbilaran'],
  },
  {
    city: 'Batanes (Basco)',
    shortName: 'Batanes',
    province: 'Batanes',
    region: 'Cagayan Valley',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Marlboro Rolling Hills • Ivatan Stone Houses • Pacific Cliffs',
    tag: 'Northernmost Haven',
    icon: Landmark,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['batanes', 'basco', 'ivatan', 'marlboro hills', 'rolling hills', 'lighthouse', 'sabtang', 'batan'],
  },
  {
    city: 'Sagada',
    shortName: 'Sagada',
    province: 'Mountain Province',
    region: 'Cordillera (CAR)',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Echo Valley Hanging Coffins • Sumaguing Cave • Kiltepan Peak',
    tag: 'Highland Mystique',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['sagada', 'mountain province', 'hanging coffins', 'kiltepan', 'cave', 'caving', 'cordillera', 'sea of clouds'],
  },
  {
    city: 'Banaue',
    shortName: 'Banaue',
    province: 'Ifugao',
    region: 'Cordillera (CAR)',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Batad UNESCO Rice Terraces • Cordillera Ancestral Heritage',
    tag: 'Eighth Wonder',
    icon: Mountain,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['banaue', 'batad', 'ifugao', 'rice terraces', 'unesco', 'cordillera', 'tappiya falls'],
  },
  {
    city: 'La Union (San Juan)',
    shortName: 'La Union',
    province: 'La Union',
    region: 'Ilocos Region',
    category: 'Beach',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'San Juan Surfing Point • Tangadan Waterfalls • Sunset Cafes',
    tag: 'Surf & Cafe Culture',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['la union', 'elyu', 'san juan', 'surf', 'surfing', 'sunset', 'tangadan', 'ilocos', 'urbiztondo'],
  },
  {
    city: 'Vigan City',
    shortName: 'Vigan',
    province: 'Ilocos Sur',
    region: 'Ilocos Region',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Calle Crisologo Cobblestone • Kalesa Rides • Heritage Empanada',
    tag: 'UNESCO World Heritage',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['vigan', 'ilocos sur', 'calle crisologo', 'unesco', 'heritage', 'spanish colonial', 'empanada', 'baluarte'],
  },
  {
    city: 'Laoag City',
    shortName: 'Laoag',
    province: 'Ilocos Norte',
    region: 'Ilocos Region',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Paoay UNESCO Church • La Paz Sand Dunes 4x4 • Sinking Bell Tower',
    tag: 'Sunshine City & Dunes',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['laoag', 'ilocos norte', 'paoay', 'sand dunes', '4x4', 'sinking bell tower', 'marcos'],
  },
  {
    city: 'Pagudpud',
    shortName: 'Pagudpud',
    province: 'Ilocos Norte',
    region: 'Ilocos Region',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Saud White Beach • Bangui Windmills • Patapat Viaduct',
    tag: 'Boracay of the North',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['pagudpud', 'saud beach', 'bangui', 'windmills', 'patapat', 'ilocos norte', 'blue lagoon'],
  },
  {
    city: 'Davao City',
    shortName: 'Davao',
    province: 'Davao del Sur',
    region: 'Davao Region',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Mount Apo Foothills • Philippine Eagle Sanctuary • Fresh Durian',
    tag: 'King of Fruits & Mt. Apo',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['davao', 'davao city', 'mount apo', 'philippine eagle', 'durian', 'samal', 'mindanao', 'malagos'],
  },
  {
    city: 'Samal Island (IGACOS)',
    shortName: 'Samal',
    province: 'Davao del Norte',
    region: 'Davao Region',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Pearl Farm Coast • Hagimit Falls • Monfort Bat Sanctuary',
    tag: 'Island Garden of Davao',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['samal', 'igacos', 'davao', 'pearl farm', 'hagimit', 'talicud', 'island'],
  },
  {
    city: 'Mati City',
    shortName: 'Mati',
    province: 'Davao Oriental',
    region: 'Davao Region',
    category: 'Beach',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Dahican 7km Crescent Beach • Skimboarding & Pacific Surfing',
    tag: 'Skimboarding Capital',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['mati', 'dahican', 'davao oriental', 'skimboard', 'surfing', 'sleeping dinosaur'],
  },
  {
    city: 'Iloilo City',
    shortName: 'Iloilo',
    province: 'Iloilo',
    region: 'Western Visayas',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'City of Love • Spanish Plazas • Authentic La Paz Batchoy • Esplanade',
    tag: 'Heritage & Culinary',
    icon: Landmark,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['iloilo', 'iloilo city', 'batchoy', 'gigantes', 'miagao', 'heritage', 'calle real', 'molo'],
  },
  {
    city: 'Islas de Gigantes',
    shortName: 'Gigantes',
    province: 'Carles, Iloilo',
    region: 'Western Visayas',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Cabugao Gamay Island • Tangke Saltwater Lagoon • Fresh Scallops',
    tag: 'Pristine Scallop Islands',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['gigantes', 'islas de gigantes', 'carles', 'iloilo', 'cabugao gamay', 'tangke lagoon', 'scallops'],
  },
  {
    city: 'Guimaras Island',
    shortName: 'Guimaras',
    province: 'Guimaras',
    region: 'Western Visayas',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Sweetest Mangoes in the World • Guisi Lighthouse • Secluded Coves',
    tag: 'Mango Capital',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['guimaras', 'jordan', 'buenavista', 'mangoes', 'guisi', 'alubihod', 'visayas'],
  },
  {
    city: 'Bacolod City',
    shortName: 'Bacolod',
    province: 'Negros Occidental',
    region: 'Western Visayas',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'The Ruins Historic Mansion • Chicken Inasal • MassKara Festival',
    tag: 'City of Smiles',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['bacolod', 'negros occidental', 'the ruins', 'chicken inasal', 'masskara', 'silay', 'manokan'],
  },
  {
    city: 'Puerto Princesa',
    shortName: 'Puerto Princesa',
    province: 'Palawan',
    region: 'MIMAROPA',
    category: 'Nature',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Underground River UNESCO Wonder • Honda Bay Island Hopping',
    tag: 'Underground River Wonder',
    icon: Compass,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['puerto princesa', 'palawan', 'underground river', 'honda bay', 'sabang', 'firefly'],
  },
  {
    city: 'San Vicente (Palawan)',
    shortName: 'San Vicente',
    province: 'Northern Palawan',
    region: 'MIMAROPA',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: '14km Long Beach Pristine Sands • Port Barton Sea Turtles',
    tag: 'Longest White Beach',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['san vicente', 'long beach', 'port barton', 'palawan', 'turtles', 'island hopping'],
  },
  {
    city: 'Dumaguete',
    shortName: 'Dumaguete',
    province: 'Negros Oriental',
    region: 'Central Visayas',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'City of Gentle People • Siliman Univ • Apo Island Sea Turtles',
    tag: 'Marine Sanctuary & Turtles',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['dumaguete', 'negros oriental', 'apo island', 'turtles', 'manjuyod', 'sans rival', 'siliman'],
  },
  {
    city: 'Siquijor Island',
    shortName: 'Siquijor',
    province: 'Siquijor',
    region: 'Central Visayas',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Cambugahay 3-Tier Falls • Enchanted Balete Tree • Salagdoong Cliff Jump',
    tag: 'Mystic Island of Fire',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['siquijor', 'cambugahay', 'salagdoong', 'balete', 'cliff dive', 'paliton', 'falls', 'visayas'],
  },
  {
    city: 'Moalboal',
    shortName: 'Moalboal',
    province: 'Cebu',
    region: 'Central Visayas',
    category: 'Beach',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Million Sardine Run Ball • Panagsama Coral Reef • White Beach',
    tag: 'Sardine Run & Coral',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['moalboal', 'cebu', 'sardine run', 'panagsama', 'sea turtle', 'pescador island', 'snorkeling'],
  },
  {
    city: 'Bantayan Island',
    shortName: 'Bantayan',
    province: 'Northern Cebu',
    region: 'Central Visayas',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Sugar Beach Powdery Sands • Ogtong Cave Pool • Kota Beach Sandbar',
    tag: 'Powdery White Coves',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['bantayan', 'cebu', 'kota beach', 'santa fe', 'sugar beach', 'virgin island', 'paradise'],
  },
  {
    city: 'Malapascua Island',
    shortName: 'Malapascua',
    province: 'Northern Cebu',
    region: 'Central Visayas',
    category: 'Island',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Monad Shoal Thresher Shark Diving • Bounty Beach Serenity',
    tag: 'Thresher Shark Haven',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['malapascua', 'thresher shark', 'cebu', 'monad shoal', 'bounty beach', 'diving'],
  },
  {
    city: 'Baler',
    shortName: 'Baler',
    province: 'Aurora',
    region: 'Central Luzon',
    category: 'Beach',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'Sabang Beach Pacific Surf • Millennium Tree • Dicasalarin Cove',
    tag: 'Birthplace of PH Surfing',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['baler', 'aurora', 'sabang', 'surf', 'surfing', 'dicasalarin', 'millennium tree', 'central luzon'],
  },
  {
    city: 'Legazpi City',
    shortName: 'Legazpi',
    province: 'Albay',
    region: 'Bicol Region',
    category: 'Adventure',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'Mayon Volcano Perfect Cone • ATV Lava Trails • Cagsawa Ruins',
    tag: 'Mayon Volcano & ATV',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['legazpi', 'albay', 'bicol', 'mayon', 'volcano', 'cagsawa', 'atv', 'lava trail', 'spicy bicol'],
  },
  {
    city: 'Naga City',
    shortName: 'Naga',
    province: 'Camarines Sur',
    region: 'Bicol Region',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Peñafrancia Pilgrimage Basilica • CWC Watersports & Wakeboarding',
    tag: 'An Heart of Bicol',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['naga', 'camarines sur', 'bicol', 'penafrancia', 'cwc', 'wakeboarding', 'camsur'],
  },
  {
    city: 'Donsol',
    shortName: 'Donsol',
    province: 'Sorsogon',
    region: 'Bicol Region',
    category: 'Nature',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Gentle Whale Shark (Butanding) Eco-Interaction • Firefly River Cruise',
    tag: 'Whale Shark Sanctuary',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['donsol', 'sorsogon', 'whale shark', 'butanding', 'firefly', 'bicol'],
  },
  {
    city: 'Caramoan Islands',
    shortName: 'Caramoan',
    province: 'Camarines Sur',
    region: 'Bicol Region',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Survivor TV Peninsula • Matukad Island Hidden Lagoon • Limestone Cliffs',
    tag: 'Rugged Island Karsts',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['caramoan', 'camarines sur', 'matukad', 'survivor', 'gota beach', 'island hopping', 'bicol'],
  },
  {
    city: 'Calaguas Islands',
    shortName: 'Calaguas',
    province: 'Camarines Norte',
    region: 'Bicol Region',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Mahabang Buhangin Long White Beach • Crystal Azure Waters',
    tag: 'Untouched Tropical Sand',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['calaguas', 'camarines norte', 'mahabang buhangin', 'tinaga', 'vinzons', 'beach camping'],
  },
  {
    city: 'Catanduanes (Puraran)',
    shortName: 'Catanduanes',
    province: 'Catanduanes',
    region: 'Bicol Region',
    category: 'Beach',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Puraran Majestics Surfing Barrel • Rolling Binurong Point Clifftops',
    tag: 'The Happy Island',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['catanduanes', 'puraran', 'majestics', 'binurong point', 'surf', 'pacific', 'bicol'],
  },
  {
    city: 'Camiguin Island',
    shortName: 'Camiguin',
    province: 'Camiguin',
    region: 'Northern Mindanao',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Island Born of Fire • White Island Sandbar • Sunken Cemetery',
    tag: 'Volcanic Island & Sandbars',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['camiguin', 'white island', 'sunken cemetery', 'volcano', 'mantigue', 'hibok hibok', 'katibawasan'],
  },
  {
    city: 'Cagayan de Oro',
    shortName: 'CDO',
    province: 'Misamis Oriental',
    region: 'Northern Mindanao',
    category: 'Adventure',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Whitewater Rafting Rapids • Dahilayan Alpine Forest • City of Golden Friendship',
    tag: 'Whitewater Rafting Capital',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['cagayan de oro', 'cdo', 'misamis oriental', 'whitewater rafting', 'rapids', 'dahilayan', 'mindanao'],
  },
  {
    city: 'Bukidnon (Dahilayan)',
    shortName: 'Bukidnon',
    province: 'Bukidnon',
    region: 'Northern Mindanao',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Dahilayan Adventure Zipline • Mount Kitanglad Range • Cool Pine Valleys',
    tag: 'Highland Food Basket',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['bukidnon', 'dahilayan', 'malaybalay', 'kitanglad', 'pineapple', 'highland', 'zipline'],
  },
  {
    city: 'Iligan City',
    shortName: 'Iligan',
    province: 'Lanao del Norte',
    region: 'Northern Mindanao',
    category: 'Nature',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Maria Cristina Majestic Twin Falls • Tinago Deep Turquoise Lagoon',
    tag: 'City of Majestic Waterfalls',
    icon: Waves,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['iligan', 'maria cristina', 'tinago falls', 'waterfalls', 'lanao del norte', 'mindanao'],
  },
  {
    city: 'Zamboanga City',
    shortName: 'Zamboanga',
    province: 'Zamboanga del Sur',
    region: 'Zamboanga Peninsula',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Historic Fort Pilar Shrine • Santa Cruz Pink Sand Beach • Yakan Weaving',
    tag: 'Asia’s Latin City',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['zamboanga', 'fort pilar', 'pink beach', 'santa cruz', 'yakan', 'curacha', 'chavacano'],
  },
  {
    city: 'General Santos City',
    shortName: 'GenSan',
    province: 'South Cotabato',
    region: 'SOCCSKSARGEN',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Fresh Sashimi Grade Yellowfin Tuna Fishport • Queen Tuna Park',
    tag: 'Tuna Capital of the Philippines',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['general santos', 'gensan', 'tuna', 'south cotabato', 'fish port', 'soccsksargen'],
  },
  {
    city: 'Lake Sebu',
    shortName: 'Lake Sebu',
    province: 'South Cotabato',
    region: 'SOCCSKSARGEN',
    category: 'Nature',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: '7 Waterfalls Eco-Zipline • T’boli Indigenous T’nalak Weaving • Lotus Lake',
    tag: 'T’boli Ancestral Highland',
    icon: Mountain,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['lake sebu', 'tboli', 'tnalak', '7 waterfalls', 'south cotabato', 'tilapia', 'lotus'],
  },
  {
    city: 'Batangas (Anilao)',
    shortName: 'Anilao',
    province: 'Batangas',
    region: 'Calabarzon',
    category: 'Adventure',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'Birthplace of Philippine Scuba Diving • World-Famous Nudibranch Macro Reefs',
    tag: 'Scuba & Underwater Macro',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['anilao', 'mabini', 'batangas', 'diving', 'scuba', 'macro', 'coral', 'gulugod baboy'],
  },
  {
    city: 'Nasugbu',
    shortName: 'Nasugbu',
    province: 'Batangas',
    region: 'Calabarzon',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Fortune Island Grecian Ruins • Caleruega Church • Sandy Beach Coves',
    tag: 'Grecian Ruins & Beaches',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['nasugbu', 'fortune island', 'caleruega', 'batangas', 'cove', 'beach resort', 'calabarzon'],
  },
  {
    city: 'Antipolo & Tanay',
    shortName: 'Antipolo',
    province: 'Rizal',
    region: 'Calabarzon',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Pintô Modern Art Museum • Treasure Mountain Sea of Clouds • Sierra Madre Ridge',
    tag: 'Art & Highland Ridges',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['antipolo', 'tanay', 'rizal', 'pinto art', 'treasure mountain', 'daranak falls', 'sierra madre'],
  },
  {
    city: 'Puerto Galera',
    shortName: 'Puerto Galera',
    province: 'Oriental Mindoro',
    region: 'MIMAROPA',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'White Beach Coral Bay • Tamaraw Waterfalls • Sabang Bay Dive Sites',
    tag: 'UNESCO Biosphere Reserve',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['puerto galera', 'mindoro', 'white beach', 'sabang', 'tamaraw falls', 'diving'],
  },
  {
    city: 'Romblon (Cresta de Gallo)',
    shortName: 'Romblon',
    province: 'Romblon',
    region: 'MIMAROPA',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Cresta de Gallo Pristine Sandbar • Marble Craftsmanship • Bonbon Sandbar',
    tag: 'Marble Capital & Sandbars',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['romblon', 'cresta de gallo', 'bonbon beach', 'sibuyan', 'marble', 'sandbar'],
  },
  {
    city: 'Subic Bay',
    shortName: 'Subic',
    province: 'Zambales',
    region: 'Central Luzon',
    category: 'Adventure',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Ocean Adventure Marine Park • Inflatable Island • Rainforest Trekking',
    tag: 'Coastal Eco-Adventure',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['subic', 'subic bay', 'zambales', 'inflatable island', 'ocean adventure', 'duty free', 'clark'],
  },
  {
    city: 'San Antonio (Zambales)',
    shortName: 'Zambales Coves',
    province: 'Zambales',
    region: 'Central Luzon',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'Anawangin & Nagsasa Pine Coves • Capones Lighthouse Island',
    tag: 'Pine-Lined Volcanic Coves',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['zambales', 'anawangin', 'nagsasa', 'san antonio', 'capones', 'coves', 'camping'],
  },
  {
    city: 'Angeles City / Clark',
    shortName: 'Angeles',
    province: 'Pampanga',
    region: 'Central Luzon',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Culinary Capital Sisig • Clark Freeport Parks • Mount Arayat Vista',
    tag: 'Culinary Capital of the PH',
    icon: Utensils,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['angeles', 'clark', 'pampanga', 'sisig', 'culinary', 'kapampangan', 'arayat'],
  },
  {
    city: 'Bataan (Las Casas)',
    shortName: 'Bataan',
    province: 'Bataan',
    region: 'Central Luzon',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Las Casas Filipinas de Acuzar • Mount Samat Shrine of Valor • Five Fingers Coves',
    tag: 'Living Heritage & Coves',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['bataan', 'las casas', 'mount samat', 'bagac', 'mariveles', 'five fingers', 'shrine of valor'],
  },
  {
    city: 'Tacloban City',
    shortName: 'Tacloban',
    province: 'Leyte',
    region: 'Eastern Visayas',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'San Juanico Longest Bridge • MacArthur Leyte Landing Memorial • Cancabato Bay',
    tag: 'Gateway to Eastern Visayas',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['tacloban', 'leyte', 'san juanico bridge', 'macarthur', 'palo', 'eastern visayas'],
  },
  {
    city: 'Kalanggaman Island',
    shortName: 'Kalanggaman',
    province: 'Palompon, Leyte',
    region: 'Eastern Visayas',
    category: 'Beach',
    categoryGroup: 'BEACH_ISLAND',
    popular: false,
    highlight: 'World-Class Long White Sandbar • Turquoise Sea • Snorkeling Haven',
    tag: 'Iconic Sandbar Oasis',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['kalanggaman', 'palompon', 'leyte', 'sandbar', 'island', 'visayas'],
  },
  {
    city: 'Hinatuan & Bislig',
    shortName: 'Enchanted River',
    province: 'Surigao del Sur',
    region: 'Caraga Region',
    category: 'Nature',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Hinatuan Enchanted Deep River • Tinuy-an Falls Niagara of the PH',
    tag: 'Enchanted River & Cascades',
    icon: Waves,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['hinatuan', 'enchanted river', 'bislig', 'tinuyan falls', 'surigao del sur', 'mindanao'],
  },
  {
    city: 'Makati City',
    shortName: 'Makati',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Ayala Triangle Gardens • Poblacion Dining Hub • Contemporary Art',
    tag: 'Financial Capital',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['makati', 'ayala', 'poblacion', 'metro manila', 'glorietta', 'greenbelt'],
  },
  {
    city: 'Taguig (BGC)',
    shortName: 'BGC',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Bonifacio High Street • The Mind Museum • World-Class Culinary',
    tag: 'Global Tech & Lifestyle',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['taguig', 'bgc', 'bonifacio global city', 'high street', 'metro manila', 'mind museum'],
  },
  {
    city: 'Quezon City',
    shortName: 'Quezon City',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Quezon Memorial Circle • Maginhawa Food Street • Parks & Wildlife',
    tag: 'City of Stars & Culture',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['quezon city', 'qc', 'maginhawa', 'up diliman', 'memorial circle', 'metro manila'],
  },
  {
    city: 'Pasig City',
    shortName: 'Pasig',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Ortigas Center Skyline • Kapitolyo Food Haven • Pasig Riverwalk',
    tag: 'Green Urban Center',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['pasig', 'ortigas', 'kapitolyo', 'emerald avenue', 'metro manila'],
  },
];

/**
 * Curated database of iconic International & Worldwide Travel Destinations.
 */
export const GLOBAL_DESTINATIONS = [
  {
    city: 'Tokyo',
    shortName: 'Tokyo',
    province: 'Kanto Region',
    region: 'Japan',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Shibuya Crossing • Shinjuku Skyline • Senso-ji Temple',
    tag: 'Metropolis of Tomorrow',
    icon: Building2,
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    keywords: ['tokyo', 'japan', 'shinjuku', 'shibuya', 'ginza', 'akihabara', 'harajuku', 'asia', 'kanto'],
  },
  {
    city: 'Osaka',
    shortName: 'Osaka',
    province: 'Kansai Region',
    region: 'Japan',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'Food & Culture',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Dotonbori Neon Canal • Osaka Castle • Street Takoyaki',
    tag: 'Kitchen of Japan',
    icon: Utensils,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['osaka', 'japan', 'dotonbori', 'kansai', 'osaka castle', 'namba', 'umeda'],
  },
  {
    city: 'Kyoto',
    shortName: 'Kyoto',
    province: 'Kansai Region',
    region: 'Japan',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'Ancient Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Fushimi Inari Torii Gates • Kinkaku-ji • Arashiyama Bamboo',
    tag: 'Cultural Heart of Japan',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['kyoto', 'japan', 'fushimi inari', 'kinkakuji', 'arashiyama', 'gion', 'geisha', 'temple'],
  },
  {
    city: 'Seoul',
    shortName: 'Seoul',
    province: 'Capital Area',
    region: 'South Korea',
    country: 'South Korea',
    flag: '🇰🇷',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Gyeongbokgung Palace • N Seoul Tower • Myeongdong Street Food',
    tag: 'Dynamic K-Wave Capital',
    icon: Building2,
    badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    keywords: ['seoul', 'korea', 'south korea', 'hongdae', 'gangnam', 'myeongdong', 'han river', 'palace'],
  },
  {
    city: 'Singapore',
    shortName: 'Singapore',
    province: 'Central Region',
    region: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    category: 'Garden City',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Marina Bay Sands • Gardens by the Bay • Sentosa Island',
    tag: 'Global Garden Metropolis',
    icon: Building2,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    keywords: ['singapore', 'marina bay', 'gardens by the bay', 'changi', 'orchard', 'sentosa', 'lion city'],
  },
  {
    city: 'Bangkok',
    shortName: 'Bangkok',
    province: 'Central Thailand',
    region: 'Thailand',
    country: 'Thailand',
    flag: '🇹🇭',
    category: 'Temples & River',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Grand Palace • Wat Arun Riverfront • Floating Markets',
    tag: 'City of Angels',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['bangkok', 'thailand', 'wat arun', 'chao phraya', 'sukhumvit', 'siam', 'chatuchak'],
  },
  {
    city: 'Bali',
    shortName: 'Bali',
    province: 'Denpasar & Ubud',
    region: 'Indonesia',
    country: 'Indonesia',
    flag: '🇮🇩',
    category: 'Tropical Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Uluwatu Sunset Temple • Tegallalang Terraces • Seminyak Beach',
    tag: 'Island of the Gods',
    icon: Palmtree,
    badgeColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    keywords: ['bali', 'indonesia', 'ubud', 'uluwatu', 'kuta', 'seminyak', 'canggu', 'denpasar', 'tropical'],
  },
  {
    city: 'Taipei',
    shortName: 'Taipei',
    province: 'Northern Region',
    region: 'Taiwan',
    country: 'Taiwan',
    flag: '🇹🇼',
    category: 'Metropolis & Food',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Taipei 101 Observatory • Shilin Night Market • Elephant Mountain',
    tag: 'Gastronomy & High-Tech',
    icon: Utensils,
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    keywords: ['taipei', 'taiwan', 'taipei 101', 'shilin', 'night market', 'jiufen', 'ximending'],
  },
  {
    city: 'Hong Kong',
    shortName: 'Hong Kong',
    province: 'Hong Kong SAR',
    region: 'China',
    country: 'Hong Kong',
    flag: '🇭🇰',
    category: 'Harbor & Skyline',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Victoria Peak Skyline • Star Ferry • Tsim Sha Tsui Waterfront',
    tag: 'Pearl of the Orient',
    icon: Building2,
    badgeColor: 'text-red-500 bg-red-500/10 border-red-500/20',
    keywords: ['hong kong', 'hk', 'victoria peak', 'kowloon', 'central', 'lan kwai fong', 'tsim sha tsui'],
  },
  {
    city: 'Kuala Lumpur',
    shortName: 'Kuala Lumpur',
    province: 'Federal Territory',
    region: 'Malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Petronas Twin Towers • Batu Caves • Bukit Bintang Food Walk',
    tag: 'Garden City of Lights',
    icon: Building2,
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    keywords: ['kuala lumpur', 'kl', 'malaysia', 'petronas', 'batu caves', 'bukit bintang', 'klcc'],
  },
  {
    city: 'Sydney',
    shortName: 'Sydney',
    province: 'New South Wales',
    region: 'Australia',
    country: 'Australia',
    flag: '🇦🇺',
    category: 'Harbor & Coast',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Sydney Opera House • Bondi Beach Walk • Harbour Bridge Climb',
    tag: 'Harbour City Icon',
    icon: Waves,
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    keywords: ['sydney', 'australia', 'opera house', 'bondi', 'harbour bridge', 'manly', 'darling harbour'],
  },
  {
    city: 'Melbourne',
    shortName: 'Melbourne',
    province: 'Victoria',
    region: 'Australia',
    country: 'Australia',
    flag: '🇦🇺',
    category: 'Culture & Coffee',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Flinders Street • Historic Laneway Cafes • Yarra Riverfront',
    tag: 'World Coffee & Arts Capital',
    icon: Utensils,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['melbourne', 'australia', 'flinders', 'laneways', 'coffee', 'st kilda', 'yarra'],
  },
  {
    city: 'Paris',
    shortName: 'Paris',
    province: 'Île-de-France',
    region: 'France',
    country: 'France',
    flag: '🇫🇷',
    category: 'Art & Heritage',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Eiffel Tower • Louvre Glass Pyramid • Seine Riverfront Promenade',
    tag: 'City of Light',
    icon: Landmark,
    badgeColor: 'text-blue-600 bg-blue-600/10 border-blue-600/20',
    keywords: ['paris', 'france', 'eiffel tower', 'louvre', 'champs elysees', 'notre dame', 'montmartre', 'europe'],
  },
  {
    city: 'London',
    shortName: 'London',
    province: 'Greater London',
    region: 'United Kingdom',
    country: 'United Kingdom',
    flag: '🇬🇧',
    category: 'Historic Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Big Ben & Westminster • Tower Bridge • British Museum Walk',
    tag: 'Royal Thames Capital',
    icon: Landmark,
    badgeColor: 'text-rose-600 bg-rose-600/10 border-rose-600/20',
    keywords: ['london', 'uk', 'united kingdom', 'england', 'big ben', 'tower bridge', 'thames', 'buckingham', 'soho'],
  },
  {
    city: 'Rome',
    shortName: 'Rome',
    province: 'Lazio',
    region: 'Italy',
    country: 'Italy',
    flag: '🇮🇹',
    category: 'Ancient Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'The Colosseum • Trevi Fountain • Vatican City & St. Peter’s',
    tag: 'The Eternal City',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['rome', 'italy', 'colosseum', 'vatican', 'trevi', 'pantheon', 'trastevere', 'ancient'],
  },
  {
    city: 'Barcelona',
    shortName: 'Barcelona',
    province: 'Catalonia',
    region: 'Spain',
    country: 'Spain',
    flag: '🇪🇸',
    category: 'Architecture & Coast',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Sagrada Família • Park Güell • Mediterranean Beachfront',
    tag: 'Gaudí Architecture Capital',
    icon: Landmark,
    badgeColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    keywords: ['barcelona', 'spain', 'sagrada familia', 'park guell', 'ramblas', 'catalonia', 'mediterranean'],
  },
  {
    city: 'Amsterdam',
    shortName: 'Amsterdam',
    province: 'North Holland',
    region: 'Netherlands',
    country: 'Netherlands',
    flag: '🇳🇱',
    category: 'Canals & Culture',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'UNESCO Canal Ring • Van Gogh Museum • Vondelpark Cycling',
    tag: 'Venice of the North',
    icon: Waves,
    badgeColor: 'text-orange-600 bg-orange-600/10 border-orange-600/20',
    keywords: ['amsterdam', 'netherlands', 'holland', 'canals', 'rijksmuseum', 'van gogh', 'cycling'],
  },
  {
    city: 'New York City',
    shortName: 'New York',
    province: 'New York State',
    region: 'United States',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Times Square • Central Park • Brooklyn Bridge • Broadway',
    tag: 'The Big Apple',
    icon: Building2,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['new york', 'nyc', 'manhattan', 'central park', 'brooklyn', 'times square', 'usa', 'broadway'],
  },
  {
    city: 'San Francisco',
    shortName: 'San Francisco',
    province: 'California',
    region: 'United States',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Coastal Bay',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Golden Gate Bridge • Fisherman’s Wharf • Historic Cable Cars',
    tag: 'City by the Bay',
    icon: Waves,
    badgeColor: 'text-cyan-600 bg-cyan-600/10 border-cyan-600/20',
    keywords: ['san francisco', 'sf', 'california', 'golden gate', 'bay area', 'alcatraz', 'wharf'],
  },
  {
    city: 'Los Angeles',
    shortName: 'Los Angeles',
    province: 'California',
    region: 'United States',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Entertainment & Coast',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Santa Monica Pier • Hollywood Hills • Griffith Observatory',
    tag: 'City of Angels',
    icon: Sun,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['los angeles', 'la', 'hollywood', 'santa monica', 'beverly hills', 'california', 'venice beach'],
  },
  {
    city: 'Honolulu',
    shortName: 'Honolulu',
    province: 'Hawaii (Oahu)',
    region: 'United States',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Tropical Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Waikiki Beach • Diamond Head Crater Hike • Tropical Lagoons',
    tag: 'Tropical Pacific Paradise',
    icon: Palmtree,
    badgeColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    keywords: ['honolulu', 'hawaii', 'waikiki', 'oahu', 'diamond head', 'aloha', 'tropical', 'pacific'],
  },
  {
    city: 'Dubai',
    shortName: 'Dubai',
    province: 'Emirate of Dubai',
    region: 'United Arab Emirates',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    category: 'Modern Wonder',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Burj Khalifa Skydeck • Dubai Marina • Desert Dune Safari',
    tag: 'City of Gold & Wonder',
    icon: Building2,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['dubai', 'uae', 'burj khalifa', 'emirates', 'marina', 'desert', 'downtown dubai'],
  },
];

/**
 * Combined database of all curated destinations worldwide and in the Philippines.
 */
export const ALL_DESTINATIONS = [
  ...GLOBAL_DESTINATIONS,
  ...PHILIPPINE_DESTINATIONS.map((d) => ({
    ...d,
    country: d.country || 'Philippines',
    flag: d.flag || '🇵🇭',
  })),
];

/**
 * Google Maps-Style Destination Autocomplete Input.
 *
 * Props:
 * - value: string (current input text)
 * - onChange: (cityName: string, destinationObj?: object) => void
 * - placeholder?: string
 * - label?: string
 * - required?: boolean
 * - id?: string
 * - className?: string
 * - onSelectDestination?: (dest: object) => void
 */
export default function DestinationAutocomplete({
  value = '',
  onChange,
  onSelectDestination,
  placeholder = 'Search worldwide destination or city (e.g. Tokyo, Paris, Baguio, New York, Siargao)...',
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
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter recommendations based on query and selected category tab
  const cleanQuery = (query || '').toLowerCase().trim();

  const filteredDestinations = cleanQuery
    ? ALL_DESTINATIONS.filter((dest) => {
        const matchesQuery =
          dest.city.toLowerCase().includes(cleanQuery) ||
          dest.shortName.toLowerCase().includes(cleanQuery) ||
          (dest.country && dest.country.toLowerCase().includes(cleanQuery)) ||
          dest.province.toLowerCase().includes(cleanQuery) ||
          dest.region.toLowerCase().includes(cleanQuery) ||
          dest.category.toLowerCase().includes(cleanQuery) ||
          dest.tag.toLowerCase().includes(cleanQuery) ||
          dest.keywords.some((kw) => kw.includes(cleanQuery));

        if (selectedCategory === 'ALL') return matchesQuery;
        if (selectedCategory === 'POPULAR') return matchesQuery && dest.popular;
        if (selectedCategory === 'GLOBAL') return matchesQuery && (dest.categoryGroup === 'GLOBAL' || dest.country !== 'Philippines');
        if (selectedCategory === 'PHILIPPINES') return matchesQuery && dest.country === 'Philippines';
        return matchesQuery && dest.categoryGroup === selectedCategory;
      })
    : ALL_DESTINATIONS.filter((dest) => {
        if (selectedCategory === 'ALL') return true;
        if (selectedCategory === 'POPULAR') return dest.popular;
        if (selectedCategory === 'GLOBAL') return dest.categoryGroup === 'GLOBAL' || dest.country !== 'Philippines';
        if (selectedCategory === 'PHILIPPINES') return dest.country === 'Philippines';
        return dest.categoryGroup === selectedCategory;
      });

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
    const cityName = dest.city;
    setQuery(cityName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(cityName, dest);
    }
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  const handleSelectCustom = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = filteredDestinations.length + (cleanQuery ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredDestinations.length) {
        handleSelect(filteredDestinations[highlightedIndex]);
      } else if (highlightedIndex === filteredDestinations.length && cleanQuery) {
        handleSelectCustom();
      } else if (filteredDestinations.length > 0) {
        handleSelect(filteredDestinations[0]);
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
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  // Helper to highlight matching text
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
        <span className="text-primary font-bold underline decoration-primary/40 underline-offset-2">
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

      {/* Input container with location pin and clear button */}
      <div className={`relative flex items-center bg-surface-container-high border border-white/10 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-specular-inset ${roundedClassName}`}>
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

      {/* Comprehensive Destination Autocomplete and Recommendations Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-surface-container-low/95 backdrop-blur-2xl border border-white/15 shadow-2xl divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          {/* Header Indicator with Count */}
          <div className="px-3.5 py-2.5 flex items-center justify-between text-[11px] text-outline font-medium bg-surface-container/60 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-on-surface font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {cleanQuery
                ? `Matching destinations (${filteredDestinations.length})`
                : `Recommended destinations (${filteredDestinations.length} available)`}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              100+ Worldwide & Local
            </span>
          </div>

          {/* Quick Category Filter Tabs */}
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

          {/* List of Destination Cards */}
          <div className="max-h-[300px] sm:max-h-[380px] overflow-y-auto overscroll-contain p-1.5 space-y-1 scrollbar-thin">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((dest, index) => {
                const IconComponent = dest.icon || MapPin;
                const isSelected = highlightedIndex === index;
                const isExactActive = (value || '').toLowerCase() === dest.city.toLowerCase();

                return (
                  <button
                    key={`${dest.city}-${dest.country || ''}`}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-surface-container-highest text-on-surface'
                        : 'hover:bg-surface-container/80 text-on-surface-variant'
                    } ${isExactActive ? 'border-l-2 border-primary bg-primary/5' : ''}`}
                  >
                    {/* Destination Icon Capsule */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        dest.badgeColor || 'bg-primary/10 text-primary border border-primary/20'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Location Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors truncate flex items-center gap-1">
                          {dest.flag && <span className="text-sm shrink-0">{dest.flag}</span>}
                          <span>{highlightMatch(dest.city, cleanQuery)}</span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {dest.popular && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-caution/15 text-caution border border-caution/30">
                              HOT
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${dest.badgeColor} hidden sm:inline-block`}
                          >
                            {dest.tag}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-outline truncate mt-0.5">
                        {highlightMatch(`${dest.province}, ${dest.country || dest.region}`, cleanQuery)}
                      </p>

                      <p className="text-[10px] text-tertiary truncate mt-0.5">
                        {dest.highlight}
                      </p>
                    </div>

                    {/* Arrow / Selection Indicator */}
                    <div className="self-center pl-1 text-outline/50 group-hover:text-primary transition-colors">
                      {isExactActive ? (
                        <Check className="w-4 h-4 text-optimal" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-outline space-y-2">
                <Compass className="w-7 h-7 mx-auto text-outline/60" />
                <p className="font-medium text-on-surface">No preset destinations found matching "{query}"</p>
                <p className="text-[11px] text-outline">You can still search for this custom city below or choose another category tab above.</p>
              </div>
            )}

            {/* Custom Location fallback entry */}
            {cleanQuery && (
              <button
                type="button"
                onClick={handleSelectCustom}
                onMouseEnter={() => setHighlightedIndex(filteredDestinations.length)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border-t border-white/5 ${
                  highlightedIndex === filteredDestinations.length
                    ? 'bg-surface-container-highest text-primary'
                    : 'hover:bg-surface-container/60 text-outline'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-outline shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-on-surface">
                    Use custom location: <span className="text-primary font-bold">"{query}"</span>
                  </span>
                  <p className="text-[10px] text-outline">Press Enter or click to use this exact city name</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
