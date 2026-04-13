// Mock data for PACAPP - Dominican Republic second-hand clothing marketplace

export interface Store {
  id: string
  name: string
  logo: string
  coverImage: string
  rating: number
  reviewCount: number
  location: string
  province: string
  address: string
  phone: string
  hours: string
  verified: boolean
  description: string
  productCount: number
  socialMedia: {
    instagram?: string
    facebook?: string
    whatsapp?: string
  }
}

export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  size: string
  condition: string
  gender: string
  brand?: string
  color?: string
  material?: string
  description: string
  storeId: string
  createdAt: string
}

export interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  storeId: string
}

export interface Message {
  id: string
  senderId: string
  senderType: 'buyer' | 'seller'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  storeId: string
  storeName: string
  storeAvatar: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

export interface Fardo {
  id: string
  storeId: string
  storeName: string
  type: string
  weight: string
  contentType: string
  price: number
  image: string
  description: string
}

export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  highlighted?: boolean
}

export const stores: Store[] = [
  {
    id: '1',
    name: 'Pacas La Bendición',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    location: 'Santo Domingo Este',
    province: 'Santo Domingo',
    address: 'Calle Las Américas #45, Los Mina',
    phone: '809-555-1234',
    hours: 'Lun-Sáb 8:00 AM - 6:00 PM',
    verified: true,
    description: 'Somos una tienda familiar con más de 15 años de experiencia en el negocio de pacas. Ofrecemos ropa de calidad americana y europea a precios accesibles.',
    productCount: 234,
    socialMedia: {
      instagram: '@pacaslabendicion',
      whatsapp: '809-555-1234'
    }
  },
  {
    id: '2',
    name: 'El Rincón de Mami',
    logo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 89,
    location: 'Santiago de los Caballeros',
    province: 'Santiago',
    address: 'Av. 27 de Febrero #123, Centro',
    phone: '809-555-5678',
    hours: 'Lun-Sáb 9:00 AM - 7:00 PM',
    verified: true,
    description: 'Especialistas en ropa de mujer y niños. Siempre con las últimas tendencias en moda de segunda mano.',
    productCount: 187,
    socialMedia: {
      instagram: '@rincondemami',
      facebook: 'El Rincón de Mami'
    }
  },
  {
    id: '3',
    name: 'Pacas Don Juan',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 203,
    location: 'La Vega',
    province: 'La Vega',
    address: 'Calle Duarte #78, Centro',
    phone: '809-555-9012',
    hours: 'Lun-Dom 8:00 AM - 8:00 PM',
    verified: true,
    description: 'El mejor surtido de ropa masculina en todo el Cibao. Jeans, camisas, zapatos y más.',
    productCount: 312,
    socialMedia: {
      instagram: '@pacasdonjuan',
      whatsapp: '809-555-9012'
    }
  },
  {
    id: '4',
    name: 'Boutique Segunda Vida',
    logo: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 124,
    location: 'Puerto Plata',
    province: 'Puerto Plata',
    address: 'Calle Beller #56, Centro',
    phone: '809-555-3456',
    hours: 'Mar-Sáb 10:00 AM - 6:00 PM',
    verified: true,
    description: 'Boutique especializada en ropa vintage y de diseñador. Piezas únicas para quienes buscan algo especial.',
    productCount: 98,
    socialMedia: {
      instagram: '@boutiquesegundavida'
    }
  },
  {
    id: '5',
    name: 'Ropa Bonita RD',
    logo: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 67,
    location: 'San Cristóbal',
    province: 'San Cristóbal',
    address: 'Av. Constitución #234, Villa Fundación',
    phone: '809-555-7890',
    hours: 'Lun-Vie 9:00 AM - 5:00 PM',
    verified: false,
    description: 'Variedad de ropa para toda la familia a los mejores precios del sur.',
    productCount: 156,
    socialMedia: {
      facebook: 'Ropa Bonita RD'
    }
  },
  {
    id: '6',
    name: 'Pacas El Cibao',
    logo: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=1200&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 45,
    location: 'Moca',
    province: 'Espaillat',
    address: 'Calle Duarte #12, Centro',
    phone: '809-555-2345',
    hours: 'Lun-Sáb 8:00 AM - 5:00 PM',
    verified: true,
    description: 'Importadores directos de pacas americanas. Venta al detal y al por mayor.',
    productCount: 278,
    socialMedia: {
      instagram: '@pacaselcibao',
      whatsapp: '809-555-2345'
    }
  }
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Blusa Floral Tommy Hilfiger',
    price: 350,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop'
    ],
    category: 'Blusas',
    size: 'M',
    condition: 'Excelente',
    gender: 'Mujer',
    brand: 'Tommy Hilfiger',
    color: 'Multicolor',
    material: 'Algodón',
    description: 'Blusa floral en excelente estado. Apenas usada, sin manchas ni roturas. Tela de algodón muy fresca.',
    storeId: '1',
    createdAt: '2026-04-07T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jeans Levi\'s 501 Original',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop'
    ],
    category: 'Pantalones',
    size: '32',
    condition: 'Muy bueno',
    gender: 'Hombre',
    brand: 'Levi\'s',
    color: 'Azul',
    material: 'Denim',
    description: 'Clásicos jeans 501 de Levi\'s. Corte recto, color azul medio. Algunas señales de uso pero muy bien conservados.',
    storeId: '3',
    createdAt: '2026-04-07T09:30:00Z'
  },
  {
    id: '3',
    name: 'Vestido de Noche Elegante',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'
    ],
    category: 'Vestidos',
    size: 'S',
    condition: 'Como nuevo',
    gender: 'Mujer',
    brand: 'Zara',
    color: 'Negro',
    material: 'Seda',
    description: 'Vestido de noche elegante, perfecto para ocasiones especiales. Usado una sola vez.',
    storeId: '4',
    createdAt: '2026-04-07T08:45:00Z'
  },
  {
    id: '4',
    name: 'Zapatos Nike Air Max',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop'
    ],
    category: 'Zapatos',
    size: '42',
    condition: 'Muy bueno',
    gender: 'Unisex',
    brand: 'Nike',
    color: 'Rojo/Blanco',
    material: 'Sintético',
    description: 'Nike Air Max en muy buen estado. Suela con buen agarre, sin roturas.',
    storeId: '1',
    createdAt: '2026-04-06T16:20:00Z'
  },
  {
    id: '5',
    name: 'Camiseta Polo Ralph Lauren',
    price: 280,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop'
    ],
    category: 'Camisas',
    size: 'L',
    condition: 'Excelente',
    gender: 'Hombre',
    brand: 'Ralph Lauren',
    color: 'Azul Marino',
    material: 'Algodón',
    description: 'Polo clásico de Ralph Lauren. Logo bordado original, sin decoloración.',
    storeId: '3',
    createdAt: '2026-04-06T14:10:00Z'
  },
  {
    id: '6',
    name: 'Falda Jean Vintage',
    price: 250,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop'
    ],
    category: 'Faldas',
    size: 'S',
    condition: 'Bueno',
    gender: 'Mujer',
    brand: 'Guess',
    color: 'Azul claro',
    material: 'Denim',
    description: 'Falda de jean vintage de los 90s. Estilo retro muy buscado.',
    storeId: '2',
    createdAt: '2026-04-06T11:30:00Z'
  },
  {
    id: '7',
    name: 'Conjunto Deportivo Adidas',
    price: 650,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'
    ],
    category: 'Deportiva',
    size: 'M',
    condition: 'Como nuevo',
    gender: 'Mujer',
    brand: 'Adidas',
    color: 'Negro/Blanco',
    material: 'Poliéster',
    description: 'Conjunto deportivo Adidas completo. Chaqueta y pantalón, muy poco uso.',
    storeId: '5',
    createdAt: '2026-04-05T18:00:00Z'
  },
  {
    id: '8',
    name: 'Chamarra de Cuero',
    price: 1500,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop'
    ],
    category: 'Chaquetas',
    size: 'L',
    condition: 'Muy bueno',
    gender: 'Hombre',
    brand: 'Wilson',
    color: 'Marrón',
    material: 'Cuero genuino',
    description: 'Chamarra de cuero genuino. Estilo clásico, muy bien conservada.',
    storeId: '4',
    createdAt: '2026-04-05T15:45:00Z'
  },
  {
    id: '9',
    name: 'Vestidito de Niña con Flores',
    price: 180,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop'
    ],
    category: 'Niños',
    size: '4T',
    condition: 'Excelente',
    gender: 'Niña',
    brand: 'Carter\'s',
    color: 'Rosa',
    material: 'Algodón',
    description: 'Vestidito precioso para niña. Ideal para fiestas o el día a día.',
    storeId: '2',
    createdAt: '2026-04-05T12:20:00Z'
  },
  {
    id: '10',
    name: 'Bolso Michael Kors',
    price: 950,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop'
    ],
    category: 'Accesorios',
    size: 'Único',
    condition: 'Como nuevo',
    gender: 'Mujer',
    brand: 'Michael Kors',
    color: 'Beige',
    material: 'Cuero sintético',
    description: 'Bolso Michael Kors auténtico. Muy poco uso, sin rayones ni manchas.',
    storeId: '4',
    createdAt: '2026-04-04T20:00:00Z'
  },
  {
    id: '11',
    name: 'Camisa de Cuadros Gap',
    price: 220,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'
    ],
    category: 'Camisas',
    size: 'M',
    condition: 'Bueno',
    gender: 'Hombre',
    brand: 'Gap',
    color: 'Azul/Rojo',
    material: 'Algodón',
    description: 'Camisa de cuadros estilo casual. Perfecta para el día a día.',
    storeId: '6',
    createdAt: '2026-04-04T17:30:00Z'
  },
  {
    id: '12',
    name: 'Shorts de Playa Quicksilver',
    price: 300,
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop'
    ],
    category: 'Shorts',
    size: 'L',
    condition: 'Excelente',
    gender: 'Hombre',
    brand: 'Quicksilver',
    color: 'Tropical',
    material: 'Poliéster',
    description: 'Shorts de playa con estampado tropical. Secado rápido, perfectos para la playa.',
    storeId: '1',
    createdAt: '2026-04-04T14:15:00Z'
  }
]

export const reviews: Review[] = [
  {
    id: '1',
    userName: 'María Rodríguez',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
    rating: 5,
    comment: 'Excelente tienda, muy buena atención. La ropa está en muy buen estado y los precios son justos. Volveré pronto.',
    date: '2026-04-01',
    storeId: '1'
  },
  {
    id: '2',
    userName: 'José Martínez',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
    rating: 4,
    comment: 'Buena variedad de productos. El local es pequeño pero tienen de todo. Recomendado.',
    date: '2026-03-28',
    storeId: '1'
  },
  {
    id: '3',
    userName: 'Ana Pérez',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    rating: 5,
    comment: 'La mejor tienda de pacas del área. Siempre encuentro piezas únicas aquí. La dueña es muy amable.',
    date: '2026-03-25',
    storeId: '1'
  },
  {
    id: '4',
    userName: 'Carlos Gómez',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
    rating: 5,
    comment: 'Encontré unos jeans Levi\'s originales a un precio increíble. Muy contento con mi compra.',
    date: '2026-03-20',
    storeId: '3'
  },
  {
    id: '5',
    userName: 'Laura Sánchez',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop',
    rating: 4,
    comment: 'Buena tienda, aunque a veces hay que buscar bastante para encontrar algo bueno. Vale la pena.',
    date: '2026-03-18',
    storeId: '2'
  },
  {
    id: '6',
    userName: 'Pedro Núñez',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    rating: 5,
    comment: 'Compré ropa para toda la familia y todo en perfecto estado. Muy buenos precios.',
    date: '2026-03-15',
    storeId: '5'
  }
]

export const conversations: Conversation[] = [
  {
    id: '1',
    storeId: '1',
    storeName: 'Pacas La Bendición',
    storeAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    productId: '1',
    productName: 'Blusa Floral Tommy Hilfiger',
    productImage: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=100&h=100&fit=crop',
    productPrice: 350,
    lastMessage: 'Sí, todavía está disponible. ¿Cuándo puedes pasar?',
    lastMessageTime: 'Hace 5 min',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        senderId: 'buyer',
        senderType: 'buyer',
        content: 'Hola, ¿todavía tienes disponible la blusa Tommy Hilfiger?',
        timestamp: '2026-04-08T10:30:00Z'
      },
      {
        id: '2',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Hola! Sí, todavía la tenemos. Está en excelente estado.',
        timestamp: '2026-04-08T10:32:00Z'
      },
      {
        id: '3',
        senderId: 'buyer',
        senderType: 'buyer',
        content: '¿Podrías enviarme más fotos? Me interesa verla de cerca.',
        timestamp: '2026-04-08T10:35:00Z'
      },
      {
        id: '4',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Claro, déjame tomarlas y te las envío en un momento.',
        timestamp: '2026-04-08T10:36:00Z'
      },
      {
        id: '5',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Sí, todavía está disponible. ¿Cuándo puedes pasar?',
        timestamp: '2026-04-08T10:40:00Z'
      }
    ]
  },
  {
    id: '2',
    storeId: '3',
    storeName: 'Pacas Don Juan',
    storeAvatar: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop',
    productId: '2',
    productName: 'Jeans Levi\'s 501 Original',
    productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
    productPrice: 450,
    lastMessage: 'Perfecto, te espero mañana entonces.',
    lastMessageTime: 'Hace 2 horas',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        senderId: 'buyer',
        senderType: 'buyer',
        content: 'Buenos días, me interesan los jeans Levi\'s. ¿Qué medidas tienen?',
        timestamp: '2026-04-08T08:00:00Z'
      },
      {
        id: '2',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Buenos días! Son talla 32, cintura 81cm, largo 102cm.',
        timestamp: '2026-04-08T08:15:00Z'
      },
      {
        id: '3',
        senderId: 'buyer',
        senderType: 'buyer',
        content: 'Perfecto, me quedan. ¿Puedo pasar mañana por la tarde?',
        timestamp: '2026-04-08T08:20:00Z'
      },
      {
        id: '4',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Perfecto, te espero mañana entonces.',
        timestamp: '2026-04-08T08:25:00Z'
      }
    ]
  },
  {
    id: '3',
    storeId: '4',
    storeName: 'Boutique Segunda Vida',
    storeAvatar: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=100&h=100&fit=crop',
    productId: '3',
    productName: 'Vestido de Noche Elegante',
    productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
    productPrice: 800,
    lastMessage: 'Gracias por tu interés, te mantengo informada.',
    lastMessageTime: 'Ayer',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        senderId: 'buyer',
        senderType: 'buyer',
        content: 'Hola, ¿tienen este vestido en talla M?',
        timestamp: '2026-04-07T15:00:00Z'
      },
      {
        id: '2',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Hola! Solo tenemos en S por el momento, pero puede que llegue más mercancía esta semana.',
        timestamp: '2026-04-07T15:30:00Z'
      },
      {
        id: '3',
        senderId: 'buyer',
        senderType: 'buyer',
        content: 'Entiendo, ¿me podrías avisar si llega en M?',
        timestamp: '2026-04-07T15:35:00Z'
      },
      {
        id: '4',
        senderId: 'seller',
        senderType: 'seller',
        content: 'Gracias por tu interés, te mantengo informada.',
        timestamp: '2026-04-07T15:40:00Z'
      }
    ]
  }
]

export const fardos: Fardo[] = [
  {
    id: '1',
    storeId: '6',
    storeName: 'Pacas El Cibao',
    type: 'Ropa de Mujer',
    weight: '45 kg',
    contentType: 'Mixta (blusas, pantalones, vestidos)',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
    description: 'Fardo de ropa de mujer importada de USA. Incluye variedad de prendas de temporada.'
  },
  {
    id: '2',
    storeId: '6',
    storeName: 'Pacas El Cibao',
    type: 'Ropa de Hombre',
    weight: '50 kg',
    contentType: 'Mixta (camisas, jeans, shorts)',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop',
    description: 'Fardo de ropa masculina de marcas americanas. Excelente para reventa.'
  },
  {
    id: '3',
    storeId: '1',
    storeName: 'Pacas La Bendición',
    type: 'Ropa de Niños',
    weight: '30 kg',
    contentType: 'Mixta (todas las edades)',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=400&fit=crop',
    description: 'Fardo de ropa infantil en excelente estado. Desde bebés hasta adolescentes.'
  },
  {
    id: '4',
    storeId: '3',
    storeName: 'Pacas Don Juan',
    type: 'Zapatos',
    weight: '40 kg',
    contentType: 'Mixta (deportivos, casuales, formales)',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
    description: 'Fardo de zapatos de marcas reconocidas. Incluye Nike, Adidas, Vans y más.'
  },
  {
    id: '5',
    storeId: '6',
    storeName: 'Pacas El Cibao',
    type: 'Premium',
    weight: '35 kg',
    contentType: 'Ropa de marca seleccionada',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop',
    description: 'Fardo premium con prendas seleccionadas de marcas como Tommy, Ralph Lauren, Gap.'
  },
  {
    id: '6',
    storeId: '1',
    storeName: 'Pacas La Bendición',
    type: 'Accesorios',
    weight: '20 kg',
    contentType: 'Bolsos, cinturones, gorras',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
    description: 'Fardo de accesorios variados. Ideal para complementar tu inventario.'
  }
]

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    features: [
      'Hasta 20 productos',
      'Perfil básico de tienda',
      'Chat con compradores',
      'Soporte por email'
    ]
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 500,
    features: [
      'Hasta 100 productos',
      'Perfil verificado',
      '5 productos destacados',
      'Estadísticas básicas',
      'Soporte prioritario'
    ],
    highlighted: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1500,
    features: [
      'Productos ilimitados',
      'Perfil verificado premium',
      '20 productos destacados',
      'Acceso a sección mayoreo',
      'Estadísticas avanzadas',
      'Soporte dedicado 24/7'
    ]
  }
]

export const categories = [
  'Blusas',
  'Pantalones',
  'Vestidos',
  'Zapatos',
  'Niños',
  'Accesorios',
  'Camisas',
  'Faldas',
  'Chaquetas',
  'Deportiva',
  'Shorts'
]

export const conditions = [
  'Como nuevo',
  'Excelente',
  'Muy bueno',
  'Bueno',
  'Aceptable'
]

export const sizes = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  pants: ['28', '30', '32', '34', '36', '38', '40'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  kids: ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14']
}

export const genders = ['Mujer', 'Hombre', 'Unisex', 'Niña', 'Niño']

export const provinces = [
  'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional',
  'Duarte', 'El Seibo', 'Elías Piña', 'Espaillat', 'Hato Mayor',
  'Hermanas Mirabal', 'Independencia', 'La Altagracia', 'La Romana',
  'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi',
  'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná',
  'San Cristóbal', 'San José de Ocoa', 'San Juan', 'San Pedro de Macorís',
  'Sánchez Ramírez', 'Santiago', 'Santiago Rodríguez', 'Santo Domingo',
  'Valverde'
]

// Helper functions
export function getStore(id: string): Store | undefined {
  return stores.find(store => store.id === id)
}

export function getProduct(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getProductsByStore(storeId: string): Product[] {
  return products.filter(product => product.storeId === storeId)
}

export function getReviewsByStore(storeId: string): Review[] {
  return reviews.filter(review => review.storeId === storeId)
}

export function formatPrice(price: number): string {
  return `RD$${price.toLocaleString('es-DO')}`
}
