const { query } = require('../config/db');

/**
 * Curated destination-specific activities catalog with authentic photography and meteorological rules.
 */
const DESTINATION_MEDIA_URLS = {
  burnhamPark: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Burnham_Park_Rose_Garden_with_city_hall_view_%28Baguio_City%3B_12-04-2022%29.jpg/1280px-Burnham_Park_Rose_Garden_with_city_hall_view_%28Baguio_City%3B_12-04-2022%29.jpg',
  bencabMuseum: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Bencab_Museum_in_Benguet%2C_Philippines.JPG/1280px-Bencab_Museum_in_Benguet%2C_Philippines.JPG',
  baguioCity: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg/1280px-Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg',
  boracayWhiteBeach: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Boracay_White_Beach.png/1280px-Boracay_White_Beach.png',
  siargaoCloud9: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Siargao_25.jpg/1280px-Siargao_25.jpg',
  elNidoBay: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/El_Nido_Bay_December_2018.jpg/1280px-El_Nido_Bay_December_2018.jpg',
  coronKayangan: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Cayangan_Lake%2C_Coron_Islands%2C_Philippines_-_panoramio.jpg/1280px-Cayangan_Lake%2C_Coron_Islands%2C_Philippines_-_panoramio.jpg',
  tagaytayTaal: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Taal_Lake_and_Volcano%2C_Tagaytay%2C_Philippines.jpg/1280px-Taal_Lake_and_Volcano%2C_Tagaytay%2C_Philippines.jpg',
  tagaytayHighlands: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg/1280px-Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg',
  kawasanFalls: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Kawasan_Falls_Level_1%2C_Badian%2C_Cebu_in_2026.jpg/1280px-Kawasan_Falls_Level_1%2C_Badian%2C_Cebu_in_2026.jpg',
  magellansCross: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Magellan%27s_Cross_2024-07-05.jpg/1280px-Magellan%27s_Cross_2024-07-05.jpg',
  templeOfLeah: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Temple_of_Leah_2025-08-24_014.jpg/1280px-Temple_of_Leah_2025-08-24_014.jpg',
  cebuCity: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Cebu_city_skyline_2025.jpg/1280px-Cebu_city_skyline_2025.jpg',
  chocolateHills: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Chocolate_Hills_Bohol.JPG/1280px-Chocolate_Hills_Bohol.JPG',
  philippineTarsier: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Philippine_tarsier_%28Carlito_syrichta_fraterculus%29_Bohol.jpg/1280px-Philippine_tarsier_%28Carlito_syrichta_fraterculus%29_Bohol.jpg',
  boholGeneral: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolate_Hills_Bohol_Philippines.jpg/1280px-Chocolate_Hills_Bohol_Philippines.jpg',
  intramuros: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Baluartillo_de_San_Jos%C3%A9%2C_Manila%2C_Filipinas%2C_2023-08-26%2C_DD_41.jpg/1280px-Baluartillo_de_San_Jos%C3%A9%2C_Manila%2C_Filipinas%2C_2023-08-26%2C_DD_41.jpg',
  nationalMuseum: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/National_Museum_of_Fine_Arts_2026.jpg/1280px-National_Museum_of_Fine_Arts_2026.jpg',
  rizalPark: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Rizal_Monument_%28Manila%2C_2024%29.jpg/1280px-Rizal_Monument_%28Manila%2C_2024%29.jpg',
  manilaCityscape: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Cityscape_of_Manila%2C_2025_%2801%29.jpg/1280px-Cityscape_of_Manila%2C_2025_%2801%29.jpg',
  taguigBgc: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg/1280px-Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg',
};

/**
 * Curated destination-specific activities catalog with authentic photography and meteorological rules.
 */
const DESTINATION_ACTIVITIES = {
  baguio: [
    {
      title: 'Burnham Park Swan Boating & Cycling',
      description: 'Pedal a charming swan boat around the cool waters of Burnham Lake or bike along garden pathways.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 12:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.burnhamPark,
      minTemp: 10,
      maxTemp: 26,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds', 'Mist'],
    },
    {
      title: 'Strawberry Picking Farm Experience',
      description: 'Harvest fresh Cordillera strawberries directly from lush agricultural valley fields in crisp morning air.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 11:30',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.baguioCity,
      minTemp: 12,
      maxTemp: 28,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Camp John Hay Pine Forest Hiking',
      description: 'Trek the scenic Yellow Trail and Eco-Trail surrounded by aromatic Benguet pine trees and highland breeze.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 14:00',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.baguioCity,
      minTemp: 10,
      maxTemp: 27,
      maxWind: 35,
      allowedConditions: ['Clear', 'Clouds', 'Mist'],
    },
    {
      title: 'Mines View Ridge & Souvenir Walking',
      description: 'Enjoy sweeping panoramic vistas of the Amburayan Valley and explore authentic Cordillera handicrafts.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 17:00',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.baguioCity,
      minTemp: 12,
      maxTemp: 26,
      maxWind: 35,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'BenCab Museum Cultural Art Exploration',
      description: 'Discover national artist masterpieces, indigenous Cordilleran artifacts, and serene mountain garden terraces.',
      category: 'INDOOR',
      timeSlot: '10:00 - 16:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.bencabMuseum,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
    {
      title: 'Cozy Session Road Cafe & Tsokolate Batirol',
      description: 'Warm up with rich traditional hot chocolate, Benguet highland arabica coffee, and freshly baked pastries.',
      category: 'INDOOR',
      timeSlot: '14:00 - 19:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.baguioCity,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
  ],

  boracay: [
    {
      title: 'White Beach Paddleboarding & Kayaking',
      description: 'Glide across the calm, crystalline turquoise waters of Boracay Station 1 with stunning marine visibility.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 12:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Sunset Paraw Sailing Cruise',
      description: 'Sail the iconic outrigger sailboat along the western shoreline as the golden sun sets into the Sulu Sea.',
      category: 'OUTDOOR',
      timeSlot: '16:30 - 18:30',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 22,
      maxTemp: 33,
      maxWind: 28,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Puka Shell Beach Snorkeling & Coral Tour',
      description: 'Explore rugged coastal shells, vibrant coral formations, and quiet sandy coves away from the central crowd.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 14:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Bulabog Beach Kite Surfing & Wind Sports',
      description: 'Harness the eastern trade winds for thrilling kiteboarding, windsurfing, and coastal aerial sports.',
      category: 'OUTDOOR',
      timeSlot: '10:00 - 15:00',
      iconName: 'Wind',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 20,
      maxTemp: 34,
      maxWind: 45,
      allowedConditions: ['Clear', 'Clouds', 'Windy'],
    },
    {
      title: 'D\'Mall Covered Dining & Live Acoustic Cafes',
      description: 'Savor international beachfront gastronomy, tropical fruit shakes, and relaxing live island melodies.',
      category: 'INDOOR',
      timeSlot: '18:00 - 22:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Mandala Spa & Tropical Wellness Sanctuary',
      description: 'Unwind in tranquil open-air pavilions with traditional Filipino Hilot herbal massage and aromatherapy.',
      category: 'INDOOR',
      timeSlot: '13:00 - 18:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.boracayWhiteBeach,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  siargao: [
    {
      title: 'Cloud 9 Surfing & Wave Riding Lessons',
      description: 'Catch legendary Pacific reef breaks or take beginner wave lessons along the iconic Cloud 9 boardwalk.',
      category: 'OUTDOOR',
      timeSlot: '07:00 - 11:30',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 23,
      maxTemp: 34,
      maxWind: 35,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Sugba Lagoon Stand-Up Paddle & Diving',
      description: 'Cruise emerald mangrove waterways on a paddleboard and dive into deep, serene limestone lagoon waters.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 14:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Magpupungko Natural Tidal Rock Pools',
      description: 'Swim in crystal-clear natural limestone infinity pools uncovered during low tide along the Pacific coast.',
      category: 'OUTDOOR',
      timeSlot: '11:00 - 15:00',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 24,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Palm Tree Road Scenic Scooter Tour',
      description: 'Ride through endless rolling coconut tree groves and stop at the famous curved road scenic viewpoint.',
      category: 'OUTDOOR',
      timeSlot: '14:30 - 17:30',
      iconName: 'Activity',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 22,
      maxTemp: 33,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'General Luna Shaka Bowls & Coastal Cafes',
      description: 'Indulge in nutritious superfood smoothie bowls, cold brews, and fresh vegan treats in breezy cafes.',
      category: 'INDOOR',
      timeSlot: '10:00 - 16:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Corregidor Island & Daku Beach Snorkel',
      description: 'Take a bangka boat to tropical offshore islands featuring golden grasslands, reef fish, and fresh coconut.',
      category: 'OUTDOOR',
      timeSlot: '09:30 - 15:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.siargaoCloud9,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
  ],

  palawan: [
    {
      title: 'Bacuit Bay Big Lagoon Kayaking & Hidden Beach',
      description: 'Paddle through dramatic karst passages into secret lagoons surrounded by towering limestone cliffs.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 14:30',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Taraw Cliff Canopy Walk & Overlook Vista',
      description: 'Climb a secure suspended canopy bridge for breathtaking panoramic views across Bacuit Bay and town.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 10:30',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 20,
      maxTemp: 30,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Nacpan 4km Golden Beach Stroll & Coconut Groves',
      description: 'Relax along pristine golden sands lined with thousands of coconut palms on Palawan\'s most famous twin beach.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 17:30',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 23,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Matinloc Shrine Snorkeling & Coral Reef Diving',
      description: 'Dive among sea turtles and colorful coral gardens near the historic limestone shrine monument.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 13:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Town Waterfront Seafood Grill & Dining',
      description: 'Feast on freshly grilled lapu-lapu, garlic butter crabs, and tropical fruit in covered bayside dining.',
      category: 'INDOOR',
      timeSlot: '18:00 - 21:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'El Nido Traditional Hilot Spa & Wellness',
      description: 'Restore weary muscles with soothing herbal body scrubs, warm coconut oil, and calming seaside ambiance.',
      category: 'INDOOR',
      timeSlot: '14:00 - 19:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.elNidoBay,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  tagaytay: [
    {
      title: 'Taal Volcano Ridge Sightseeing & Lake Panorama',
      description: 'Marvel at the spectacular crater lake and volcanic ridge from cool highland viewing lookouts.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 12:00',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayTaal,
      minTemp: 16,
      maxTemp: 30,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds', 'Mist'],
    },
    {
      title: 'Picnic Grove Zipline & Pine Ridge Trail',
      description: 'Glide on a mountain zipline overlooking lush valleys and enjoy open-air family picnics under pine trees.',
      category: 'OUTDOOR',
      timeSlot: '09:30 - 14:00',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayHighlands,
      minTemp: 16,
      maxTemp: 29,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Mahogany Market Steaming Bulalo Food Crawl',
      description: 'Taste authentic Tagaytay beef shank bulalo with sweet corn and fresh highland greens in bustling market halls.',
      category: 'INDOOR',
      timeSlot: '11:30 - 14:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayHighlands,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Sonya\'s Secret Garden Organic Floral Walk',
      description: 'Stroll through lush aromatic botanical gardens with edible flowers and botanical farm trails.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 16:30',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayHighlands,
      minTemp: 16,
      maxTemp: 30,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Museo Orlina Glass Sculpture Art Viewing',
      description: 'Admire world-renowned glass art installations by Ramon Orlina displayed against a Taal Lake backdrop.',
      category: 'INDOOR',
      timeSlot: '10:00 - 17:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayTaal,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Bag of Beans Rustic Coffee & Pastry Retreat',
      description: 'Relish highland barako coffee, apple pies, and gourmet brunches in a whimsical forested garden room.',
      category: 'INDOOR',
      timeSlot: '14:00 - 19:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.tagaytayHighlands,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  cebu: [
    {
      title: 'Kawasan Falls Canyoneering & Turquoise Rapids',
      description: 'Jump, scramble, and swim through spectacular turquoise river canyons in Southern Cebu.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 13:30',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.kawasanFalls,
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Magellan\'s Cross & Historic Basilica Walk',
      description: 'Walk through 500 years of Philippine history visiting the historic Spanish cross and Basilica del Santo Niño.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 11:30',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.magellansCross,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Temple of Leah & Sirao Flower Garden Highlands',
      description: 'Visit the grand Roman-style hilltop temple and the vibrant Little Amsterdam flower gardens in Busay.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 17:00',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.templeOfLeah,
      minTemp: 20,
      maxTemp: 32,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Moalboal Sardine Run & Sea Turtle Snorkeling',
      description: 'Witness millions of schooling sardines swirling just meters off the reef with resident green sea turtles.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 13:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.cebuCity,
      minTemp: 23,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Taboan Market Dried Delicacies & Lechon Tasting',
      description: 'Sample world-famous crispy Cebu lechon and shop for sweet dried mangoes and danggit souvenirs.',
      category: 'INDOOR',
      timeSlot: '10:00 - 15:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.cebuCity,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Tops Lookout Sunset Skyline & Highland Dining',
      description: 'Dine with sweeping 360-degree city views across Cebu City, Mactan Island, and the illuminated bay.',
      category: 'INDOOR',
      timeSlot: '17:30 - 21:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.cebuCity,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  bohol: [
    {
      title: 'Chocolate Hills Adventure Park & ATV Trail',
      description: 'Ride quad bikes around the iconic conical geological mounds rising dramatically across the central landscape.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 12:00',
      iconName: 'Activity',
      imageUrl: DESTINATION_MEDIA_URLS.chocolateHills,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Loboc River Cruise & Floating Buffet',
      description: 'Dine on fresh Visayan cuisine aboard a covered motorized raft cruising under verdant palm forest canopies.',
      category: 'OUTDOOR',
      timeSlot: '11:30 - 14:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.boholGeneral,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Philippine Tarsier Sanctuary Encounter',
      description: 'Observe the world\'s smallest primates resting quietly in their protected natural secondary forest habitat.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 11:30',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.philippineTarsier,
      minTemp: 20,
      maxTemp: 32,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Panglao Island Alona Beach & Reef Diving',
      description: 'Relax on powdery coral sands, snorkel Balicasag marine sanctuary, and enjoy beachside fruit refreshments.',
      category: 'OUTDOOR',
      timeSlot: '14:00 - 18:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.boholGeneral,
      minTemp: 23,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Hinagdanan Cave Underground Lagoon Swim',
      description: 'Descend into a limestone cavern with illuminated stalactites and swim in a cool underground freshwater pool.',
      category: 'INDOOR',
      timeSlot: '10:00 - 14:00',
      iconName: 'Droplets',
      imageUrl: DESTINATION_MEDIA_URLS.boholGeneral,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Bohol Bee Farm Organic Dining & Ice Cream',
      description: 'Taste organic malunggay and mango ice cream and enjoy farm-to-table coastal cuisine overlooking the sea.',
      category: 'INDOOR',
      timeSlot: '15:00 - 19:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.boholGeneral,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  manila: [
    {
      title: 'Historic Intramuros Bamboo Bike & Fort Santiago',
      description: 'Cycle on eco-friendly bamboo bikes along 16th-century stone ramparts, plazas, and historic dungeons.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 11:30',
      iconName: 'Compass',
      imageUrl: DESTINATION_MEDIA_URLS.intramuros,
      minTemp: 22,
      maxTemp: 35,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'National Museum of Fine Arts & Heritage',
      description: 'View Juan Luna\'s iconic Spoliarium, Guillermo Tolentino sculptures, and national treasure galleries.',
      category: 'INDOOR',
      timeSlot: '10:00 - 16:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.nationalMuseum,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'Manila Bay Sunset Promenade & Seaside Walk',
      description: 'Experience one of the world\'s most famous golden sunsets along the revitalized baywalk seaside boulevard.',
      category: 'OUTDOOR',
      timeSlot: '16:30 - 18:30',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.manilaCityscape,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Rizal Park (Luneta) Cultural Gardens Walk',
      description: 'Stroll through the Japanese and Chinese gardens, dancing musical fountains, and the historic Rizal Monument.',
      category: 'OUTDOOR',
      timeSlot: '07:00 - 10:00',
      iconName: 'Sun',
      imageUrl: DESTINATION_MEDIA_URLS.rizalPark,
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Binondo Chinatown Dim Sum & Heritage Food Crawl',
      description: 'Taste authentic fried siopao, xiao long bao, kiampong, and fresh lumpia in the world\'s oldest Chinatown.',
      category: 'INDOOR',
      timeSlot: '11:30 - 14:30',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.manilaCityscape,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
    {
      title: 'The Mind Museum BGC Interactive Science Discovery',
      description: 'Engage with over 250 interactive science, nature, and space exhibits in an ultra-modern climate-controlled facility.',
      category: 'INDOOR',
      timeSlot: '10:00 - 17:00',
      iconName: 'Sparkles',
      imageUrl: DESTINATION_MEDIA_URLS.taguigBgc,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  batanes: [
    {
      title: 'Basco Lighthouse & Marlboro Rolling Hills',
      description: 'Hike across windswept pasture hills with panoramic vistas of the Pacific Ocean and Mount Iraya.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 11:30',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
      minTemp: 16,
      maxTemp: 30,
      maxWind: 40,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Sabtang Island Traditional Stone Houses Tour',
      description: 'Cross the channel on a traditional faluwa boat and walk through centuries-old Ivatan lime-and-stone villages.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 14:00',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
      minTemp: 18,
      maxTemp: 30,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Valugan Boulder Beach Coastal Stroll',
      description: 'Marvel at millions of smooth volcanic boulders washed by pounding Pacific surf along the eastern coast.',
      category: 'OUTDOOR',
      timeSlot: '15:30 - 18:00',
      iconName: 'Sun',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
      minTemp: 18,
      maxTemp: 30,
      maxWind: 35,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Honesty Coffee Shop & Ivatan Culinary Tasting',
      description: 'Visit the world-famous self-service honesty store and enjoy authentic Ivatan yellow rice and uvud balls.',
      category: 'INDOOR',
      timeSlot: '10:00 - 15:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
  ],

  vigan: [
    {
      title: 'Calle Crisologo Cobblestone Heritage Walk',
      description: 'Walk past 16th-century Spanish colonial mansions, antique street lamps, and heritage craft boutiques.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 11:00',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
      minTemp: 20,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Pagburnayan Traditional Jar Pottery Experience',
      description: 'Watch master artisans mold earthenware burnay jars using ancient methods and foot-powered potter wheels.',
      category: 'OUTDOOR',
      timeSlot: '13:30 - 16:00',
      iconName: 'Activity',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Plaza Salcedo Dancing Fountain & Light Show',
      description: 'Witness illuminated dancing musical water fountains framed by historic provincial government halls.',
      category: 'OUTDOOR',
      timeSlot: '19:00 - 20:30',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
      minTemp: 20,
      maxTemp: 32,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Authentic Vigan Empanada & Longganisa Feast',
      description: 'Enjoy hot crispy orange empanadas packed with grated papaya, local egg, and garlicky Vigan longganisa.',
      category: 'INDOOR',
      timeSlot: '11:30 - 15:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  sagada: [
    {
      title: 'Echo Valley & Hanging Coffins Mountain Hike',
      description: 'Trek down pine-scented limestone cliffs to see ancestral hanging coffins suspended along sacred bluffs.',
      category: 'OUTDOOR',
      timeSlot: '08:00 - 11:30',
      iconName: 'Mountain',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
      minTemp: 12,
      maxTemp: 26,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds', 'Mist'],
    },
    {
      title: 'Kiltepan Peak Sea of Clouds Sunrise',
      description: 'Watch the golden morning sun rise above a magical blanket of white clouds covering the Cordillera valley.',
      category: 'OUTDOOR',
      timeSlot: '05:00 - 07:30',
      iconName: 'Sun',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
      minTemp: 10,
      maxTemp: 22,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds', 'Mist'],
    },
    {
      title: 'Sumaguing Cave Deep Limestone Spelunking',
      description: 'Descend with local gas-lamp guides through crystalline mineral flowstones, pools, and cavern vaults.',
      category: 'INDOOR',
      timeSlot: '10:00 - 14:00',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
    {
      title: 'Sagada Brew & Mountain Yoghurt House Tasting',
      description: 'Savor freshly brewed single-origin Arabica coffee paired with homemade strawberry yoghurt and blueberry pies.',
      category: 'INDOOR',
      timeSlot: '12:00 - 18:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
  ],

  'la union': [
    {
      title: 'San Juan Beach Surfing Lessons & Point Break',
      description: 'Catch reliable West Philippine Sea waves with friendly certified surf instructors in Urbiztondo.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 11:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg',
      minTemp: 22,
      maxTemp: 34,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Tangadan Waterfalls Jungle Trek & Cliff Jump',
      description: 'Hike along river beds and bamboo bridges to jump into deep refreshing pools below cascading waterfalls.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 14:00',
      iconName: 'Activity',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Bohemian Sunset Beach Cafes & Craft Beer Crawl',
      description: 'Relax with artisanal flat whites, sourdough brunches, and local microbrews right along the sandy shoreline.',
      category: 'INDOOR',
      timeSlot: '16:00 - 21:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  baler: [
    {
      title: 'Sabang Beach Pacific Surf Session',
      description: 'Ride long rolling Pacific sandy breaks suitable for both beginner paddlers and experienced surfers.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 11:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Dicasalarin_Cove_%28Baler%29.jpg/1280px-Dicasalarin_Cove_%28Baler%29.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Dicasalarin Cove & Clifftop Lighthouse Hike',
      description: 'Climb 170 steps to an isolated coastal lighthouse offering breathtaking views of deep blue Pacific waters.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 16:30',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Dicasalarin_Cove_%28Baler%29.jpg/1280px-Dicasalarin_Cove_%28Baler%29.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: '600-Year-Old Millennium Balete Tree Walk',
      description: 'Step inside the hollow trunk of Asia\'s largest ancient banyan tree shrouded in natural tropical roots.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 12:00',
      iconName: 'Sun',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Dicasalarin_Cove_%28Baler%29.jpg/1280px-Dicasalarin_Cove_%28Baler%29.jpg',
      minTemp: 20,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
  ],

  legazpi: [
    {
      title: 'Mayon Volcano ATV Black Lava Trail Adventure',
      description: 'Drive quad ATVs across rugged volcanic rocks, riverbeds, and gullies directly toward the base of Mount Mayon.',
      category: 'OUTDOOR',
      timeSlot: '07:30 - 11:30',
      iconName: 'Activity',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Cagsawa Ruins Historical Park & Bell Tower',
      description: 'Photograph the famous 1814 submerged church belfry with the perfect cone of Mayon rising behind it.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 12:00',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Sumlang Lake Bamboo Balsa Rafting',
      description: 'Cruise on tranquil freshwater balsa rafts framed by pink lotus blossoms and symmetrical volcano vistas.',
      category: 'OUTDOOR',
      timeSlot: '15:00 - 17:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
      minTemp: 22,
      maxTemp: 32,
      maxWind: 20,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Spicy Bicol Express & Sili Ice Cream Tasting',
      description: 'Test your tastebuds with rich coconut-chili Bicolano dishes and three spice levels of volcanic sili ice cream.',
      category: 'INDOOR',
      timeSlot: '11:30 - 15:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  davao: [
    {
      title: 'Philippine Eagle Center Forest Sanctuary',
      description: 'Encounter the majestic national bird of prey and native tropical wildlife in an 8-hectare secondary rainforest.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 12:00',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Eden Nature Park Highland Canopy Walk',
      description: 'Trek hanging cable bridges surrounded by cool highland pine trees, orchids, and organic flower gardens.',
      category: 'OUTDOOR',
      timeSlot: '09:00 - 14:00',
      iconName: 'Mountain',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
      minTemp: 20,
      maxTemp: 30,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Malagos Single-Origin Chocolate Tasting Tour',
      description: 'Experience tree-to-bar cocoa processing, learn artisanal chocolate making, and sample award-winning truffles.',
      category: 'INDOOR',
      timeSlot: '11:00 - 15:30',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  iloilo: [
    {
      title: 'Historic Calle Real & Spanish Plazas Walking Tour',
      description: 'Admire restored Art Deco and Spanish colonial architecture, heritage arcades, and the grand Plaza Libertad.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 11:30',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg/1280px-Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg',
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Iloilo River Esplanade Sunset Stroll',
      description: 'Walk or jog along the award-winning riverside promenade as golden hour reflects across calm waters.',
      category: 'OUTDOOR',
      timeSlot: '16:30 - 18:30',
      iconName: 'Sun',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg/1280px-Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Original La Paz Batchoy Public Market Crawl',
      description: 'Slurp steaming noodle soup topped with pork cracklings, beef loin, bone marrow, and savory broth.',
      category: 'INDOOR',
      timeSlot: '11:00 - 15:00',
      iconName: 'Sparkles',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg/1280px-Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg',
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm'],
    },
  ],

  siquijor: [
    {
      title: 'Cambugahay Falls Multi-Tier Tarzan Swing',
      description: 'Swing on jungle vines into crystal-clear turquoise freshwater lagoons surrounded by tropical trees.',
      category: 'OUTDOOR',
      timeSlot: '08:30 - 12:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg/1280px-Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg',
      minTemp: 22,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Salagdoong Beach Cliff Jump & Turquoise Cove',
      description: 'Leap from 20-foot and 35-foot diving platforms into sparkling open sea waters and relax on coastal rocks.',
      category: 'OUTDOOR',
      timeSlot: '13:00 - 16:30',
      iconName: 'Activity',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg/1280px-Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg',
      minTemp: 23,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: '400-Year-Old Enchanted Balete Tree & Fish Spa',
      description: 'Dip your feet into cool natural spring waters under a massive ancient banyan tree for an all-natural fish spa.',
      category: 'OUTDOOR',
      timeSlot: '10:00 - 13:00',
      iconName: 'Sun',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg/1280px-Cambugahay_Falls%2C_Lazi%2C_Siquijor.jpg',
      minTemp: 20,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
  ],

  camiguin: [
    {
      title: 'White Island Pristine Sandbar Sunrise Swim',
      description: 'Take a sunrise bangka boat to a glowing white sandbar surrounded by azure seas and views of Mount Hibok-Hibok.',
      category: 'OUTDOOR',
      timeSlot: '06:00 - 09:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg',
      minTemp: 22,
      maxTemp: 32,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Sunken Cemetery Historic Snorkeling Tour',
      description: 'Snorkel among giant clams and coral gardens growing over volcanic cemetery ruins marked by a giant sea cross.',
      category: 'OUTDOOR',
      timeSlot: '10:00 - 13:30',
      iconName: 'Compass',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg',
      minTemp: 23,
      maxTemp: 33,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: 'Katibawasan 76m Plunge Waterfall Trek',
      description: 'Swim in the icy plunge pool under a towering vertical ribbon waterfall framed by wild orchids and ferns.',
      category: 'OUTDOOR',
      timeSlot: '14:00 - 16:30',
      iconName: 'Droplets',
      imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg',
      minTemp: 20,
      maxTemp: 31,
      maxWind: 20,
      allowedConditions: ['Clear', 'Clouds'],
    },
  ],
};

// Aliases for matching city variations
DESTINATION_ACTIVITIES['metro manila'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['quezon city'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['makati'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['makati city'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['taguig'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['bgc'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['pasig'] = DESTINATION_ACTIVITIES.manila;
DESTINATION_ACTIVITIES['baguio city'] = DESTINATION_ACTIVITIES.baguio;
DESTINATION_ACTIVITIES['el nido'] = DESTINATION_ACTIVITIES.palawan;
DESTINATION_ACTIVITIES['coron'] = DESTINATION_ACTIVITIES.palawan;
DESTINATION_ACTIVITIES['cebu city'] = DESTINATION_ACTIVITIES.cebu;
DESTINATION_ACTIVITIES['davao city'] = DESTINATION_ACTIVITIES.davao;
DESTINATION_ACTIVITIES['iloilo city'] = DESTINATION_ACTIVITIES.iloilo;
DESTINATION_ACTIVITIES['vigan city'] = DESTINATION_ACTIVITIES.vigan;
DESTINATION_ACTIVITIES['elyu'] = DESTINATION_ACTIVITIES['la union'];
DESTINATION_ACTIVITIES['san juan'] = DESTINATION_ACTIVITIES['la union'];
DESTINATION_ACTIVITIES['legazpi city'] = DESTINATION_ACTIVITIES.legazpi;
DESTINATION_ACTIVITIES['camiguin island'] = DESTINATION_ACTIVITIES.camiguin;
DESTINATION_ACTIVITIES['siquijor island'] = DESTINATION_ACTIVITIES.siquijor;

// Destination authentic photography registry for generic / universal fallback
const DESTINATION_FALLBACK_IMAGES = {
  manila: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Cityscape_of_Manila%2C_2025_%2801%29.jpg/1280px-Cityscape_of_Manila%2C_2025_%2801%29.jpg',
  'metro manila': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Cityscape_of_Manila%2C_2025_%2801%29.jpg/1280px-Cityscape_of_Manila%2C_2025_%2801%29.jpg',
  'quezon city': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Quezon_Memorial_Circle%2C_Commonwealth_Avenue-Philcoa_NB_drone_%28Quezon_City%3B_03-03-2026%29.jpg/1280px-Quezon_Memorial_Circle%2C_Commonwealth_Avenue-Philcoa_NB_drone_%28Quezon_City%3B_03-03-2026%29.jpg',
  baguio: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg/1280px-Baguio_city_proper_overlooking_Burnham-Harrison_side_%28Baguio_city%3B_12-04-2022%29.jpg',
  boracay: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Boracay_White_Beach.png/1280px-Boracay_White_Beach.png',
  siargao: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Siargao_25.jpg/1280px-Siargao_25.jpg',
  palawan: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/El_Nido_Bay_December_2018.jpg/1280px-El_Nido_Bay_December_2018.jpg',
  'el nido': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/El_Nido_Bay_December_2018.jpg/1280px-El_Nido_Bay_December_2018.jpg',
  coron: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Coron_skyline_Tapyas_%28Coron%2C_Palwan%3B_03-16-2024%29.jpg/1280px-Coron_skyline_Tapyas_%28Coron%2C_Palwan%3B_03-16-2024%29.jpg',
  tagaytay: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg/1280px-Tagaytay_Highlands%2C_Philippines_%28lulaymb%29_3_-_Flickr.jpg',
  cebu: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Cebu_city_skyline_2025.jpg/1280px-Cebu_city_skyline_2025.jpg',
  bohol: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolate_Hills_Bohol_Philippines.jpg/1280px-Chocolate_Hills_Bohol_Philippines.jpg',
  batanes: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Sabtang_Batanes.jpg/1280px-Sabtang_Batanes.jpg',
  sagada: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg/1280px-Sagada_skyline_%28Sagada%2C_Mountain_Province%3B_12-01-2022%29.jpg',
  vigan: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg/1280px-Calle_Crisologo%2C_Vigan%2C_Ilocos_Sur%2C_Apr_2026_%282%29.jpg',
  'la union': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Surf%E2%80%99s_up.jpg/1280px-Surf%E2%80%99s_up.jpg',
  davao: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg/1280px-Davao_Poblacion_District_skyline_Bajada_%28Davao_City%3B_08-22-2023%29.jpg',
  iloilo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg/1280px-Iloilo_River%2C_Tabucan%2C_Mandurriao_drone_%28Iloilo_City%3B_01-24-2026%29.jpg',
  baler: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Dicasalarin_Cove_%28Baler%29.jpg/1280px-Dicasalarin_Cove_%28Baler%29.jpg',
  legazpi: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Legazpi_Port_District.jpg/1280px-Legazpi_Port_District.jpg',
  camiguin: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg/1280px-Timpoong_and_Hibok-Hibok_Natural_Monument_in_Camiguin_-_Allan_Jay_Quesada.jpg',
  makati: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Ayala_Avenue%2C_Makati_Avenue%2C_PSE_%28Makati%3B_01-31-2021%29.jpg/1280px-Ayala_Avenue%2C_Makati_Avenue%2C_PSE_%28Makati%3B_01-31-2021%29.jpg',
  taguig: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg/1280px-Bonifacio_Global_City%2C_South_Cembo%2C_Guadalupe_drone_%28Taguig_City%3B_12-31-2025%29.jpg',
  pasig: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/F._Ortigas_Jr._Road_%28Emerald_Avenue%29_from_north_part%2C_Ortigas_Center%2C_Apr_2025.jpg/1280px-F._Ortigas_Jr._Road_%28Emerald_Avenue%29_from_north_part%2C_Ortigas_Center%2C_Apr_2025.jpg',
  bacolod: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/San_Sebastian_Cathedral_Bacolod_%28Rizal_Street%2C_Bacolod%2C_Negros_Occidental%3B_10-31-2022%29.jpg/1280px-San_Sebastian_Cathedral_Bacolod_%28Rizal_Street%2C_Bacolod%2C_Negros_Occidental%3B_10-31-2022%29.jpg',
  'puerto princesa': 'https://thumb.wikimedia.org/wikipedia/en/thumb/0/01/Dos_Palmas_RP.JPG/1280px-Dos_Palmas_RP.JPG',
  angeles: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Angeles_Lourdes_Sur%2C_Mount_Arayat_drone_%28Angeles%2C_Pampanga%3B_02-15-2026%29.jpg/1280px-Angeles_Lourdes_Sur%2C_Mount_Arayat_drone_%28Angeles%2C_Pampanga%3B_02-15-2026%29.jpg',
  batangas: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Minor_Basilica_of_the_Immaculate_Conception_%28Batangas_City%29%2C_April_2023.jpg/1280px-Minor_Basilica_of_the_Immaculate_Conception_%28Batangas_City%29%2C_April_2023.jpg',
  antipolo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Antipolo_City_proper%2C_P._Oliveros%2C_cathedral_%28Antipolo%2C_Rizal%3B_02-06-2024%29.jpg/1280px-Antipolo_City_proper%2C_P._Oliveros%2C_cathedral_%28Antipolo%2C_Rizal%3B_02-06-2024%29.jpg',
  zamboanga: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Zamboanga_City_Hall_%26_Rizal_Park%2C_Mar_2026.jpg/1280px-Zamboanga_City_Hall_%26_Rizal_Park%2C_Mar_2026.jpg',
  'cagayan de oro': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/CDO_Poblacion%2C_CM_Recto_Avenue-A._Velez%2C_Misamis_Oriental_Provincial_Capitol_drone_%28Cagayan_De_Oro_City%3B_03-21-2026%29.jpg/1280px-CDO_Poblacion%2C_CM_Recto_Avenue-A._Velez%2C_Misamis_Oriental_Provincial_Capitol_drone_%28Cagayan_De_Oro_City%3B_03-21-2026%29.jpg',
  dumaguete: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Dumaguete_Belfry_park_view_%28Perdices_Street%2C_Dumaguete%2C_Negros_Oriental%3B_01-19-2023%29.jpg/1280px-Dumaguete_Belfry_park_view_%28Perdices_Street%2C_Dumaguete%2C_Negros_Oriental%3B_01-19-2023%29.jpg',
  
  // Global & Worldwide Cities
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1280&q=80',
  osaka: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1280&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1280&q=80',
  seoul: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1280&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1280&q=80',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1280&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1280&q=80',
  taipei: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1280&q=80',
  'hong kong': 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1280&q=80',
  'kuala lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1280&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1280&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1280&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1280&q=80',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1280&q=80',
  amsterdam: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1280&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1280&q=80',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1280&q=80',
  'los angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1280&q=80',
  honolulu: 'https://images.unsplash.com/photo-1545652985-5edd365b12eb?auto=format&fit=crop&w=1280&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1280&q=80',
  melbourne: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1280&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1280&q=80',
  
  // Additional Philippine Dest
  siquijor: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1280&q=80',
  mati: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1280&q=80',
  samal: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  bantayan: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1280&q=80',
  malapascua: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1280&q=80',
  caramoan: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1280&q=80',
  calaguas: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  catanduanes: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1280&q=80',
  romblon: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  gigantes: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  guimaras: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  zambales: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
  gensan: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1280&q=80',
  'lake sebu': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80',
  bukidnon: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80',
  hinatuan: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1280&q=80',
  iligan: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1280&q=80',
};

function getDestinationFallbackPhoto(city) {
  if (!city) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
  const c = city.toLowerCase().trim();
  
  // Direct match
  if (DESTINATION_FALLBACK_IMAGES[c]) return DESTINATION_FALLBACK_IMAGES[c];
  
  // Stripped match
  const stripped = c.replace(/\s*\([^)]*\)/g, '').split(',')[0].replace(/ city$/i, '').trim();
  if (DESTINATION_FALLBACK_IMAGES[stripped]) return DESTINATION_FALLBACK_IMAGES[stripped];

  const found = Object.keys(DESTINATION_FALLBACK_IMAGES).find(k => c.includes(k) || k.includes(c) || stripped.includes(k));
  if (found) return DESTINATION_FALLBACK_IMAGES[found];

  // Category fallback
  if (/beach|island|cove|sea|bay|coral|surf|coast|sand/i.test(c)) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
  }
  if (/mountain|peak|ridge|hill|forest|pine|highland/i.test(c)) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1280&q=80';
  }
  if (/city|metro|town|center|capital/i.test(c)) {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1280&q=80';
  }

  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1280&q=80';
}

/**
 * Universal fallback activities with verified photography for any other destination.
 */
function getGenericActivities(cityName = 'Destination') {
  const photo = getDestinationFallbackPhoto(cityName);
  return [
    {
      title: `Scenic Nature Trail & Hiking in ${cityName}`,
      description: `Explore local ridge trails, botanical paths, and scenic vistas with crisp outdoor visibility.`,
      category: 'OUTDOOR',
      timeSlot: '08:00 - 12:30',
      iconName: 'Compass',
      imageUrl: photo,
      minTemp: 15,
      maxTemp: 32,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: `Coastal & Waterside Recreation in ${cityName}`,
      description: `Enjoy swimming, kayaking, or paddleboarding along the scenic shores and local waterways.`,
      category: 'OUTDOOR',
      timeSlot: '09:00 - 13:00',
      iconName: 'Droplets',
      imageUrl: photo,
      minTemp: 22,
      maxTemp: 34,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: `Outdoor Cycling & City Sightseeing in ${cityName}`,
      description: `Pedal across town squares, waterfront promenades, and historic architecture.`,
      category: 'OUTDOOR',
      timeSlot: '14:00 - 17:30',
      iconName: 'Activity',
      imageUrl: photo,
      minTemp: 18,
      maxTemp: 33,
      maxWind: 30,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: `Open-Air Park Relaxation & Picnic in ${cityName}`,
      description: `Unwind on shaded grassy lawns, relax under canopy trees, and enjoy refreshments with friends.`,
      category: 'OUTDOOR',
      timeSlot: '11:00 - 15:00',
      iconName: 'Sun',
      imageUrl: photo,
      minTemp: 18,
      maxTemp: 32,
      maxWind: 25,
      allowedConditions: ['Clear', 'Clouds'],
    },
    {
      title: `Heritage Museum & Cultural Gallery in ${cityName}`,
      description: `Discover local art, historical artifacts, and regional storytelling in comfortable climate-controlled spaces.`,
      category: 'INDOOR',
      timeSlot: '10:00 - 16:30',
      iconName: 'Sparkles',
      imageUrl: photo,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
    {
      title: `Artisan Specialty Cafe & Local Cuisine in ${cityName}`,
      description: `Savor authentic regional gastronomy, specialty single-origin coffees, and freshly baked pastries.`,
      category: 'INDOOR',
      timeSlot: '13:00 - 18:00',
      iconName: 'Sparkles',
      imageUrl: photo,
      minTemp: 0,
      maxTemp: 45,
      maxWind: 100,
      allowedConditions: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist'],
    },
  ];
}

/**
 * Deterministic Rule-Based Activity Recommendation Engine.
 * Evaluates active recommendation rules against weather telemetry, user interests, and specific destination context.
 */
async function generateRecommendations({ weatherData, userInterestTagIds = [], destinationCity = '' }) {
  const currentTemp = weatherData?.temperature?.current || 20;
  const precip1h = weatherData?.telemetry?.rain1h || 0;
  const windSpeed = weatherData?.telemetry?.windSpeed || 10;
  const weatherCondition = weatherData?.weather?.main || 'Clear';

  const rawCity = destinationCity || weatherData?.location?.city || 'Manila';
  const cleanCity = rawCity.toLowerCase().trim();

  // Find destination matching list
  let candidateActivities = DESTINATION_ACTIVITIES[cleanCity];
  if (!candidateActivities) {
    const matchKey = Object.keys(DESTINATION_ACTIVITIES).find(
      (k) => cleanCity.includes(k) || k.includes(cleanCity)
    );
    candidateActivities = matchKey ? DESTINATION_ACTIVITIES[matchKey] : getGenericActivities(rawCity);
  }

  const evaluatedActivities = [];

  for (let idx = 0; idx < candidateActivities.length; idx++) {
    const item = candidateActivities[idx];
    const isOutdoor = item.category === 'OUTDOOR';
    const minTemp = item.minTemp;
    const maxTemp = item.maxTemp;
    const maxWind = item.maxWind;
    const allowedConditions = item.allowedConditions || [];

    // Condition checks
    const isConditionAllowed = allowedConditions.some(
      (c) => c.toLowerCase() === weatherCondition.toLowerCase() || weatherCondition.toLowerCase().includes(c.toLowerCase())
    );
    const isTempInRange = currentTemp >= minTemp && currentTemp <= maxTemp;
    const isWindSafe = windSpeed <= maxWind;
    const isPrecipSafe = isOutdoor ? precip1h <= 0.5 : true;

    let suitability = 'SUITABLE';
    let suitabilityScore = 80;
    const rationaleParts = [];
    const conditionTags = [];

    // Calculate score & status
    if (isOutdoor) {
      if (isTempInRange && isWindSafe && isPrecipSafe && isConditionAllowed) {
        suitability = 'OPTIMAL';
        suitabilityScore = 92;
        rationaleParts.push(`Crisp ${currentTemp}°C temperature, gentle ${windSpeed} km/h wind, and favorable ${weatherCondition} conditions offer ideal outdoor parameters for ${rawCity}.`);
      } else if (!isPrecipSafe || !isConditionAllowed) {
        suitability = 'CAUTION';
        suitabilityScore = 60;
        rationaleParts.push(`Weather condition (${weatherCondition}) or precipitation risk (${precip1h} mm/h) suggests keeping outdoor sessions brief in ${rawCity}.`);
      } else if (!isTempInRange || !isWindSafe) {
        suitability = 'CAUTION';
        suitabilityScore = 65;
        rationaleParts.push(`Current temperature (${currentTemp}°C) or wind velocity (${windSpeed} km/h) deviates from standard optimal comfort.`);
      }

      conditionTags.push(`Temp: ${currentTemp}°C`);
      conditionTags.push(`Wind: ${windSpeed} km/h`);
      if (precip1h > 0) conditionTags.push(`Precip: ${precip1h} mm/h`);
    } else {
      // Indoor activities
      if (!isPrecipSafe || !isConditionAllowed || currentTemp < 15 || currentTemp > 32) {
        suitability = 'INDOOR_ALT';
        suitabilityScore = 95;
        rationaleParts.push(`Ideal climate-controlled indoor refuge providing comfortable ambiance in ${rawCity} regardless of outdoor ${weatherCondition.toLowerCase()} conditions.`);
      } else {
        suitability = 'SUITABLE';
        suitabilityScore = 84;
        rationaleParts.push(`Comfortable leisure pursuit suitable for all daytime hours in ${rawCity}.`);
      }
      conditionTags.push('Climate Controlled');
      conditionTags.push('All-Weather Protected');
    }

    evaluatedActivities.push({
      id: `act-${cleanCity}-${idx}`,
      title: item.title,
      description: item.description,
      category: item.category,
      suitability,
      suitabilityScore: Math.min(100, suitabilityScore),
      rationale: rationaleParts.join(' '),
      timeSlot: item.timeSlot,
      conditions: conditionTags,
      iconName: item.iconName,
      imageUrl: item.imageUrl,
      destination: rawCity,
    });
  }

  // Sort: highest suitabilityScore first
  evaluatedActivities.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    evaluatedCount: evaluatedActivities.length,
    city: rawCity,
    recommendations: evaluatedActivities,
  };
}

module.exports = {
  generateRecommendations,
};
