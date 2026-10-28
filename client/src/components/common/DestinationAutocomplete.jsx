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
  Loader2,
} from 'lucide-react';
import { getDestinationMedia } from '../../services/destinationMediaService';


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
  {
    city: 'Antipolo City',
    shortName: 'Antipolo',
    province: 'Rizal',
    region: 'CALABARZON (Region 4A)',
    category: 'Highland',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Pinto Art Museum • Hinulugang Taktak • Scenic Overlooking Cafes',
    tag: 'Pilgrimage & Art City',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['antipolo', 'rizal', 'pinto art', 'hinulugang taktak', 'overlooking', 'calabarzon'],
  },
  {
    city: 'Lucena City',
    shortName: 'Lucena',
    province: 'Quezon Province',
    region: 'CALABARZON (Region 4A)',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Pancit Habhab Delights • Lucena Cathedral • Dalahican Bay Ports',
    tag: 'Bio-City of the South',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['lucena', 'quezon', 'habhab', 'dalahican', 'calabarzon', 'southern tagalog'],
  },
  {
    city: 'Cabanatuan City',
    shortName: 'Cabanatuan',
    province: 'Nueva Ecija',
    region: 'Central Luzon (Region 3)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Plaza Lucero • Historic General Luna Statue • Local Longganisa',
    tag: 'Tricycle Capital & Granary Hub',
    icon: Utensils,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['cabanatuan', 'nueva ecija', 'longganisa', 'central luzon'],
  },
  {
    city: 'Tarlac City',
    shortName: 'Tarlac',
    province: 'Tarlac',
    region: 'Central Luzon (Region 3)',
    category: 'Heritage & Culture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Monasterio de Tarlac • Aquino Center & Museum • Kart City',
    tag: 'Heart of Central Luzon',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['tarlac', 'monasterio', 'aquino center', 'central luzon'],
  },
  {
    city: 'San Fernando (Pampanga)',
    shortName: 'San Fernando',
    province: 'Pampanga',
    region: 'Central Luzon (Region 3)',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Giant Lantern Festival • Historic Railway Station • Kapampangan Culinary',
    tag: 'Christmas Capital of the Philippines',
    icon: Sparkles,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['san fernando', 'pampanga', 'giant lantern', 'parol', 'central luzon'],
  },
  {
    city: 'San Fernando (La Union)',
    shortName: 'San Fernando LU',
    province: 'La Union',
    region: 'Ilocos Region (Region 1)',
    category: 'Coast & Culture',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Poro Point Lighthouse • Ma-Cho Taoist Temple • Botanical Gardens',
    tag: 'Gateway to the North Coast',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['san fernando la union', 'san fernando lu', 'poro point', 'ma-cho temple', 'la union', 'ilocos'],
  },
  {
    city: 'Alaminos (Hundred Islands)',
    shortName: 'Hundred Islands',
    province: 'Pangasinan',
    region: 'Ilocos Region (Region 1)',
    category: 'Island',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: '124 Mushroom-Shaped Islands • Governor Island Zipline • Snorkeling Marine Sanctuary',
    tag: 'National Marine Park',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['alaminos', 'hundred islands', 'pangasinan', 'governor island', 'snorkeling', 'ilocos'],
  },
  {
    city: 'Dagupan City',
    shortName: 'Dagupan',
    province: 'Pangasinan',
    region: 'Ilocos Region (Region 1)',
    category: 'Food & Coastal',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Bonuan Tondaligan Blue Beach • World-Renowned Bangus Capital • Seafood Docks',
    tag: 'Bangus Capital of the Philippines',
    icon: Utensils,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['dagupan', 'pangasinan', 'bangus', 'tondaligan', 'bonuan', 'ilocos'],
  },
  {
    city: 'Cavite City',
    shortName: 'Cavite City',
    province: 'Cavite',
    region: 'CALABARZON (Region 4A)',
    category: 'Heritage & Culture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Corregidor Island Gateway • Historic Sangley Point • Fort San Felipe',
    tag: 'Historic Peninsular City',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['cavite', 'cavite city', 'sangley point', 'corregidor', 'calabarzon'],
  },
  {
    city: 'Bacoor City',
    shortName: 'Bacoor',
    province: 'Cavite',
    region: 'CALABARZON (Region 4A)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Bahay Tisa Ancestral Home • Digman Halo-Halo • Coastal Mangroves',
    tag: 'City of Journey Gateway',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['bacoor', 'cavite', 'digman', 'halo halo', 'calabarzon'],
  },
  {
    city: 'Imus City',
    shortName: 'Imus',
    province: 'Cavite',
    region: 'CALABARZON (Region 4A)',
    category: 'Heritage & Culture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Battle of Alapan Flag Monument • Imus Cathedral • Famous Savory Longganisa',
    tag: 'Flag Capital of the Philippines',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['imus', 'cavite', 'battle of alapan', 'flag capital', 'calabarzon'],
  },
  {
    city: 'Dasmariñas City',
    shortName: 'Dasmarinas',
    province: 'Cavite',
    region: 'CALABARZON (Region 4A)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Museo De La Salle • Promenade Parks • Bustling University Metropolis',
    tag: 'University Capital of Cavite',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['dasmarinas', 'dasma', 'cavite', 'la salle', 'calabarzon'],
  },
  {
    city: 'Calamba City',
    shortName: 'Calamba',
    province: 'Laguna',
    region: 'CALABARZON (Region 4A)',
    category: 'Heritage & Thermal',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Rizal Shrine Birthplace • Mount Makiling Thermal Hot Springs • Calamba Claypot',
    tag: 'Resort Capital of the Philippines',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['calamba', 'laguna', 'rizal shrine', 'hot springs', 'pansol', 'calabarzon'],
  },
  {
    city: 'Santa Rosa (Laguna)',
    shortName: 'Santa Rosa',
    province: 'Laguna',
    region: 'CALABARZON (Region 4A)',
    category: 'Metro & Leisure',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Enchanted Kingdom Theme Park • Nuvali Eco-Park Lake • Paseo Outlets',
    tag: 'Lion City of the South',
    icon: Sparkles,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['santa rosa', 'laguna', 'enchanted kingdom', 'nuvali', 'calabarzon'],
  },
  {
    city: 'Biñan City',
    shortName: 'Binan',
    province: 'Laguna',
    region: 'CALABARZON (Region 4A)',
    category: 'Heritage & Food',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Historic Alberto Mansion • Authentic Special Puto Biñan • Splash Island',
    tag: 'City of Heritage & Puto',
    icon: Utensils,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['binan', 'laguna', 'puto binan', 'splash island', 'calabarzon'],
  },
  {
    city: 'San Pedro City',
    shortName: 'San Pedro',
    province: 'Laguna',
    region: 'CALABARZON (Region 4A)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Sampaguita Festival Gardens • Historic San Pedro Apostol Parish',
    tag: 'Sampaguita Capital of the Philippines',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['san pedro', 'laguna', 'sampaguita', 'calabarzon'],
  },
  {
    city: 'Lipa City',
    shortName: 'Lipa',
    province: 'Batangas',
    region: 'CALABARZON (Region 4A)',
    category: 'Highland & Heritage',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'San Sebastian Cathedral • Mount Malarayat Cool Breezes • Famous Barako Coffee',
    tag: 'Little Rome of the Philippines',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['lipa', 'batangas', 'barako', 'malarayat', 'little rome', 'calabarzon'],
  },
  {
    city: 'Batangas City',
    shortName: 'Batangas',
    province: 'Batangas',
    region: 'CALABARZON (Region 4A)',
    category: 'Coastal Port',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Basilica of the Immaculate Conception • Batangas International Seaport • Authentic Lomi',
    tag: 'Industrial Port of Southern Luzon',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['batangas', 'batangas city', 'port', 'lomi', 'calabarzon'],
  },
  {
    city: 'Olongapo City',
    shortName: 'Olongapo',
    province: 'Zambales',
    region: 'Central Luzon (Region 3)',
    category: 'Metro & Coastal',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Subic Bay Waterfront • Marikit Park • Duty-Free Shopping Districts',
    tag: 'City of Volunteerism',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['olongapo', 'zambales', 'subic', 'central luzon'],
  },
  {
    city: 'Dingalan (Aurora)',
    shortName: 'Dingalan',
    province: 'Aurora',
    region: 'Central Luzon (Region 3)',
    category: 'Highland & Ocean',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Batanes of the East Mountain Viewpoint • White Beach • Lamao Caves',
    tag: 'Batanes of the East',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['dingalan', 'aurora', 'batanes of the east', 'white beach', 'lamao', 'central luzon'],
  },
  {
    city: 'Sorsogon City',
    shortName: 'Sorsogon',
    province: 'Sorsogon',
    region: 'Bicol Region (Region 5)',
    category: 'Nature & Coastal',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Bulusan Volcano Natural Park Lake • Paguriran Island Lagoon • Rompeolas Boardwalk',
    tag: 'Gateway to Southern Bicol',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['sorsogon', 'bulusan', 'paguriran', 'bicol'],
  },
  {
    city: 'Ormoc City',
    shortName: 'Ormoc',
    province: 'Leyte',
    region: 'Eastern Visayas (Region 8)',
    category: 'Highland & Lake',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: false,
    highlight: 'Lake Danao Guitar-Shaped Lake • Queen Pineapple Plantations • Alto Peak Highpoint',
    tag: 'City of Beautiful People & Sweet Pineapples',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['ormoc', 'leyte', 'lake danao', 'pineapple', 'eastern visayas'],
  },
  {
    city: 'Roxas City',
    shortName: 'Roxas',
    province: 'Capiz',
    region: 'Western Visayas (Region 6)',
    category: 'Coastal & Seafood',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Baybay Beach Seafood Boulevard • Pan-ay Church Biggest Bell in Asia • River Cruises',
    tag: 'Seafood Capital of the Philippines',
    icon: Utensils,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['roxas', 'capiz', 'seafood capital', 'pan-ay', 'western visayas'],
  },
  {
    city: 'Kalibo (Aklan)',
    shortName: 'Kalibo',
    province: 'Aklan',
    region: 'Western Visayas (Region 6)',
    category: 'Heritage & Nature',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Ati-Atihan Mother of All PH Festivals • Bakhawan Mangrove Eco-Park • Pina Weaving',
    tag: 'Home of the Ati-Atihan',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['kalibo', 'aklan', 'ati-atihan', 'bakhawan', 'western visayas'],
  },
  {
    city: 'Tagbilaran City',
    shortName: 'Tagbilaran',
    province: 'Bohol',
    region: 'Central Visayas (Region 7)',
    category: 'Heritage & Port',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Blood Compact Shrine (Sandugo) • St. Joseph the Worker Cathedral • Bohol Gateway',
    tag: 'City of Peace and Friendship',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['tagbilaran', 'bohol', 'sandugo', 'central visayas'],
  },
  {
    city: 'Butuan City',
    shortName: 'Butuan',
    province: 'Agusan del Norte',
    region: 'Caraga Region (Region 13)',
    category: 'Heritage & History',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Balangay Ancient Boats Shrine • Agusan River Walk • National Museum Butuan',
    tag: 'Timber City & Ancient Boat Heritage',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['butuan', 'balangay', 'agusan', 'caraga', 'mindanao'],
  },
  {
    city: 'Surigao City',
    shortName: 'Surigao',
    province: 'Surigao del Norte',
    region: 'Caraga Region (Region 13)',
    category: 'Coastal Gateway',
    categoryGroup: 'SURF_ADVENTURE',
    popular: false,
    highlight: 'Mabua Pebble Beach • Basul Island • Gateway to Siargao & Dinagat',
    tag: 'City of Island Adventures',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['surigao', 'mabua pebble beach', 'surigao del norte', 'caraga', 'mindanao'],
  },
  {
    city: 'General Santos City',
    shortName: 'General Santos',
    province: 'South Cotabato',
    region: 'SOCCSKSARGEN (Region 12)',
    category: 'Food & Coastal',
    categoryGroup: 'METRO_FOOD',
    popular: true,
    highlight: 'Sarangani Bay Tuna Fish Port • Queen Tuna Park • Sanchez Peak Trekking',
    tag: 'Tuna Capital of the Philippines',
    icon: Utensils,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['general santos', 'gensan', 'tuna capital', 'south cotabato', 'mindanao'],
  },
  {
    city: 'Zamboanga City',
    shortName: 'Zamboanga',
    province: 'Zamboanga del Sur',
    region: 'Zamboanga Peninsula (Region 9)',
    category: 'Heritage & Beach',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Fort Pilar Historic Shrine • Santa Cruz Pink Sand Beach • Colorful Vinta Boats',
    tag: 'Asia\'s Latin City',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['zamboanga', 'fort pilar', 'pink sand beach', 'vinta', 'chavacano', 'mindanao'],
  },
  {
    city: 'Cotabato City',
    shortName: 'Cotabato',
    province: 'Maguindanao',
    region: 'BARMM',
    category: 'Heritage & Culture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Grand Mosque (Sultan Hassanal Bolkiah) • Kutawato Caves • Rio Grande de Mindanao',
    tag: 'City of Golden Mosques',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['cotabato', 'grand mosque', 'barmm', 'maguindanao', 'mindanao'],
  },
  {
    city: 'Mandaluyong City',
    shortName: 'Mandaluyong',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Megamall & Shangri-La Shopping • Greenfield District Weekend Market',
    tag: 'Shopping Mall Capital of the Philippines',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['mandaluyong', 'megamall', 'shangri-la', 'greenfield', 'metro manila'],
  },
  {
    city: 'Marikina City',
    shortName: 'Marikina',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Marikina River Park Promenade • Shoe Museum • Lilac Street Dining Strip',
    tag: 'Shoe Capital of the Philippines',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['marikina', 'shoe museum', 'river park', 'lilac street', 'metro manila'],
  },
  {
    city: 'Pasay City',
    shortName: 'Pasay',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro & Entertainment',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'SM Mall of Asia Seaside • Cultural Center of the Philippines • Entertainment City',
    tag: 'Travel City of the Philippines',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['pasay', 'moa', 'mall of asia', 'ccp', 'entertainment city', 'metro manila'],
  },
  {
    city: 'Parañaque City',
    shortName: 'Paranaque',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Heritage & Entertainment',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Baclaran Redemptorist Church • City of Dreams & Okada • Coastal Lagoon',
    tag: 'Bay City of Entertainment',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['paranaque', 'baclaran', 'okada', 'city of dreams', 'metro manila'],
  },
  {
    city: 'Las Piñas City',
    shortName: 'Las Pinas',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Historic Bamboo Organ of St. Joseph • Sarao Motors Jeepney Factory',
    tag: 'Home of the Historic Bamboo Organ',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['las pinas', 'bamboo organ', 'sarao jeepney', 'metro manila'],
  },
  {
    city: 'Muntinlupa (Alabang)',
    shortName: 'Alabang',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro & Lifestyle',
    categoryGroup: 'METRO_FOOD',
    popular: false,
    highlight: 'Filinvest City Trails • Festival Alabang River Park • Molito Lifestyle Strip',
    tag: 'Emerald City of the South',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['muntinlupa', 'alabang', 'filinvest', 'molito', 'metro manila'],
  },
  {
    city: 'Caloocan City',
    shortName: 'Caloocan',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Historic Bonifacio Monument • Gubat sa Ciudad Eco-Resort',
    tag: 'Historic City of Heroes',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['caloocan', 'monumento', 'bonifacio monument', 'metro manila'],
  },
  {
    city: 'San Juan City',
    shortName: 'San Juan',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Heritage & Food',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Pinaglabanan Historical Shrine • Greenhills Shopping Center • Wattah Wattah Fest',
    tag: 'Heart of Metro Manila',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['san juan', 'greenhills', 'pinaglabanan', 'metro manila'],
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
    category: 'Modern Wonder',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Burj Khalifa Skydeck • Dubai Marina • Desert Dune Safari',
    tag: 'City of Gold & Wonder',
    icon: Building2,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['dubai', 'uae', 'burj khalifa', 'emirates', 'marina', 'desert', 'downtown dubai'],
  },
  {
    city: 'Reykjavik',
    shortName: 'Reykjavik',
    province: 'Capital Region',
    region: 'Iceland',
    country: 'Iceland',
    category: 'Highland & Nature',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Hallgrímskirkja • Blue Lagoon • Northern Lights & Glaciers',
    tag: 'Land of Fire & Ice',
    icon: Mountain,
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    keywords: ['reykjavik', 'iceland', 'hallgrimskirkja', 'blue lagoon', 'aurora', 'glacier', 'geysir'],
  },
  {
    city: 'Cairo',
    shortName: 'Cairo',
    province: 'Cairo Governorate',
    region: 'Egypt',
    country: 'Egypt',
    category: 'Ancient Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Giza Pyramids • Great Sphinx • Nile River Feluccas',
    tag: 'Cradle of Ancient Wonder',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['cairo', 'egypt', 'pyramids', 'giza', 'sphinx', 'nile', 'museum'],
  },
  {
    city: 'Cusco',
    shortName: 'Cusco',
    province: 'Cusco Region',
    region: 'Peru',
    country: 'Peru',
    category: 'Highland & Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Machu Picchu • Sacred Valley • Plaza de Armas',
    tag: 'Imperial Inca Capital',
    icon: Mountain,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    keywords: ['cusco', 'cuzco', 'peru', 'machu picchu', 'andes', 'inca', 'sacred valley'],
  },
  {
    city: 'Nairobi',
    shortName: 'Nairobi',
    province: 'Nairobi County',
    region: 'Kenya',
    country: 'Kenya',
    category: 'Highland & Wildlife',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Nairobi National Park • Giraffe Centre • Great Rift Valley',
    tag: 'Green City in the Sun',
    icon: Trees,
    badgeColor: 'text-emerald-600 bg-emerald-600/10 border-emerald-600/20',
    keywords: ['nairobi', 'kenya', 'safari', 'national park', 'giraffe centre', 'africa'],
  },
  {
    city: 'Berlin',
    shortName: 'Berlin',
    province: 'Berlin State',
    region: 'Germany',
    country: 'Germany',
    category: 'Metropolis & History',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Brandenburg Gate • Museum Island • Reichstag Dome',
    tag: 'Historic Cultural Capital',
    icon: Building2,
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    keywords: ['berlin', 'germany', 'brandenburg gate', 'reichstag', 'museum island', 'europe'],
  },
  {
    city: 'Munich',
    shortName: 'Munich',
    province: 'Bavaria',
    region: 'Germany',
    country: 'Germany',
    category: 'Culture & Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: false,
    highlight: 'Marienplatz • Nymphenburg Palace • English Garden',
    tag: 'Heart of Bavaria',
    icon: Landmark,
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    keywords: ['munich', 'muenchen', 'germany', 'bavaria', 'marienplatz', 'nymphenburg'],
  },
  {
    city: 'Vienna',
    shortName: 'Vienna',
    province: 'Vienna State',
    region: 'Austria',
    country: 'Austria',
    category: 'Imperial Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Schönbrunn Palace • St. Stephen’s Cathedral • Opera House',
    tag: 'City of Classical Music',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['vienna', 'wien', 'austria', 'schonbrunn', 'hofburg', 'danube', 'mozart'],
  },
  {
    city: 'Prague',
    shortName: 'Prague',
    province: 'Bohemia',
    region: 'Czech Republic',
    country: 'Czech Republic',
    category: 'Historic Architecture',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Charles Bridge • Prague Castle • Old Town Astronomical Clock',
    tag: 'City of a Hundred Spires',
    icon: Landmark,
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    keywords: ['prague', 'praha', 'czech', 'charles bridge', 'prague castle', 'astronomical clock'],
  },
  {
    city: 'Zurich',
    shortName: 'Zurich',
    province: 'Canton of Zurich',
    region: 'Switzerland',
    country: 'Switzerland',
    category: 'Lakes & Alps',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Lake Zurich Promenade • Altstadt Old Town • Alpine Vistas',
    tag: 'Alpine Lakeside Metropolis',
    icon: Mountain,
    badgeColor: 'text-teal-600 bg-teal-600/10 border-teal-600/20',
    keywords: ['zurich', 'switzerland', 'swiss', 'lake zurich', 'alps', 'altstadt'],
  },
  {
    city: 'Athens',
    shortName: 'Athens',
    province: 'Attica',
    region: 'Greece',
    country: 'Greece',
    category: 'Ancient Heritage',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'The Parthenon & Acropolis • Plaka Historic Quarter • Temple of Zeus',
    tag: 'Birthplace of Western Civilization',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['athens', 'greece', 'acropolis', 'parthenon', 'plaka', 'aegean'],
  },
  {
    city: 'Venice',
    shortName: 'Venice',
    province: 'Veneto',
    region: 'Italy',
    country: 'Italy',
    category: 'Canals & Romance',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'St. Mark’s Basilica • Grand Canal Gondolas • Rialto Bridge',
    tag: 'Floating Canal Oasis',
    icon: Waves,
    badgeColor: 'text-sky-600 bg-sky-600/10 border-sky-600/20',
    keywords: ['venice', 'venezia', 'italy', 'grand canal', 'rialto', 'san marco', 'gondola'],
  },
  {
    city: 'Florence',
    shortName: 'Florence',
    province: 'Tuscany',
    region: 'Italy',
    country: 'Italy',
    category: 'Renaissance Art',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Florence Cathedral Duomo • Ponte Vecchio • Uffizi Gallery',
    tag: 'Cradle of the Renaissance',
    icon: Landmark,
    badgeColor: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    keywords: ['florence', 'firenze', 'italy', 'tuscany', 'duomo', 'ponte vecchio', 'uffizi'],
  },
  {
    city: 'Madrid',
    shortName: 'Madrid',
    province: 'Community of Madrid',
    region: 'Spain',
    country: 'Spain',
    category: 'Metropolis & Art',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Royal Palace of Madrid • Prado Museum • Retiro Park Glass Palace',
    tag: 'Royal Heart of Spain',
    icon: Building2,
    badgeColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    keywords: ['madrid', 'spain', 'royal palace', 'prado', 'retiro', 'gran via'],
  },
  {
    city: 'Lisbon',
    shortName: 'Lisbon',
    province: 'Lisbon District',
    region: 'Portugal',
    country: 'Portugal',
    category: 'Coastal Heritage',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Belém Tower • Jerónimos Monastery • Tram 28 Miradouros',
    tag: 'City of Seven Hills',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['lisbon', 'lisboa', 'portugal', 'belem tower', 'alfama', 'tram 28', 'tagus'],
  },
  {
    city: 'Edinburgh',
    shortName: 'Edinburgh',
    province: 'Scotland',
    region: 'United Kingdom',
    country: 'United Kingdom',
    category: 'Historic Castles',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Edinburgh Castle • Royal Mile • Arthur’s Seat Volcanic Peak',
    tag: 'Gothic Castle Capital',
    icon: Landmark,
    badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    keywords: ['edinburgh', 'scotland', 'uk', 'edinburgh castle', 'royal mile', 'arthurs seat'],
  },
  {
    city: 'Dublin',
    shortName: 'Dublin',
    province: 'Leinster',
    region: 'Ireland',
    country: 'Ireland',
    category: 'Heritage & Pubs',
    categoryGroup: 'GLOBAL',
    popular: false,
    highlight: 'Trinity College Long Room • Temple Bar • St. Stephen’s Green',
    tag: 'Emerald Literary Capital',
    icon: Landmark,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    keywords: ['dublin', 'ireland', 'trinity college', 'temple bar', 'guinness'],
  },
  {
    city: 'Istanbul',
    shortName: 'Istanbul',
    province: 'Marmara Region',
    region: 'Turkey',
    country: 'Turkey',
    category: 'East Meets West',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'Hagia Sophia • Blue Mosque • Bosphorus Sunset Cruise',
    tag: 'Crossroads of Two Continents',
    icon: Landmark,
    badgeColor: 'text-teal-600 bg-teal-600/10 border-teal-600/20',
    keywords: ['istanbul', 'turkey', 'turkiye', 'hagia sophia', 'blue mosque', 'bosphorus', 'bazaar'],
  },
  {
    city: 'Rio de Janeiro',
    shortName: 'Rio de Janeiro',
    province: 'State of Rio de Janeiro',
    region: 'Brazil',
    country: 'Brazil',
    category: 'Beaches & Wonders',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'Christ the Redeemer • Copacabana Beach • Sugarloaf Mountain',
    tag: 'Marvelous Coastal City',
    icon: Palmtree,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    keywords: ['rio', 'rio de janeiro', 'brazil', 'copacabana', 'christ the redeemer', 'ipanema', 'sugarloaf'],
  },
  {
    city: 'Buenos Aires',
    shortName: 'Buenos Aires',
    province: 'Autonomous City',
    region: 'Argentina',
    country: 'Argentina',
    category: 'Culture & Tango',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Obelisco de Buenos Aires • Plaza de Mayo • Caminito La Boca',
    tag: 'Paris of South America',
    icon: Building2,
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    keywords: ['buenos aires', 'argentina', 'obelisco', 'tango', 'la boca', 'recoleta'],
  },
  {
    city: 'Vancouver',
    shortName: 'Vancouver',
    province: 'British Columbia',
    region: 'Canada',
    country: 'Canada',
    category: 'Nature & Metropolis',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Stanley Park Seawall • Capilano Suspension Bridge • Coastal Mountains',
    tag: 'Pacific Coastal Gem',
    icon: Mountain,
    badgeColor: 'text-teal-600 bg-teal-600/10 border-teal-600/20',
    keywords: ['vancouver', 'canada', 'stanley park', 'capilano', 'british columbia', 'granville'],
  },
  {
    city: 'Toronto',
    shortName: 'Toronto',
    province: 'Ontario',
    region: 'Canada',
    country: 'Canada',
    category: 'Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'CN Tower Skydeck • Toronto Islands • Distillery Historic District',
    tag: 'Global Cultural Mosaic',
    icon: Building2,
    badgeColor: 'text-red-500 bg-red-500/10 border-red-500/20',
    keywords: ['toronto', 'canada', 'cn tower', 'ontario', 'lake ontario'],
  },
  {
    city: 'Chicago',
    shortName: 'Chicago',
    province: 'Illinois',
    region: 'United States',
    country: 'United States',
    category: 'Architecture & Lake',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Cloud Gate (The Bean) • Millennium Park • Willis Tower Skydeck',
    tag: 'Windy City Skyline',
    icon: Building2,
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    keywords: ['chicago', 'illinois', 'usa', 'cloud gate', 'the bean', 'millennium park', 'willis tower'],
  },
  {
    city: 'Miami',
    shortName: 'Miami',
    province: 'Florida',
    region: 'United States',
    country: 'United States',
    category: 'Beach & Deco',
    categoryGroup: 'BEACH_ISLAND',
    popular: true,
    highlight: 'South Beach Ocean Drive • Art Deco Historic District • Biscayne Bay',
    tag: 'Magic City Waterfront',
    icon: Palmtree,
    badgeColor: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    keywords: ['miami', 'florida', 'usa', 'south beach', 'ocean drive', 'art deco', 'biscayne'],
  },
  {
    city: 'Las Vegas',
    shortName: 'Las Vegas',
    province: 'Nevada',
    region: 'United States',
    country: 'United States',
    category: 'Entertainment',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'The Las Vegas Strip • Bellagio Fountains • High Roller Observation Wheel',
    tag: 'Neon Entertainment Capital',
    icon: Building2,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['las vegas', 'vegas', 'nevada', 'usa', 'strip', 'bellagio', 'fountains'],
  },
  {
    city: 'Cape Town',
    shortName: 'Cape Town',
    province: 'Western Cape',
    region: 'South Africa',
    country: 'South Africa',
    category: 'Mountain & Ocean',
    categoryGroup: 'HIGHLAND_NATURE',
    popular: true,
    highlight: 'Table Mountain Cableway • V&A Waterfront • Cape Point Ocean Cliffs',
    tag: 'Mother City of Two Oceans',
    icon: Mountain,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    keywords: ['cape town', 'south africa', 'table mountain', 'waterfront', 'cape of good hope', 'africa'],
  },
  {
    city: 'Auckland',
    shortName: 'Auckland',
    province: 'North Island',
    region: 'New Zealand',
    country: 'New Zealand',
    category: 'Harbor & Volcanoes',
    categoryGroup: 'GLOBAL',
    popular: false,
    highlight: 'Sky Tower • Waitematā Harbour • Mount Eden Volcanic Crater',
    tag: 'City of Sails',
    icon: Waves,
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    keywords: ['auckland', 'new zealand', 'sky tower', 'waitemata', 'nz'],
  },
  {
    city: 'Queenstown',
    shortName: 'Queenstown',
    province: 'Otago, South Island',
    region: 'New Zealand',
    country: 'New Zealand',
    category: 'Alpine Adventure',
    categoryGroup: 'SURF_ADVENTURE',
    popular: true,
    highlight: 'Lake Wakatipu • The Remarkables Alps • Milford Sound Gateway',
    tag: 'Adventure Capital of the World',
    icon: Mountain,
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    keywords: ['queenstown', 'new zealand', 'remarkables', 'lake wakatipu', 'milford sound', 'adventure', 'nz'],
  },
  {
    city: 'Beijing',
    shortName: 'Beijing',
    province: 'Capital Municipality',
    region: 'China',
    country: 'China',
    category: 'Ancient Dynasties',
    categoryGroup: 'HERITAGE_CULTURE',
    popular: true,
    highlight: 'The Forbidden City • Great Wall of China • Temple of Heaven',
    tag: 'Imperial Dynasty Heart',
    icon: Landmark,
    badgeColor: 'text-red-600 bg-red-600/10 border-red-600/20',
    keywords: ['beijing', 'china', 'forbidden city', 'great wall', 'temple of heaven', 'tiananmen'],
  },
  {
    city: 'Shanghai',
    shortName: 'Shanghai',
    province: 'Municipality',
    region: 'China',
    country: 'China',
    category: 'Futuristic Metropolis',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'The Bund Waterfront • Oriental Pearl Tower • Yu Garden',
    tag: 'Paris of the East',
    icon: Building2,
    badgeColor: 'text-purple-600 bg-purple-600/10 border-purple-600/20',
    keywords: ['shanghai', 'china', 'the bund', 'oriental pearl', 'pudong', 'yu garden'],
  },
  {
    city: 'Milan',
    shortName: 'Milan',
    province: 'Lombardy',
    region: 'Italy',
    country: 'Italy',
    category: 'Fashion & Heritage',
    categoryGroup: 'GLOBAL',
    popular: true,
    highlight: 'Duomo di Milano • Galleria Vittorio Emanuele II • Sforza Castle',
    tag: 'Global Fashion & Design Capital',
    icon: Landmark,
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    keywords: ['milan', 'milano', 'italy', 'duomo', 'galleria', 'fashion', 'lombardy'],
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
  const normalizedQuery = cleanQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Worldwide live geocoding search for queries not limited to presets
  const [liveResults, setLiveResults] = useState([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  useEffect(() => {
    const trimmed = cleanQuery;
    if (trimmed.length < 2) {
      setLiveResults([]);
      setIsLiveSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLiveSearching(true);

        // Sanitize search name for Open-Meteo:
        // Open-Meteo expects pure name without commas or country suffixes.
        // e.g. "Los Angeles, USA" -> search for "Los Angeles", filter by "USA"
        let primaryName = trimmed;
        let secondaryFilter = '';

        if (trimmed.includes(',')) {
          const parts = trimmed.split(',').map((p) => p.trim());
          primaryName = parts[0];
          secondaryFilter = parts.slice(1).join(' ').toLowerCase();
        } else if (trimmed.includes('(')) {
          primaryName = trimmed.replace(/\s*\([^)]*\)/g, '').trim();
        }

        const normalizedSearch = primaryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const fetchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          normalizedSearch || primaryName
        )}&count=10&language=en`;

        const res = await fetch(fetchUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('Geocoding request failed');
        const data = await res.json();

        if (Array.isArray(data.results) && data.results.length > 0) {
          let results = data.results;

          // If user typed a secondary filter (e.g. "CA", "USA", "UK", "PH", "Philippines"), rank/filter by it
          if (secondaryFilter) {
            const matchesSecondary = results.filter((r) => {
              const country = (r.country || '').toLowerCase();
              const countryCode = (r.country_code || '').toLowerCase();
              const admin = (r.admin1 || '').toLowerCase();
              return (
                country.includes(secondaryFilter) ||
                countryCode === secondaryFilter ||
                admin.includes(secondaryFilter) ||
                (secondaryFilter === 'usa' && (countryCode === 'us' || country.includes('united states'))) ||
                (secondaryFilter === 'uk' && (countryCode === 'gb' || country.includes('united kingdom'))) ||
                (secondaryFilter === 'ph' && (countryCode === 'ph' || country.includes('philippines')))
              );
            });
            if (matchesSecondary.length > 0) {
              results = matchesSecondary;
            }
          }

          const formatted = results.slice(0, 8).map((r) => {
            const locName = `${r.name}${r.admin1 && r.admin1 !== r.name ? `, ${r.admin1}` : ''}`;
            const media = getDestinationMedia(r.name);
            const isPh = r.country === 'Philippines' || r.country_code === 'PH';
            return {
              city: locName,
              shortName: r.name,
              province: r.admin1 || r.country || 'Global',
              region: r.country || (isPh ? 'Philippines' : 'International'),
              country: r.country || (isPh ? 'Philippines' : 'Worldwide'),
              countryCode: r.country_code || (isPh ? 'PH' : ''),
              category: isPh ? 'Local Destination' : 'Worldwide Destination',
              categoryGroup: isPh ? 'PHILIPPINES' : 'GLOBAL',
              popular: false,
              highlight: media.landmark || `${r.name} • ${r.admin1 ? `${r.admin1}, ` : ''}${r.country || 'Worldwide'}`,
              tag: r.country || (isPh ? 'Philippines' : 'Worldwide'),
              icon: Globe,
              badgeColor: isPh
                ? 'text-primary bg-primary/10 border-primary/20'
                : 'text-sky-500 bg-sky-500/10 border-sky-500/20',
              keywords: [r.name.toLowerCase(), (r.country || '').toLowerCase(), (r.admin1 || '').toLowerCase()],
              latitude: r.latitude,
              longitude: r.longitude,
              isLive: true,
            };
          });
          setLiveResults(formatted);
        } else {
          setLiveResults([]);
        }
      } catch (err) {
        setLiveResults([]);
      } finally {
        setIsLiveSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [cleanQuery]);

  const filteredDestinations = cleanQuery
    ? ALL_DESTINATIONS.filter((dest) => {
        const cityName = dest.city.toLowerCase();
        const cityNorm = cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const shortName = dest.shortName.toLowerCase();
        const shortNorm = shortName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const country = (dest.country || '').toLowerCase();
        const province = (dest.province || '').toLowerCase();
        const region = (dest.region || '').toLowerCase();
        const tag = (dest.tag || '').toLowerCase();

        const matchesQuery =
          cityName.includes(cleanQuery) ||
          cityNorm.includes(normalizedQuery) ||
          shortName.includes(cleanQuery) ||
          shortNorm.includes(normalizedQuery) ||
          country.includes(cleanQuery) ||
          province.includes(cleanQuery) ||
          region.includes(cleanQuery) ||
          tag.includes(cleanQuery) ||
          (dest.keywords && dest.keywords.some((kw) => kw.includes(cleanQuery) || kw.includes(normalizedQuery)));

        if (selectedCategory === 'ALL' || selectedCategory === 'POPULAR') return matchesQuery;
        if (selectedCategory === 'GLOBAL') return matchesQuery && (dest.categoryGroup === 'GLOBAL' || dest.country !== 'Philippines');
        if (selectedCategory === 'PHILIPPINES') return matchesQuery && dest.country === 'Philippines';
        return matchesQuery;
      })
    : ALL_DESTINATIONS.filter((dest) => {
        if (selectedCategory === 'ALL') return true;
        if (selectedCategory === 'POPULAR') return dest.popular;
        if (selectedCategory === 'GLOBAL') return dest.categoryGroup === 'GLOBAL' || dest.country !== 'Philippines';
        if (selectedCategory === 'PHILIPPINES') return dest.country === 'Philippines';
        return dest.categoryGroup === selectedCategory;
      });

  // Seamlessly merge curated destinations with worldwide live geocoding results
  const combinedDestinations = [...filteredDestinations];
  if (cleanQuery.length >= 2 && liveResults.length > 0) {
    liveResults.forEach((liveDest) => {
      const liveCityNorm = liveDest.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const liveShortNorm = liveDest.shortName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const alreadyExists = combinedDestinations.some((cd) => {
        const cdNorm = cd.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const cdShortNorm = cd.shortName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return cdNorm === liveCityNorm || cdShortNorm === liveShortNorm;
      });
      if (!alreadyExists) {
        if (selectedCategory === 'PHILIPPINES' && liveDest.country !== 'Philippines') {
          return;
        }
        if (selectedCategory === 'GLOBAL' && liveDest.country === 'Philippines') {
          return;
        }
        combinedDestinations.push(liveDest);
      }
    });
  }

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
    const customCity = query.trim();
    setIsOpen(false);
    setHighlightedIndex(-1);
    const customDest = {
      city: customCity,
      shortName: customCity.split(',')[0].trim(),
      province: 'Location',
      region: 'Location',
      country: 'Global Region',
      popular: false,
      tag: 'Location',
      isCustom: true,
    };
    if (onChange) {
      onChange(customCity, customDest);
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
        if (query.trim()) {
          handleSelectCustom();
        }
      }
      return;
    }

    const totalItems = combinedDestinations.length + (cleanQuery ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < combinedDestinations.length) {
        handleSelect(combinedDestinations[highlightedIndex]);
      } else if (highlightedIndex === combinedDestinations.length && cleanQuery) {
        handleSelectCustom();
      } else if (combinedDestinations.length > 0) {
        // Match exact or startsWith
        const exactMatch = combinedDestinations.find((d) => {
          const cNorm = d.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const sNorm = d.shortName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return cNorm === normalizedQuery || sNorm === normalizedQuery || normalizedQuery.startsWith(sNorm);
        });
        handleSelect(exactMatch || combinedDestinations[0]);
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
          {/* Header Indicator with Count & Live Geocoding Status */}
          <div className="px-3.5 py-2.5 flex items-center justify-between text-[11px] text-outline font-medium bg-surface-container/60 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-on-surface font-semibold">
              {isLiveSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              )}
              {cleanQuery
                ? `Matching worldwide destinations (${combinedDestinations.length})`
                : `Recommended destinations (${combinedDestinations.length} available)`}
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

          {/* List of Destination Cards with Famous Spot Previews */}
          <div className="max-h-[300px] sm:max-h-[380px] overflow-y-auto overscroll-contain p-1.5 space-y-1 scrollbar-thin">
            {combinedDestinations.length > 0 ? (
              combinedDestinations.map((dest, index) => {
                const IconComponent = dest.icon || MapPin;
                const isSelected = highlightedIndex === index;
                const isExactActive = (value || '').toLowerCase() === dest.city.toLowerCase();
                const media = getDestinationMedia(dest.shortName || dest.city);

                return (
                  <button
                    key={`${dest.city}-${dest.country || ''}-${index}`}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-surface-container-highest text-on-surface'
                        : 'hover:bg-surface-container/80 text-on-surface-variant'
                    } ${isExactActive ? 'border-l-2 border-primary bg-primary/5' : ''}`}
                  >
                    {/* Destination Famous Spot Preview Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm bg-surface-container group-hover:border-primary/40 transition-all">
                      <img
                        src={media.imageUrl}
                        alt={media.landmark || dest.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Location Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors truncate">
                          {highlightMatch(dest.city, cleanQuery)}
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

                      <p className="text-[10px] text-tertiary truncate mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 font-bold text-[9px] text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.2 rounded border border-primary/20 shrink-0">
                          <MapPin className="w-2.5 h-2.5 text-primary" /> Famous Spot
                        </span>
                        <span className="truncate text-on-surface/90 font-medium">{media.landmark || dest.highlight}</span>
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
                onMouseEnter={() => setHighlightedIndex(combinedDestinations.length)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border-t border-white/5 ${
                  highlightedIndex === combinedDestinations.length
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
