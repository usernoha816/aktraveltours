import { TourPackage } from '../types';

export const TOURS_DATA: TourPackage[] = [
  {
    id: 'japan-discovery-10d',
    title: 'Japan Grand Discovery: Tokyo, Mt. Fuji, Kyoto & Osaka',
    destination: 'Japan',
    countryCode: 'JP',
    flagEmoji: '🇯🇵',
    durationDays: 10,
    featuredImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 1890,
    rating: 4.95,
    reviewsCount: 148,
    includedEsimData: 'Free 10GB 5G NTT Docomo eSIM Included',
    highlights: [
      'Tokyo Shibuya Sky, Akihabara & Asakusa Senso-ji',
      'Mount Fuji panoramic 5th station & Lake Kawaguchiko',
      'Shinkansen bullet train ride at 320 km/h',
      'Kyoto Fushimi Inari 10,000 torii gates & Arashiyama Bamboo',
      'Osaka Dotonbori street food safari & Osaka Castle'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Tokyo & Shinjuku Neon Night Tour', description: 'Meet your AK TravelTours private concierge at Haneda/Narita. Instant automated eSIM setup.' },
      { day: 2, title: 'Historic & Modern Tokyo Highlights', description: 'Visit Asakusa Sensoji Temple, Tokyo Skytree, Shibuya crossing and Meiji Shrine.' },
      { day: 3, title: 'Akihabara Tech & TeamLab Borderless', description: 'Immersive digital art experience followed by high-end shopping in Ginza.' },
      { day: 4, title: 'Mount Fuji & Lake Kawaguchiko Onsen', description: 'Scenic drive to Mt. Fuji with traditional Japanese Kaiseki banquet and hot spring onsen.' },
      { day: 5, title: 'Shinkansen Bullet Train to Kyoto', description: 'Ride the Nozomi Bullet train. Afternoon walk through Gion Geisha district.' },
      { day: 6, title: 'Fushimi Inari & Golden Pavilion (Kinkaku-ji)', description: 'Morning hike through iconic vermilion torii gates and serene Zen gardens.' },
      { day: 7, title: 'Arashiyama Bamboo Grove & Monkey Park', description: 'Sagano Romantic Scenic Train and traditional green tea ceremony.' },
      { day: 8, title: 'Nara Deer Park & Transfer to Osaka', description: 'Feed friendly wild deer at Todaiji Temple, then dive into vibrant Osaka Dotonbori.' },
      { day: 9, title: 'Osaka Castle & Kuromon Culinary Safari', description: 'Tasting Kobe beef, takoyaki, and okonomiyaki with local foodie master.' },
      { day: 10, title: 'Souvenir Shopping & Kansai Departure', description: 'Private airport transfer with farewell gift package.' }
    ],
    includedServices: [
      '9 Nights in 4-Star & 5-Star Handpicked Hotels',
      'Shinkansen High-Speed Bullet Train Passes',
      'Daily Gourmet Breakfast & 5 Specialty Dinners',
      'All Entry Tickets & English-Speaking Tour Specialist',
      'Complimentary 10GB High-Speed 5G eSIM per traveler'
    ],
    groupSize: 'Max 12 Travelers (Small Group)',
    nextDeparture: 'Every Friday & Tuesday'
  },
  {
    id: 'europe-heritage-14d',
    title: 'Classic Europe Grand Tour: London, Paris, Swiss Alps & Rome',
    destination: 'Europe (UK, France, Switzerland, Italy)',
    countryCode: 'EU',
    flagEmoji: '🇪🇺',
    durationDays: 14,
    featuredImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 2950,
    rating: 4.98,
    reviewsCount: 210,
    includedEsimData: 'Free 20GB 5G Europe 35+ eSIM Included',
    highlights: [
      'London Tower Bridge, Westminster & Thames River Cruise',
      'Paris Eiffel Tower Summit & Private Louvre Masterpieces Tour',
      'Swiss Alps Jungfraujoch "Top of Europe" Glacier Excursion',
      'Venice Gondola Serenade on the Grand Canal',
      'Rome Colosseum Underground & Vatican Museums VIP Access'
    ],
    itinerary: [
      { day: 1, title: 'Welcome to London', description: 'Arrival and evening Thames river dinner cruise.' },
      { day: 2, title: 'Royalty & Landmarks of London', description: 'Buckingham Palace Changing of the Guard, Big Ben, and London Eye VIP capsule.' },
      { day: 3, title: 'Eurostar Under-Ocean Train to Paris', description: 'Arrive in Paris, sunset stroll along the Champs-Élysées.' },
      { day: 4, title: 'Eiffel Tower & Louvre Museum Tour', description: 'Skip-the-line summit tickets and guided Mona Lisa visit.' },
      { day: 5, title: 'Palace of Versailles & Montmartre', description: 'Hall of Mirrors and artistic evening in Montmartre with Sacré-Cœur views.' },
      { day: 6, title: 'TGV Train to Interlaken & Swiss Alps', description: 'Breathtaking ride into the snow-capped Swiss mountains.' },
      { day: 7, title: 'Jungfraujoch - Top of Europe Glacier', description: 'Ascend to 3,454m altitude, Ice Palace walk, and Swiss cheese fondue.' },
      { day: 8, title: 'Lucerne Lake Cruise & Chapel Bridge', description: 'Scenic boat across Lake Lucerne and chocolate-making workshop.' },
      { day: 9, title: 'Scenic EuroCity to Venice, Italy', description: 'Arrive by water taxi in magical Venice.' },
      { day: 10, title: 'Venice Gondola & St. Mark’s Basilica', description: 'Private gondola ride and Murano glass-blowing demonstration.' },
      { day: 11, title: 'Florence Renaissance Art & Tuscany', description: 'Michelangelo’s David, Florence Duomo, and Chianti wine tasting.' },
      { day: 12, title: 'High-Speed Train to Eternal City Rome', description: 'Trevi Fountain coin toss and Spanish Steps evening walk.' },
      { day: 13, title: 'Colosseum Underground & Vatican VIP', description: 'Gladiator arena access and Sistine Chapel private tour.' },
      { day: 14, title: 'Rome Fiumicino Farewell & Departure', description: 'Private luxury transfer to the airport.' }
    ],
    includedServices: [
      '13 Nights in Premium 4-Star Centrally Located Hotels',
      'Eurostar & High-Speed European Rail Passes (1st Class)',
      'All Sightseeing Permits, VIP Museum Entries & English Guides',
      'Daily European Breakfast Buffet & 7 Regional Dinners',
      'Free 20GB Europe 35-Country 5G Travel eSIM'
    ],
    groupSize: 'Max 14 Travelers',
    nextDeparture: '1st & 15th of Every Month'
  },
  {
    id: 'bali-escape-7d',
    title: 'Bali & Nusa Penida Tropical Paradise: Villas, Waterfalls & Reefs',
    destination: 'Bali, Indonesia',
    countryCode: 'ID',
    flagEmoji: '🇮🇩',
    durationDays: 7,
    featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 890,
    rating: 4.92,
    reviewsCount: 175,
    includedEsimData: 'Free 10GB 5G Telkomsel eSIM Included',
    highlights: [
      'Ubud private luxury pool villa stay nestled in jungle',
      'Nusa Penida Kelingking T-Rex cliff & Angel Billabong',
      'Snorkeling with wild Manta Rays in Crystal Bay',
      'Tegalalang Rice Terraces & Jungle Swing photography',
      'Uluwatu Sunset Temple & Fire Dance show'
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Denpasar & Ubud Luxury Villa Check-In', description: 'Traditional Balinese flower garland greeting and floating pool dinner.' },
      { day: 2, title: 'Ubud Sacred Monkey Forest & Jungle Swing', description: 'Explore ancient temple monkey sanctuary and thrilling jungle canyon swings.' },
      { day: 3, title: 'Mount Batur Sunrise Jeep & Natural Hot Springs', description: '4WD sunrise expedition over volcanic black lava fields.' },
      { day: 4, title: 'Speedboat to Nusa Penida Island', description: 'Iconic Kelingking Beach cliff view, Broken Beach, and Angel Billabong.' },
      { day: 5, title: 'Snorkeling with Giant Manta Rays', description: 'Marine safari in Manta Point and Crystal Bay coral reefs.' },
      { day: 6, title: 'Seminyak Beach Club & Uluwatu Kecak Dance', description: 'Sunset oceanfront cabana followed by cliffside cliff amphitheater show.' },
      { day: 7, title: 'Traditional Spa Massage & Bali Airport Drop', description: '2-hour Balinese herbal relaxation spa before departure.' }
    ],
    includedServices: [
      '6 Nights in 5-Star Private Pool Luxury Villas',
      'Private Chauffeur & Air-Conditioned Luxury Van',
      'Speedboat Transfers to Nusa Penida & Snorkeling Gear',
      'All Entry Tickets, Activities & Daily Breakfasts',
      'Free 10GB 5G Bali eSIM with zero registration hassle'
    ],
    groupSize: 'Private Group (2-8 Travelers)',
    nextDeparture: 'Daily Departures Available'
  },
  {
    id: 'dubai-luxury-7d',
    title: 'Dubai & Abu Dhabi Ultra-Luxury Explorer: Desert & Skylines',
    destination: 'United Arab Emirates',
    countryCode: 'AE',
    flagEmoji: '🇦🇪',
    durationDays: 7,
    featuredImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 1450,
    rating: 4.96,
    reviewsCount: 132,
    includedEsimData: 'Free 7-Day Unlimited 5G UAE eSIM Included',
    highlights: [
      'Burj Khalifa 148th Floor "At the Top SKY" VIP lounge',
      'Premium Desert 4x4 Dune Bashing, Camel Trek & BBQ Gala',
      'Private Luxury Yacht Cruise through Dubai Marina & Palm Jumeirah',
      'Abu Dhabi Sheikh Zayed Grand Mosque & Louvre Abu Dhabi',
      'Museum of the Future skip-the-line interactive experience'
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Dubai & Luxury Hotel Transfer', description: 'Airport pickup in Mercedes VIP fleet. Settle into 5-star Marina hotel.' },
      { day: 2, title: 'Modern Dubai & Burj Khalifa SKY', description: 'Dubai Mall, Dubai Fountain show, and highest observation deck access.' },
      { day: 3, title: 'Desert Safari & Bedouin Star-lit Banquet', description: 'Red dune bashing, sandboarding, falconry, and belly dance dinner.' },
      { day: 4, title: 'Palm Jumeirah & Private Yacht Sunset Cruise', description: 'Cruising past Atlantis The Royal and Burj Al Arab with champagne.' },
      { day: 5, title: 'Abu Dhabi Cultural Expedition', description: 'Sheikh Zayed Grand Mosque, Emirates Palace, and Louvre Abu Dhabi.' },
      { day: 6, title: 'Museum of the Future & Old Dubai Gold Souk', description: 'Futuristic AI exhibits followed by traditional abra boat across Dubai Creek.' },
      { day: 7, title: 'Luxury Shopping & VIP Airport Departure', description: 'Personal shopping assistant and airport drop.' }
    ],
    includedServices: [
      '6 Nights in 5-Star Luxury Ocean/Skyline View Hotel',
      'Burj Khalifa VIP SKY Tickets & Museum of the Future Access',
      'Private Yacht Cruise & VIP Desert Safari with Live Shows',
      'All Luxury Ground Transfers in Mercedes Fleet',
      'Free Unlimited 5G UAE eSIM with instant connection'
    ],
    groupSize: 'Small Group (Max 10)',
    nextDeparture: 'Every Wednesday & Saturday'
  },
  {
    id: 'us-west-coast-10d',
    title: 'USA West Coast & Grand Canyon: SF, LA, Vegas & Canyons',
    destination: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    durationDays: 10,
    featuredImage: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 2190,
    rating: 4.93,
    reviewsCount: 164,
    includedEsimData: 'Free 15GB 5G Ultra T-Mobile eSIM Included',
    highlights: [
      'San Francisco Golden Gate Bridge, Cable Cars & Alcatraz Island',
      'Pacific Coast Highway 1 scenic coastal drive through Big Sur',
      'Los Angeles Hollywood Walk of Fame, Beverly Hills & Santa Monica',
      'Las Vegas Strip helicopter night flight & Bellagio Fountain VIP',
      'Grand Canyon West Rim Skywalk glass bridge adventure'
    ],
    itinerary: [
      { day: 1, title: 'Arrive in San Francisco', description: 'Fisherman’s Wharf welcome dinner with clam chowder sourdough.' },
      { day: 2, title: 'Golden Gate Bridge & Alcatraz Island Tour', description: 'Historic ferry to Alcatraz and cable car ride down Lombard Street.' },
      { day: 3, title: 'Monterey, 17-Mile Drive & Big Sur Coast', description: 'One of the world’s most scenic coastal highway journeys.' },
      { day: 4, title: 'Arrive in Los Angeles - Hollywood & Beverly Hills', description: 'Stargazing on Hollywood Boulevard and luxury Rodeo Drive walk.' },
      { day: 5, title: 'Santa Monica Pier & Venice Beach Boardwalk', description: 'California sunshine, beachfront bikes, and sunset dining.' },
      { day: 6, title: 'Drive across Mojave Desert to Las Vegas', description: 'Arrive in the entertainment capital of the world on the Las Vegas Strip.' },
      { day: 7, title: 'Grand Canyon West Rim & Skywalk Glass Bridge', description: 'Marvel at 4,000 ft vertical canyon views and Native Hualapai culture.' },
      { day: 8, title: 'Las Vegas Strip Night Helicopter Flight & Show', description: 'Cirque du Soleil show and aerial helicopter flyover neon lights.' },
      { day: 9, title: 'Red Rock Canyon & Premium Outlet Shopping', description: 'Desert red sandstone formations followed by designer shopping.' },
      { day: 10, title: 'Las Vegas Harry Reid Airport Departure', description: 'Farewell transfer to airport.' }
    ],
    includedServices: [
      '9 Nights in Handpicked 4-Star & Resort Hotels',
      'Luxury Touring Motorcoach with Wi-Fi & Reclining Seats',
      'Grand Canyon Entry, Skywalk Pass & Alcatraz Tickets',
      'Las Vegas Strip Helicopter Flight Included',
      'Free 15GB 5G Ultra T-Mobile/AT&T eSIM'
    ],
    groupSize: 'Max 16 Travelers',
    nextDeparture: 'Every Monday'
  },
  {
    id: 'thailand-temples-10d',
    title: 'Thailand Highlights: Bangkok Temples, Chiang Mai & Phuket',
    destination: 'Thailand',
    countryCode: 'TH',
    flagEmoji: '🇹🇭',
    durationDays: 10,
    featuredImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    pricePerPersonUsd: 1120,
    rating: 4.97,
    reviewsCount: 189,
    includedEsimData: 'Free 10-Day Unlimited 5G AIS eSIM Included',
    highlights: [
      'Bangkok Grand Palace, Wat Pho Reclining Buddha & Chao Phraya river',
      'Chiang Mai Ethical Elephant Sanctuary & Doi Suthep mountain temple',
      'Phuket Phi Phi Islands luxury speedboat & Maya Bay snorkeling',
      'Authentic Thai cooking masterclass with organic farm harvest',
      'Floating markets & Damnoen Saduak canoe experience'
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Bangkok & Riverfront Welcome', description: 'Traditional Thai welcome and rooftop skyline dinner.' },
      { day: 2, title: 'Grand Palace & Emerald Buddha Tour', description: 'Marvel at gold leaf pagodas and historic royal architecture.' },
      { day: 3, title: 'Floating Markets & Railway Market Excursion', description: 'Witness trains passing inches from active market stalls.' },
      { day: 4, title: 'Fly to Chiang Mai & Night Bazaar', description: 'Arrive in northern cultural haven and explore bustling handicraft markets.' },
      { day: 5, title: 'Ethical Elephant Nature Park Experience', description: 'Feed, walk alongside, and bathe rescued gentle giants in the river.' },
      { day: 6, title: 'Doi Suthep Golden Mountain Temple', description: 'Panoramic mountain view over Chiang Mai valley.' },
      { day: 7, title: 'Fly to Phuket & Beachfront Resort', description: 'Andaman sea breeze, white sand beaches, and oceanfront dining.' },
      { day: 8, title: 'Phi Phi Islands & Maya Bay Speedboat Tour', description: 'Swim in turquoise lagoons made famous in "The Beach".' },
      { day: 9, title: 'Phang Nga Bay James Bond Island & Sea Kayak', description: 'Limestone karsts and hidden caves exploration.' },
      { day: 10, title: 'Phuket International Airport Departure', description: 'Farewell private airport transfer.' }
    ],
    includedServices: [
      '9 Nights in Luxury 4-Star & 5-Star Beachfront Hotels',
      '2 Domestic Flights (Bangkok -> Chiang Mai -> Phuket)',
      'Ethical Elephant Park & Phi Phi Speedboat Tickets',
      'Daily Breakfast & 6 Authentic Regional Dinners',
      'Free 10-Day Unlimited 5G AIS Travel eSIM'
    ],
    groupSize: 'Max 12 Travelers',
    nextDeparture: 'Every Thursday & Sunday'
  }
];
