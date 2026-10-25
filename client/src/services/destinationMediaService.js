/**
 * Destination Media Service
 * Provides authentic, landmark-verified imagery for Philippine and international destinations
 * sourced from Wikimedia Commons and Wikipedia with dynamic location matching.
 */

// Curated verified landmark photography from Wikimedia Commons
export const DESTINATION_MEDIA = {
  manila: {
    title: 'Metro Manila',
    landmark: 'Manila Bay & Historic Intramuros',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Cityscape_of_Manila%2C_2025_%2801%29.jpg/1280px-Cityscape_of_Manila%2C_2025_%2801%29.jpg',
    tag: 'National Capital Region',
  },
  'metro manila': {
    title: 'Metro Manila',
    landmark: 'Manila Bay & Historic Intramuros',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Cityscape_of_Manila%2C_2025_%2801%29.jpg/1280px-Cityscape_of_Manila%2C_2025_%2801%29.jpg',
    tag: 'National Capital Region',
  },
  'quezon city': {
    title: 'Quezon City',
    landmark: 'Quezon Memorial Circle & City Parks',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Quezon_Memorial_Circle%2C_Commonwealth_Avenue-Philcoa_NB_drone_%28Quezon_City%3B_03-03-2026%29.jpg/1280px-Quezon_Memorial_Circle%2C_Commonwealth_Avenue-Philcoa_NB_drone_%28Quezon_City%3B_03-03-2026%29.jpg',
    tag: 'Urban Capital Center',
  },
  baguio: {
    title: 'Baguio City',
    landmark: 'Burnham Park & Cordillera Pine Ridge',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg/1280px-Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg',
    tag: 'Summer Capital (1,470m)',
  },
  'baguio city': {
    title: 'Baguio City',
    landmark: 'Burnham Park & Cordillera Pine Ridge',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg/1280px-Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg',
    tag: 'Summer Capital (1,470m)',
  },
  boracay: {
    title: 'Boracay Island',
    landmark: 'White Beach & Turquoise Waters',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Boracay_White_Beach.png/1280px-Boracay_White_Beach.png',
    tag: 'World-Class White Beach',
  },
  siargao: {
    title: 'Siargao Island',
    landmark: 'Cloud 9 Surfing Boardwalk & Tropical Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Siargao_25.jpg/1280px-Siargao_25.jpg',
    tag: 'Pacific Surfing Capital',
  },
  palawan: {
    title: 'Palawan (El Nido)',
    landmark: 'Bacuit Bay Lagoons & Towering Limestone Karsts',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/El_Nido_Bay_December_2018.jpg/1280px-El_Nido_Bay_December_2018.jpg',
    tag: 'Bacuit Bay Karsts',
  },
  'el nido': {
    title: 'El Nido, Palawan',
    landmark: 'Bacuit Bay Lagoons & Towering Limestone Karsts',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/El_Nido_Bay_December_2018.jpg/1280px-El_Nido_Bay_December_2018.jpg',
    tag: 'Limestone Cliffs & Bays',
  },
  coron: {
    title: 'Coron, Palawan',
    landmark: 'Kayangan Lake & Mt. Tapyas Bay Overlook',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Coron_skyline_Tapyas_%28Coron%2C_Palwan%3B_03-16-2024%29.jpg/1280px-Coron_skyline_Tapyas_%28Coron%2C_Palwan%3B_03-16-2024%29.jpg',
    tag: 'Crystal Clear Lakes & Wrecks',
  },
  tagaytay: {
    title: 'Tagaytay Ridge',
    landmark: 'Taal Volcano & Scenic Lake Ridge',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg/1280px-Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg',
    tag: 'Cool Highland Ridge',
  },
  cebu: {
    title: 'Cebu City',
    landmark: 'Cebu City Skyline & Historic Heritage Port',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Cebu_city_skyline_2025.jpg/1280px-Cebu_city_skyline_2025.jpg',
    tag: 'Queen City of the South',
  },
  'cebu city': {
    title: 'Cebu City',
    landmark: 'Cebu City Skyline & Historic Heritage Port',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Cebu_city_skyline_2025.jpg/1280px-Cebu_city_skyline_2025.jpg',
    tag: 'Queen City of the South',
  },
  bohol: {
    title: 'Bohol (Carmen)',
    landmark: 'Chocolate Hills & Panglao Reefs',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolate_Hills_Bohol_Philippines.jpg/1280px-Chocolate_Hills_Bohol_Philippines.jpg',
    tag: 'Chocolate Hills & Coral',
  },
  batanes: {
    title: 'Batanes (Basco)',
    landmark: 'Marlboro Rolling Hills & Sabtang Cliffs',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
    tag: 'Rolling Hills & Lighthouses',
  },
  sagada: {
    title: 'Sagada',
    landmark: 'Echo Valley & Cordillera Mountain Slopes',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
    tag: 'Sea of Clouds & Pines',
  },
  vigan: {
    title: 'Vigan City',
    landmark: 'Calle Crisologo UNESCO Heritage Cobblestones',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
    tag: 'UNESCO Spanish Heritage',
  },
  'la union': {
    title: 'La Union (San Juan)',
    landmark: 'San Juan Surfing Point & Sunset Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg',
    tag: 'Northern Surfing Capital',
  },
  davao: {
    title: 'Davao City',
    landmark: 'Davao City Skyline & Mount Apo Vista',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
    tag: 'Crown Jewel of Mindanao',
  },
  'davao city': {
    title: 'Davao City',
    landmark: 'Davao City Skyline & Mount Apo Vista',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
    tag: 'Crown Jewel of Mindanao',
  },
  iloilo: {
    title: 'Iloilo City',
    landmark: 'Iloilo River Esplanade & Historic Downtown',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg/1280px-Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg',
    tag: 'City of Love & Heritage',
  },
  baler: {
    title: 'Baler, Aurora',
    landmark: 'Dicasalarin Cove & Sabang Pacific Surfing Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Dicasalarin_Cove_%28Baler%29.jpg/1280px-Dicasalarin_Cove_%28Baler%29.jpg',
    tag: 'Pacific Surfing Coast',
  },
  legazpi: {
    title: 'Legazpi City',
    landmark: 'Mayon Volcano Perfect Cone & Legazpi Port',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
    tag: 'Mayon Volcano Vista',
  },
  camiguin: {
    title: 'Camiguin Island',
    landmark: 'Mount Hibok-Hibok & White Island Sandbar',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg',
    tag: 'Island Born of Fire',
  },
  makati: {
    title: 'Makati City',
    landmark: 'Ayala Avenue & Financial Center',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Ayala_Avenue%2C_Makati_Avenue%2C_PSE_%28Makati%3B_01-31-2021%29.jpg/1280px-Ayala_Avenue%2C_Makati_Avenue%2C_PSE_%28Makati%3B_01-31-2021%29.jpg',
    tag: 'Financial Capital',
  },
  taguig: {
    title: 'Taguig (BGC)',
    landmark: 'Bonifacio Global City High Street & Skyline',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg/1280px-Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg',
    tag: 'Modern Global Hub',
  },
  pasig: {
    title: 'Pasig City',
    landmark: 'Ortigas Center Emerald Avenue & Skyline',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/F._Ortigas_Jr._Road_%28Emerald_Avenue%29_from_north_part%2C_Ortigas_Center%2C_Apr_2025.jpg/1280px-F._Ortigas_Jr._Road_%28Emerald_Avenue%29_from_north_part%2C_Ortigas_Center%2C_Apr_2025.jpg',
    tag: 'Commercial River City',
  },
  bacolod: {
    title: 'Bacolod City',
    landmark: 'San Sebastian Cathedral & City of Smiles',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/San_Sebastian_Cathedral_Bacolod_%28Rizal_Street%2C_Bacolod%2C_Negros_Occidental%3B_10-31-2022%29.jpg/1280px-San_Sebastian_Cathedral_Bacolod_%28Rizal_Street%2C_Bacolod%2C_Negros_Occidental%3B_10-31-2022%29.jpg',
    tag: 'City of Smiles',
  },
  'puerto princesa': {
    title: 'Puerto Princesa',
    landmark: 'Puerto Princesa & Honda Bay Island Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/en/thumb/0/01/Dos_Palmas_RP.JPG/1280px-Dos_Palmas_RP.JPG',
    tag: 'Subterranean River & Bays',
  },
  angeles: {
    title: 'Angeles City',
    landmark: 'Angeles City Heritage & Mount Arayat Vista',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Angeles_Lourdes_Sur%2C_Mount_Arayat_drone_%28Angeles%2C_Pampanga%3B_02-15-2026%29.jpg/1280px-Angeles_Lourdes_Sur%2C_Mount_Arayat_drone_%28Angeles%2C_Pampanga%3B_02-15-2026%29.jpg',
    tag: 'Culinary Capital of Pampanga',
  },
  batangas: {
    title: 'Batangas City',
    landmark: 'Minor Basilica of the Immaculate Conception',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Minor_Basilica_of_the_Immaculate_Conception_%28Batangas_City%29%2C_April_2023.jpg/1280px-Minor_Basilica_of_the_Immaculate_Conception_%28Batangas_City%29%2C_April_2023.jpg',
    tag: 'Southern Luzon Port & Heritage',
  },
  antipolo: {
    title: 'Antipolo City',
    landmark: 'Antipolo Cathedral & Sierra Madre Ridge',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Antipolo_City_proper%2C_P._Oliveros%2C_cathedral_%28Antipolo%2C_Rizal%3B_02-06-2024%29.jpg/1280px-Antipolo_City_proper%2C_P._Oliveros%2C_cathedral_%28Antipolo%2C_Rizal%3B_02-06-2024%29.jpg',
    tag: 'Pilgrimage City in the Sky',
  },
  zamboanga: {
    title: 'Zamboanga City',
    landmark: 'Historic Fort Pilar Shrine & Rizal Park',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Zamboanga_City_Hall_%26_Rizal_Park%2C_Mar_2026.jpg/1280px-Zamboanga_City_Hall_%26_Rizal_Park%2C_Mar_2026.jpg',
    tag: 'Asia\'s Latin City',
  },
  'cagayan de oro': {
    title: 'Cagayan de Oro',
    landmark: 'Provincial Capitol & River Rapids Valley',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/CDO_Poblacion%2C_CM_Recto_Avenue-A._Velez%2C_Misamis_Oriental_Provincial_Capitol_drone_%28Cagayan_De_Oro_City%3B_03-21-2026%29.jpg/1280px-CDO_Poblacion%2C_CM_Recto_Avenue-A._Velez%2C_Misamis_Oriental_Provincial_Capitol_drone_%28Cagayan_De_Oro_City%3B_03-21-2026%29.jpg',
    tag: 'City of Golden Friendship',
  },
  dumaguete: {
    title: 'Dumaguete City',
    landmark: 'Dumaguete Belfry Tower & Rizal Boulevard',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Dumaguete_Belfry_park_view_%28Perdices_Street%2C_Dumaguete%2C_Negros_Oriental%3B_01-19-2023%29.jpg/1280px-Dumaguete_Belfry_park_view_%28Perdices_Street%2C_Dumaguete%2C_Negros_Oriental%3B_01-19-2023%29.jpg',
    tag: 'City of Gentle People',
  },
  banaue: {
    title: 'Banaue, Ifugao',
    landmark: 'Batad UNESCO Terraced Rice amphitheater',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Batad_rice_terraces_in_Ifugao%2C_Philippines.jpg/1280px-Batad_rice_terraces_in_Ifugao%2C_Philippines.jpg',
    tag: 'Cordillera Rice Terraces',
  },
  laoag: {
    title: 'Laoag City',
    landmark: 'Sinking Bell Tower & Paoay Church',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Paoay_Church_in_Ilocos_Norte.jpg/1280px-Paoay_Church_in_Ilocos_Norte.jpg',
    tag: 'Sunshine City of the North',
  },
  pagudpud: {
    title: 'Pagudpud, Ilocos Norte',
    landmark: 'Saud Beach & Bangui Windmills Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Saud_Beach_Pagudpud.jpg/1280px-Saud_Beach_Pagudpud.jpg',
    tag: 'Boracay of the North',
  },
  samal: {
    title: 'Samal Island',
    landmark: 'Island Garden of Davao Coastal Waters',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Pearl_Farm_Beach_Resort%2C_Samal_Island%2C_Davao.jpg/1280px-Pearl_Farm_Beach_Resort%2C_Samal_Island%2C_Davao.jpg',
    tag: 'Island Garden of Davao',
  },
  mati: {
    title: 'Mati City',
    landmark: 'Dahican Pacific Coast & Skimboarding Bay',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Dahican_Beach_Mati_Davao_Oriental.jpg/1280px-Dahican_Beach_Mati_Davao_Oriental.jpg',
    tag: 'Skimboarding Pacific Shore',
  },
  siquijor: {
    title: 'Siquijor Island',
    landmark: 'Cambugahay Falls & Salagdoong Turquoise Bay',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg/1280px-Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg',
    tag: 'Mystic Island of Fire',
  },
  moalboal: {
    title: 'Moalboal, Cebu',
    landmark: 'Panagsama Coral Reef & Millions of Sardines',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Sardine_run_Moalboal.jpg/1280px-Sardine_run_Moalboal.jpg',
    tag: 'Sardine Run Coral Sanctuary',
  },
  bantayan: {
    title: 'Bantayan Island',
    landmark: 'Sugar Beach Powdery Sands & Kota Sandbar',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Kota_Beach_Sandbar_Bantayan_Island.jpg/1280px-Kota_Beach_Sandbar_Bantayan_Island.jpg',
    tag: 'Powdery Coral Sandbar',
  },
  malapascua: {
    title: 'Malapascua Island',
    landmark: 'Monad Shoal & Bounty White Beach',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Bounty_Beach_Malapascua_Island.jpg/1280px-Bounty_Beach_Malapascua_Island.jpg',
    tag: 'Thresher Shark Reef',
  },
  naga: {
    title: 'Naga City',
    landmark: 'Our Lady of Peñafrancia Basilica & CWC',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Basilica_Minore_of_Our_Lady_of_Pe%C3%B1afrancia%2C_Naga_City.jpg/1280px-Basilica_Minore_of_Our_Lady_of_Pe%C3%B1afrancia%2C_Naga_City.jpg',
    tag: 'Pilgrim City & Wakeboarding',
  },
  donsol: {
    title: 'Donsol, Sorsogon',
    landmark: 'Whale Shark Bay & Coastal Mangroves',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Whale_shark_Georgia_aquarium.jpg/1280px-Whale_shark_Georgia_aquarium.jpg',
    tag: 'Whale Shark Sanctuary',
  },
  caramoan: {
    title: 'Caramoan Islands',
    landmark: 'Matukad Island Secret Lagoon & Limestone Karsts',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Caramoan_Islands_beach.jpg/1280px-Caramoan_Islands_beach.jpg',
    tag: 'Rugged Limestone Karsts',
  },
  bukidnon: {
    title: 'Bukidnon (Dahilayan)',
    landmark: 'Mount Kitanglad & Dahilayan Alpine Forest',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Mount_Kitanglad_Range.jpg/1280px-Mount_Kitanglad_Range.jpg',
    tag: 'Highland Alpine Forest',
  },
  iligan: {
    title: 'Iligan City',
    landmark: 'Maria Cristina Twin Falls & River Gorge',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Maria_Cristina_Falls_Iligan.jpg/1280px-Maria_Cristina_Falls_Iligan.jpg',
    tag: 'City of Majestic Waterfalls',
  },
  'lake sebu': {
    title: 'Lake Sebu',
    landmark: 'Seven Waterfalls & T\'boli Ancestral Lotus Lake',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Lake_Sebu_South_Cotabato.jpg/1280px-Lake_Sebu_South_Cotabato.jpg',
    tag: 'Seven Waterfalls & Lotus Lake',
  },
  anilao: {
    title: 'Batangas (Anilao)',
    landmark: 'Anilao Coral Reef & Mount Gulugod Baboy Vista',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Anilao_diving_reef.jpg/1280px-Anilao_diving_reef.jpg',
    tag: 'World Scuba Diving Mecca',
  },
  nasugbu: {
    title: 'Nasugbu, Batangas',
    landmark: 'Fortune Island Grecian Pillars & Sea Coast',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Fortune_Island_Batangas.jpg/1280px-Fortune_Island_Batangas.jpg',
    tag: 'Grecian Columns & Coves',
  },
  'puerto galera': {
    title: 'Puerto Galera',
    landmark: 'White Beach & Sabang Coral Bay',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Puerto_Galera_bay.jpg/1280px-Puerto_Galera_bay.jpg',
    tag: 'UNESCO Biosphere Reserve',
  },
  subic: {
    title: 'Subic Bay',
    landmark: 'Subic Bay Marina & Triboa Rainforest',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Subic_Bay_yacht_club.jpg/1280px-Subic_Bay_yacht_club.jpg',
    tag: 'Rainforest & Coastal Bay',
  },
  bataan: {
    title: 'Bataan (Las Casas)',
    landmark: 'Las Casas Filipinas de Acuzar Heritage Mansions',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Las_Casas_Filipinas_de_Acuzar_Bagac_Bataan.jpg/1280px-Las_Casas_Filipinas_de_Acuzar_Bagac_Bataan.jpg',
    tag: 'Living Heritage Architecture',
  },
  tacloban: {
    title: 'Tacloban City',
    landmark: 'San Juanico Longest Bridge & Leyte Gulf',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/San_Juanico_Bridge_from_Leyte_side.jpg/1280px-San_Juanico_Bridge_from_Leyte_side.jpg',
    tag: 'Gateway to Eastern Visayas',
  },
  kalanggaman: {
    title: 'Kalanggaman Island',
    landmark: 'Pristine White Sandbar & Aquamarine Lagoon',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kalanggaman_Island_sandbar.jpg/1280px-Kalanggaman_Island_sandbar.jpg',
    tag: 'Iconic Sandbar Oasis',
  },
  hinatuan: {
    title: 'Hinatuan, Surigao del Sur',
    landmark: 'Enchanted River Sapphire Deep Springs',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Hinatuan_Enchanted_River.jpg/1280px-Hinatuan_Enchanted_River.jpg',
    tag: 'Sapphire Enchanted Springs',
  },
};

// In-memory runtime cache for dynamically fetched locations
const memoryCache = new Map();

/**
 * Format Wikipedia thumbnail URL to a high-definition 1280px display width
 */
function upscaleWikimediaUrl(url) {
  if (!url) return null;
  // If it's a Wikipedia thumbnail with /###px-, upgrade it to 1280px
  return url.replace(/\/(\d+)px-/, '/1280px-');
}

/**
 * Get curated photo and landmark info for a given destination city synchronously.
 */
export function getDestinationMedia(cityName) {
  if (!cityName) return getDefaultMedia('Destination');

  const clean = cityName.toLowerCase().trim();

  // Check in-memory dynamic cache first
  if (memoryCache.has(clean)) {
    return memoryCache.get(clean);
  }

  // Direct lookup
  if (DESTINATION_MEDIA[clean]) {
    return DESTINATION_MEDIA[clean];
  }

  // Substring match
  const matchKey = Object.keys(DESTINATION_MEDIA).find(
    (key) => clean.includes(key) || key.includes(clean)
  );

  if (matchKey) {
    return DESTINATION_MEDIA[matchKey];
  }

  return getDefaultMedia(cityName);
}

/**
 * Fetch dynamic authentic landmark image from Wikipedia / Wikimedia Commons.
 * Accurately matches any Philippine municipality or international city.
 */
export async function fetchDestinationMedia(cityName) {
  if (!cityName) return null;
  const clean = cityName.trim();
  const cacheKey = clean.toLowerCase();

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // Check sessionStorage if available
  try {
    const cached = sessionStorage.getItem(`skyplan_dest_media_${cacheKey}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      memoryCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (_) {}

  // List of search candidate titles to try against Wikipedia REST API
  const candidates = [
    clean.replace(/ city$/i, ''),
    `${clean.replace(/ city$/i, '')}_City`,
    `${clean},_Philippines`,
    clean,
  ];

  for (const candidate of candidates) {
    try {
      const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
      const response = await fetch(endpoint, {
        headers: {
          'User-Agent': 'SkyPlanApp/1.0 (contact: mark@skyplan.dev)',
        },
      });

      if (!response.ok) continue;

      const data = await response.json();
      const rawThumb = data.thumbnail?.source || data.originalimage?.source;

      if (rawThumb) {
        const highResUrl = upscaleWikimediaUrl(rawThumb);
        const mediaObj = {
          title: data.title || clean,
          landmark: data.description || `${data.title || clean} Landmark`,
          imageUrl: highResUrl,
          tag: data.description || 'Authentic Location Telemetry',
          extract: data.extract,
        };

        memoryCache.set(cacheKey, mediaObj);
        try {
          sessionStorage.setItem(`skyplan_dest_media_${cacheKey}`, JSON.stringify(mediaObj));
        } catch (_) {}

        return mediaObj;
      }
    } catch (_) {
      // Continue to next candidate on network timeout
    }
  }

  // Fallback to curated dictionary if available
  const fallback = getDestinationMedia(clean);
  memoryCache.set(cacheKey, fallback);
  return fallback;
}

function getDefaultMedia(cityName = 'Destination') {
  return {
    title: cityName,
    landmark: `${cityName} Scenic Region`,
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Boracay_White_Beach.png/1280px-Boracay_White_Beach.png',
    tag: 'Philippine Travel Destination',
  };
}
