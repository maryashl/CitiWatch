import { User, ServiceRequest } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-citizen-1',
    name: 'Ashley Anyango',
    email: 'ashleyanyango36@gmail.com',
    phone: '+254 712 345 678',
    nationalId: '32894102',
    password: 'citizen123',
    ward: 'Kilimani / Kileleshwa',
    role: 'citizen',
    joinedDate: '2026-09-12'
  },
  {
    id: 'user-citizen-2',
    name: 'David Ochieng',
    email: 'david.ochieng@gmail.com',
    phone: '+254 722 987 654',
    nationalId: '29841054',
    password: 'citizen123',
    ward: 'Central Business District (CBD)',
    role: 'citizen',
    joinedDate: '2026-09-25'
  },
  {
    id: 'user-admin-1',
    name: 'Eng. Beatrice Kimani',
    email: 'admin@ecitizen.gov.ke',
    phone: '+254 700 112 233',
    nationalId: '21054890',
    password: 'admin123',
    role: 'admin',
    department: 'Directorate of Municipal Response & Citizen Care',
    joinedDate: '2024-01-15'
  }
];

export const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-2026-1042',
    citizenId: 'user-citizen-1',
    citizenName: 'Ashley Anyango',
    citizenEmail: 'ashleyanyango36@gmail.com',
    citizenPhone: '+254 712 345 678',
    category: 'water',
    title: 'Burst clean water main flooding roadway and pedestrian path',
    description: 'A pressurized underground main line burst early this morning near the roundabout. Clean treated water is gushing across the road, creating deep erosion and low pressure for over 200 surrounding households.',
    location: {
      address: 'Junction of Argwings Kodhek Rd & Marcus Garvey Way',
      wardOrZone: 'Kilimani / Kileleshwa',
      landmark: 'Opposite Yaya Center secondary gate',
      lat: -1.2921,
      lng: 36.7854
    },
    priority: 'urgent',
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-18T06:30:00Z',
    updatedAt: '2026-10-18T10:15:00Z',
    estimatedResolutionDate: '2026-10-20T18:00:00Z',
    assignedOfficer: 'Officer Peter Maina',
    assignedDepartment: 'Municipal Water & Sewerage Company',
    internalNotes: 'Emergency excavation crew dispatched with 6-inch replacement ductile sleeve. Valves 4A and 4B temporarily isolated.',
    timeline: [
      {
        id: 't-1',
        status: 'pending',
        title: 'Request Lodged by Citizen',
        description: 'Citizen submitted report with geocoded location and priority photo.',
        timestamp: '2026-10-18T06:30:00Z',
        actor: 'Ashley Anyango',
        actorRole: 'citizen'
      },
      {
        id: 't-2',
        status: 'in_progress',
        title: 'Triaged & Assigned to Rapid Response Team',
        description: 'Triage officer verified severity as Urgent. Dispatched Officer Peter Maina and crew #4.',
        timestamp: '2026-10-18T10:15:00Z',
        actor: 'Eng. Beatrice Kimani',
        actorRole: 'admin'
      }
    ]
  },
  {
    id: 'REQ-2026-1043',
    citizenId: 'user-citizen-2',
    citizenName: 'David Ochieng',
    citizenEmail: 'david.ochieng@gmail.com',
    citizenPhone: '+254 722 987 654',
    category: 'streetlights',
    title: 'Faulty high-mast streetlights causing total darkness on public walkway',
    description: 'Three consecutive solar street lighting poles have been unlit for 5 days following the thunderstorm. The dark corridor poses a severe safety hazard for commuters walking from the bus stop.',
    location: {
      address: 'Mombasa Road Pedestrian Overpass, Near Nyayo Stadium',
      wardOrZone: 'Central Business District (CBD)',
      landmark: 'Near gate B pedestrian ramp',
      lat: -1.3069,
      lng: 36.8262
    },
    priority: 'high',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-19T08:15:00Z',
    updatedAt: '2026-10-19T08:15:00Z',
    estimatedResolutionDate: '2026-10-21T17:00:00Z',
    assignedDepartment: 'Directorate of Public Works & Energy',
    timeline: [
      {
        id: 't-3',
        status: 'pending',
        title: 'Service Ticket Created',
        description: 'Queued in Public Works ticketing pool. Awaiting electrical engineer allocation.',
        timestamp: '2026-10-19T08:15:00Z',
        actor: 'David Ochieng',
        actorRole: 'citizen'
      }
    ]
  },
  {
    id: 'REQ-2026-1044',
    citizenId: 'user-citizen-1',
    citizenName: 'Ashley Anyango',
    citizenEmail: 'ashleyanyango36@gmail.com',
    citizenPhone: '+254 712 345 678',
    category: 'garbage',
    title: 'Overflowing municipal skip bin attracting vermin outside market',
    description: 'Weekly compaction truck did not arrive on Friday. Organic waste is overflowing into the drainage trench and emitting a foul smell near fresh food market vendors.',
    location: {
      address: 'Sarit Center Back Alley Service Lane',
      wardOrZone: 'Westlands / Parklands',
      landmark: 'Corner of Karuna Road and School Lane',
      lat: -1.2612,
      lng: 36.8045
    },
    priority: 'medium',
    status: 'resolved',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-16T14:40:00Z',
    resolvedAt: '2026-10-16T14:40:00Z',
    assignedOfficer: 'Supervisor Moses Wekesa',
    assignedDepartment: 'Department of Environment & Waste Management',
    internalNotes: 'Heavy compactor truck KDH-491 dispatched. Cleared 4.5 metric tons.',
    resolutionNotes: 'Municipal solid waste compactors cleared the full skip and disinfected the surrounding pavement with lime treatment.',
    resolutionImageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    timeline: [
      {
        id: 't-4',
        status: 'pending',
        title: 'Report Logged',
        description: 'Citizen submitted complaint with photo evidence.',
        timestamp: '2026-10-15T09:00:00Z',
        actor: 'Ashley Anyango',
        actorRole: 'citizen'
      },
      {
        id: 't-5',
        status: 'in_progress',
        title: 'Compactor Crew Routed',
        description: 'Assigned to Sector 3 daily collection schedule with Supervisor Moses Wekesa.',
        timestamp: '2026-10-15T13:20:00Z',
        actor: 'Eng. Beatrice Kimani',
        actorRole: 'admin'
      },
      {
        id: 't-6',
        status: 'resolved',
        title: 'Waste Evacuated & Area Sanitized',
        description: 'Site cleared completely. Disinfection completed successfully.',
        timestamp: '2026-10-16T14:40:00Z',
        actor: 'Supervisor Moses Wekesa',
        actorRole: 'admin'
      }
    ],
    feedback: {
      rating: 5,
      comment: 'Super fast response! The area was cleared and washed down within 24 hours. Commendable work by the county team.',
      submittedAt: '2026-10-16T16:10:00Z'
    }
  },
  {
    id: 'REQ-2026-1045',
    citizenId: 'user-citizen-2',
    citizenName: 'David Ochieng',
    citizenEmail: 'david.ochieng@gmail.com',
    citizenPhone: '+254 722 987 654',
    category: 'roads',
    title: 'Deep crater pothole puncturing tires at highway offramp',
    description: 'Submerged pothole measuring over 20cm deep near the bridge expansion joint. At least three vehicles had tire blowouts in the rain yesterday.',
    location: {
      address: 'Langata Road offramp toward Mbagathi Way roundabout',
      wardOrZone: 'Langata / Karen',
      landmark: '50m after Wilson Airport exit',
      lat: -1.3211,
      lng: 36.8142
    },
    priority: 'high',
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-17T11:00:00Z',
    updatedAt: '2026-10-18T09:00:00Z',
    estimatedResolutionDate: '2026-10-21T12:00:00Z',
    assignedOfficer: 'Eng. Kevin Otieno',
    assignedDepartment: 'Urban Roads & Infrastructure Authority',
    internalNotes: 'Cold asphalt asphalt patch temporary fill applied; hot asphalt permanent milling scheduled for tonight 11 PM.',
    timeline: [
      {
        id: 't-7',
        status: 'pending',
        title: 'Hazard Reported',
        description: 'Ticket received and logged by road safety desk.',
        timestamp: '2026-10-17T11:00:00Z',
        actor: 'David Ochieng',
        actorRole: 'citizen'
      },
      {
        id: 't-8',
        status: 'in_progress',
        title: 'Emergency Signs Placed & Repair Scheduled',
        description: 'Road signs placed to divert high speed traffic away from the pothole.',
        timestamp: '2026-10-18T09:00:00Z',
        actor: 'Eng. Kevin Otieno',
        actorRole: 'admin'
      }
    ]
  },
  {
    id: 'REQ-2026-1046',
    citizenId: 'user-citizen-1',
    citizenName: 'Ashley Anyango',
    citizenEmail: 'ashleyanyango36@gmail.com',
    citizenPhone: '+254 712 345 678',
    category: 'parks',
    title: 'Large fallen acacia tree branch blocking pedestrian fitness track',
    description: 'Heavy winds split a mature acacia branch which now blocks the jogging path in the park. Need chainsaw team to clear the timber safely.',
    location: {
      address: 'City Park Jogging Circuit, Eastern Gate Entry',
      wardOrZone: 'Westlands / Parklands',
      landmark: 'Next to the bird sanctuary observation deck',
      lat: -1.2654,
      lng: 36.8228
    },
    priority: 'medium',
    status: 'resolved',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-14T14:20:00Z',
    updatedAt: '2026-10-15T11:30:00Z',
    resolvedAt: '2026-10-15T11:30:00Z',
    assignedOfficer: 'Forester Jane Njeri',
    assignedDepartment: 'Department of Parks, Recreation & Green Spaces',
    resolutionNotes: 'Parks arborists cut and removed the branch. Timber chipped for mulch and path reopened for public use.',
    timeline: [
      {
        id: 't-9',
        status: 'pending',
        title: 'Obstruction Reported',
        description: 'Citizen lodged report regarding blocked fitness track.',
        timestamp: '2026-10-14T14:20:00Z',
        actor: 'Ashley Anyango',
        actorRole: 'citizen'
      },
      {
        id: 't-10',
        status: 'in_progress',
        title: 'Arborist Team Dispatched',
        description: 'Crew #2 deployed with power chainsaws and woodchipper.',
        timestamp: '2026-10-15T08:00:00Z',
        actor: 'Forester Jane Njeri',
        actorRole: 'admin'
      },
      {
        id: 't-11',
        status: 'resolved',
        title: 'Path Restored & Inspected',
        description: 'Debris completely cleared. Track inspected and declared safe.',
        timestamp: '2026-10-15T11:30:00Z',
        actor: 'Forester Jane Njeri',
        actorRole: 'admin'
      }
    ],
    feedback: {
      rating: 4,
      comment: 'Very pleased with the fast turnaround. Track was cleared by the time I went for my evening jog.',
      submittedAt: '2026-10-15T18:00:00Z'
    }
  },
  {
    id: 'REQ-2026-1047',
    citizenId: 'user-citizen-2',
    citizenName: 'David Ochieng',
    citizenEmail: 'david.ochieng@gmail.com',
    citizenPhone: '+254 722 987 654',
    category: 'health',
    title: 'Stagnant wastewater pooling behind commercial butcheries',
    description: 'Untreated greywater pooling in open earthen ditch creating strong stench and breeding swarms of flies and mosquitoes.',
    location: {
      address: '1st Avenue, Eastleigh Section 3',
      wardOrZone: 'Eastleigh / Kamukunji',
      landmark: 'Behind Al-Barakah Shopping Complex',
      lat: -1.2789,
      lng: 36.8512
    },
    priority: 'high',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-19T11:45:00Z',
    updatedAt: '2026-10-19T11:45:00Z',
    assignedDepartment: 'Directorate of Public Health & Sanitation',
    timeline: [
      {
        id: 't-12',
        status: 'pending',
        title: 'Health Inspection Requested',
        description: 'Queued for public health officer sanitary inspection.',
        timestamp: '2026-10-19T11:45:00Z',
        actor: 'David Ochieng',
        actorRole: 'citizen'
      }
    ]
  }
];
