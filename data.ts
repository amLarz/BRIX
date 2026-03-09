
import { Project, MaterialCategory } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'leyte-tide-protection',
    name: 'Leyte Tide Protection Wall',
    location: 'Tacloban City, Leyte',
    description: 'A multi-phase infrastructure project aimed at protecting the shoreline of Tacloban and Palo from storm surges similar to Typhoon Haiyan.',
    status: 'Developing Project',
    budget: 'PhP 150,000,000.00',
    deadline: '2026-12-30',
    createdAt: '2024-01-15T08:00:00Z',
    imageUrl: '/images/leyte_tide_protection_wall.png', // AI-generated: Leyte Tide Protection Wall
    upvotes: 342,
    downvotes: 89,
    materials: [
      { material: 'Portland Cement, 40kg', unit: 'Bag', price: 'PhP 259.00' },
      { material: 'Deformed Bar 12mm', unit: 'pc', price: 'PhP 310.00' },
      { material: 'Crushed Gravel', unit: 'Cubic Meter', price: 'PhP 1,150.00' },
      { material: 'Washed Sand', unit: 'Cubic Meter', price: 'PhP 950.00' },
    ],
    comments: [
      {
        id: 'c1',
        author: 'Engr. Santos',
        role: 'Citizen Auditor',
        text: 'The concrete pouring on Section 4 seems consistent with standards, but Section 3 has some visible honeycombing.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2024-03-10',
        upvotes: 45,
        downvotes: 2,
        replies: [
          {
            id: 'c1-r1',
            author: 'Site Supervisor',
            role: 'Contractor',
            text: 'We are aware of the honeycombing in Section 3. It was due to a minor vibrator failure. We will patch it tomorrow.',
            avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
            date: '2024-03-11',
            upvotes: 12,
            downvotes: 1,
            replies: []
          }
        ]
      },
      {
        id: 'c1-2',
        author: 'Maria De Leon',
        role: 'Local Resident',
        text: 'I passed by earlier today and took a photo of Section 3. The honeycombing is quite noticeable.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: '/images/leyte_tide_protection_wall.png',
        date: '2024-03-11',
        upvotes: 28,
        downvotes: 0,
        replies: []
      },
      {
        id: 'c1-3',
        author: 'LGU Representative',
        role: 'Government Official',
        text: 'Thank you for the report. The contractor has been notified and remedial works will commence tomorrow.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2024-03-12',
        upvotes: 15,
        downvotes: 3,
        replies: []
      }
    ]
  },
  {
    id: 'quezon-skyway-ext',
    name: 'Quezon Avenue Flyover Rehabilitation',
    location: 'Quezon City, Metro Manila',
    description: 'Structural reinforcement and asphalt overlay for the existing flyover to improve safety and traffic flow in one of Manila’s busiest corridors.',
    status: 'Finished Project',
    budget: 'PhP 85,500,000.00',
    deadline: '2025-01-15',
    finishDate: '01/15/25',
    createdAt: '2025-01-01T10:30:00Z',
    imageUrl: '/images/quezon_avenue_flyover.png', // AI-generated: Quezon Avenue Flyover Rehabilitation
    upvotes: 890,
    downvotes: 45,
    materials: [
      { material: 'Asphalt Premix', unit: 'Metric Ton', price: 'PhP 6,200.00' },
      { material: 'Paint Latex Gloss', unit: 'gal', price: 'PhP 640.20' },
      { material: 'LED Street Lamp', unit: 'Set', price: 'PhP 14,500.00' },
    ],
    comments: [
      {
        id: 'c2',
        author: 'Maria Clara',
        role: 'Commuter',
        text: 'The road is much smoother now! Hope the drainage issues were also fixed underneath.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: '/images/quezon_avenue_flyover.png',
        date: '2025-01-20',
        upvotes: 12,
        downvotes: 1,
        replies: []
      },
      {
        id: 'c2-2',
        author: 'Juan Dela Cruz',
        role: 'Taxi Driver',
        text: 'Yes! Less traffic buildup during rush hour. Here is how it looks right now from my dashcam.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: '/images/quezon_avenue_flyover.png',
        date: '2025-01-21',
        upvotes: 8,
        downvotes: 0,
        replies: []
      },
      {
        id: 'c2-3',
        author: 'DPWH Inspector',
        role: 'Project Manager',
        text: 'Drainage clearing was included in Phase 2 before the asphalt overlay. It should hold up well during the rainy season.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2025-01-22',
        upvotes: 34,
        downvotes: 2,
        replies: []
      }
    ]
  },
  {
    id: 'cclex-bridge-cebu',
    name: 'Cebu-Cordova Link Expressway',
    location: 'Cebu City, Cebu',
    description: 'An iconic toll bridge project connecting mainland Cebu to Mactan Island via Cordova, designed to withstand seismic activities and typhoons.',
    status: 'Finished Project',
    budget: 'PhP 30,000,000,000.00',
    deadline: '2022-04-27',
    finishDate: '04/27/22',
    createdAt: '2022-05-10T09:00:00Z',
    imageUrl: '/images/sabu_cordova_expressway.png', // AI-generated: Sabu Cordova Link Expressway (Cebu-Cordova)
    upvotes: 1250,
    downvotes: 12,
    materials: [
      { material: 'High-Tensile Steel Cable', unit: 'Linear Meter', price: 'PhP 8,400.00' },
      { material: 'Ready-Mix Concrete (High Strength)', unit: 'Cubic Meter', price: 'PhP 4,800.00' },
      { material: 'Anti-Corrosive Paint', unit: 'Drum', price: 'PhP 12,500.00' },
    ],
    comments: [
      {
        id: 'cclex-1',
        author: 'Cebuano Commuter',
        role: 'Citizen',
        text: 'The toll system has been acting up lately, causing delays. Anyone else experiencing this?',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2023-11-05',
        upvotes: 56,
        downvotes: 4,
        replies: []
      },
      {
        id: 'cclex-2',
        author: 'Engr. Bautista',
        role: 'Structural Inspector',
        text: 'The recent structural health monitoring report indicates normal tension on the high-tensile cables.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: '/images/sabu_cordova_expressway.png',
        date: '2023-11-10',
        upvotes: 120,
        downvotes: 1,
        replies: []
      },
      {
        id: 'cclex-3',
        author: 'Tourism Board',
        role: 'Official',
        text: 'It also looks beautiful at night! A huge boost for our local tourism.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2023-11-12',
        upvotes: 89,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'metro-manila-subway',
    name: 'Metro Manila Subway Phase 1',
    location: 'Valenzuela to Taguig, NCR',
    description: 'The "Project of the Century" in the Philippines, featuring underground stations and tunnel boring machine technology to ease urban congestion.',
    status: 'Developing Project',
    budget: 'PhP 350,000,000,000.00',
    deadline: '2028-12-30',
    createdAt: '2025-02-20T14:45:00Z',
    imageUrl: '/images/metro_manila_subway_phase1.png', // AI-generated: Metro Manila Subway Phase 1
    upvotes: 567,
    downvotes: 210,
    materials: [
      { material: 'Tunnel Segment Concrete', unit: 'Section', price: 'PhP 45,000.00' },
      { material: 'Rail Steel Grade R260', unit: 'Meter', price: 'PhP 2,800.00' },
      { material: 'Excavation Support Beams', unit: 'pc', price: 'PhP 18,200.00' },
    ],
    comments: [
      {
        id: 'sub-1',
        author: 'UrbanPlanner99',
        role: 'Citizen Auditor',
        text: 'The tunnel boring progress is slower than scheduled in the Valenzuela site. Need eyes on the procurement logs.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2025-03-01',
        upvotes: 42,
        downvotes: 3,
        replies: []
      },
      {
        id: 'sub-2',
        author: 'Site Engineer',
        role: 'Contractor',
        text: 'We experienced delays due to unexpected hard rock formations. The machinery has been recalibrated. Here is a view of the current excavation phase.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: '/images/metro_manila_subway_phase1.png',
        date: '2025-03-03',
        upvotes: 25,
        downvotes: 1,
        replies: []
      },
      {
        id: 'sub-3',
        author: 'Procurement Watch',
        role: 'Citizen NGO',
        text: 'Are the replacement cut-heads included in the original budget or will this require additional funding?',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2025-03-04',
        upvotes: 67,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'bicol-int-airport',
    name: 'Bicol International Airport Expansion',
    location: 'Daraga, Albay',
    description: 'Enhancement of the "Most Scenic Gateway" in the country, improving night-rating capabilities and passenger terminal capacity.',
    status: 'Developing Project',
    budget: 'PhP 4,800,000,000.00',
    deadline: '2025-11-20',
    createdAt: '2025-03-05T11:20:00Z',
    imageUrl: '/images/bicol_airport_expansion.png', // AI-generated: Modern airport terminal
    upvotes: 215,
    downvotes: 15,
    materials: [
      { material: 'Asphaltic Concrete', unit: 'Metric Ton', price: 'PhP 5,900.00' },
      { material: 'Glass Curtain Walls', unit: 'Sq Meter', price: 'PhP 3,400.00' },
      { material: 'Solar Panel Array (Commercial)', unit: 'Set', price: 'PhP 65,000.00' },
    ],
    comments: [
      {
        id: 'bia-1',
        author: 'Frequent Flyer',
        role: 'Traveler',
        text: 'Is the new terminal expansion going to include better lounge areas? The current setup gets too crowded.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2025-04-10',
        upvotes: 31,
        downvotes: 4,
        replies: []
      },
      {
        id: 'bia-2',
        author: 'Project Architect',
        role: 'Consultant',
        text: 'Yes! The new expansion includes a dedicated transit lounge and additional gates with glass curtain walls letting in natural light.',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=1200',
        date: '2025-04-12',
        upvotes: 52,
        downvotes: 2,
        replies: []
      },
      {
        id: 'bia-3',
        author: 'Local Vendor',
        role: 'Business Owner',
        text: 'Looking forward to this. Hopefully more space for local concessionaires to sell Bicol specialties!',
        avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z"/></svg>',
        date: '2025-04-15',
        upvotes: 45,
        downvotes: 0,
        replies: []
      }
    ]
  }
];

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'cement',
    name: 'CEMENT',
    icon: '🧱',
    items: [
      { name: 'Portland Cement, 40kg', unit: 'Bag', price: 'PhP 259.00', sourceUrl: 'https://civillead.com', sourceName: 'CivilLead 2026' },
      { name: 'Pozzolan Cement, 40kg', unit: 'Bag', price: 'PhP 261.00', sourceUrl: 'https://civiconcepts.com', sourceName: 'CiviConcepts' },
      { name: 'White Cement, 40kg', unit: 'Bag', price: 'PhP 750.00', sourceUrl: 'https://openpr.com', sourceName: 'OpenPR Asia' },
    ]
  },
  {
    id: 'hollow-blocks',
    name: 'HOLLOW BLOCKS',
    icon: '🏗️',
    items: [
      { name: 'Concrete Hollow Blocks (CHB) 4"', unit: 'pc', price: 'PhP 12.00' },
      { name: 'Concrete Hollow Blocks (CHB) 6"', unit: 'pc', price: 'PhP 18.00' },
      { name: 'Concrete Hollow Blocks (CHB) 8"', unit: 'pc', price: 'PhP 24.50' },
    ]
  },
  {
    id: 'plywoods',
    name: 'PLYWOODS',
    icon: '🪵',
    items: [
      { name: '1/4" x 4\' x 8\' Marine Plywood', unit: 'pc', price: 'PhP 435.00' },
      { name: '1/2" x 4\' x 8\' Marine Plywood', unit: 'pc', price: 'PhP 790.00' },
      { name: '1/4" x 4\' x 8\' Ordinary Plywood', unit: 'pc', price: 'PhP 381.00' },
      { name: '1/2" x 4\' x 8\' Ordinary Plywood', unit: 'pc', price: 'PhP 674.00' },
    ]
  },
  {
    id: 'paints',
    name: 'PAINTS',
    icon: '🎨',
    items: [
      { name: 'Paint Latex Gloss', unit: 'gal', price: 'PhP 640.20', sourceUrl: 'https://angi.com', sourceName: 'Angi 2026' },
      { name: 'Paint Red Lead', unit: 'gal', price: 'PhP 581.00', sourceUrl: 'https://aapkapainter.com', sourceName: 'AapkaPainter' },
      { name: 'Oil Paint', unit: 'Ltr', price: 'PhP 158.09', sourceUrl: 'https://paintcare.org', sourceName: 'PaintCare' },
      { name: 'Paint Tinting Color', unit: 'Ltr', price: 'PhP 182.00', sourceUrl: 'https://angi.com', sourceName: 'Angi' },
    ]
  },
  {
    id: 'steel',
    name: 'STEEL & METAL',
    icon: '🔩',
    items: [
      { name: 'Deformed Bar 10mm', unit: 'pc', price: 'PhP 215.00', sourceUrl: 'https://tradingeconomics.com', sourceName: 'TradingEconomics' },
      { name: 'Deformed Bar 12mm', unit: 'pc', price: 'PhP 310.00', sourceUrl: 'https://skanska.com', sourceName: 'Skanska Insights 2026' },
      { name: 'G.I. Pipe 1-1/2"', unit: 'pc', price: 'PhP 840.00', sourceUrl: 'https://gordian.com', sourceName: 'Gordian Prices' },
    ]
  }
];
