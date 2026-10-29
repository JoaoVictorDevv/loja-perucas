import { Product } from '../types/product';
import { Coupon } from '../types/cart';

export const STORE_CONFIG = {
  nome: 'AURORA Hair Atelier',
  subtitulo: 'Haute Perruquerie · Cabelo 100% Humano',
  whatsapp: '5511999998888', // WhatsApp comercial
  whatsappFormatado: '(11) 99999-8888',
  instagram: 'aurora.hairatelier',
  email: 'concierge@aurorahair.com.br',
  descontoPix: 0.05, // 5% de desconto no Pix
  parcelasSemJuros: 10,
  politicaTrocaDias: 7,
  garantiaMeses: 3,
  origemCabelo: 'Cabelo Humano Brasileiro do Sul e Eslavo Selecionado',
};

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'AURORA10',
    discountPercentage: 10,
    minOrderValue: 2000,
    description: '10% de desconto em compras acima de R$ 2.000',
  },
  {
    code: 'BEMVINDA5',
    discountPercentage: 5,
    description: '5% de desconto para sua primeira experiência',
  },
  {
    code: 'VIPATELIER',
    discountPercentage: 15,
    minOrderValue: 4000,
    description: '15% exclusivo para clientes VIP Atelier',
  },
];

export function getUnsplashUrl(photoId: string, width = 900): string {
  if (photoId.startsWith('http')) return photoId;
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=85`;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'lisa-castanho',
    nome: 'Lisa Castanho Natural Velvet',
    textura: 'lisa',
    cor: 'Castanho escuro virgem (tom 3.0)',
    comprimento: '65 cm',
    comprimentoCm: 65,
    touca: 'Lace frontal 13x4',
    densidade: '150%',
    preco: 3890,
    fotos: [
      '1668505543198-4fb0b42808bc',
      '1730740505665-511513481bce',
      '1663582815426-3d31dbf17faf'
    ],
    descricao: 'Fios nobres de caimento sedoso com corte reto e pontas encorpadas. A tela HD 13x4 funde-se de modo imperceptível com qualquer tom de pele, permitindo repartição livre de orelha a orelha.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Brasileiro Virgem',
      tipo: 'Fios 100% humanos selecionados fio a fio',
      cuticulas: 'Intactas e alinhadas no mesmo sentido (Remy Hair)',
      reparticao: 'Livre de orelha a orelha (13x4 polegadas)',
      penteadosPermitidos: ['Rabo baixo', 'Meio-preso', 'Coque frouxo', 'Franja lateral'],
      resistenciaCalor: 'Suporta prancha e modelador até 210°C',
    },
    destaque: true,
    badge: 'Mais Vendida',
    rating: 4.9,
    reviewsCount: 38,
    reviews: [
      {
        id: 'rev-1',
        author: 'Mariana Siqueira',
        location: 'São Paulo - SP',
        rating: 5,
        date: '14 de Outubro, 2026',
        comment: 'Incrível a naturalidade! Ninguém percebe que é peruca. A lace é ultrafina e o toque do cabelo é uma seda. Vale cada centavo.',
        verifiedBuyer: true
      },
      {
        id: 'rev-2',
        author: 'Beatriz Vasconcelos',
        location: 'Belo Horizonte - MG',
        rating: 5,
        date: '28 de Setembro, 2026',
        comment: 'Chegou em 2 dias úteis via Sedex. A embalagem é um luxo, com touca de cetim de presente. Apaixonada!',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'ondulada-morena',
    nome: 'Ondulada Morena Sublime',
    textura: 'ondulada',
    cor: 'Castanho médio com reflexos avelã',
    comprimento: '70 cm',
    comprimentoCm: 70,
    touca: 'Lace frontal 13x4',
    densidade: '180%',
    preco: 4290,
    fotos: [
      '1770576568718-6747e3d85de8',
      '1785456283212-338f5bc44d50',
      '1663582815412-665909d70e01'
    ],
    descricao: 'Ondas abertas esculpidas para um movimento glamouroso e cheio de vida. Densidade 180% que entrega volume cinematográfico sem pesar na nuca.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Premium Eslavo',
      tipo: '100% Cabelo Humano Texturizado a vapor',
      cuticulas: '100% alinhadas na mesma direção',
      reparticao: '13x4 frontal com baby hairs descoloridos',
      penteadosPermitidos: ['Ondas Hollywood', 'Semipreso alto', 'Tranças laterais'],
      resistenciaCalor: 'Aceita escova progressiva, babyliss e secador',
    },
    destaque: true,
    badge: 'Destaque Atelier',
    rating: 5.0,
    reviewsCount: 29,
    reviews: [
      {
        id: 'rev-3',
        author: 'Camila Duarte',
        location: 'Rio de Janeiro - RJ',
        rating: 5,
        date: '02 de Outubro, 2026',
        comment: 'O volume é perfeito! As ondas não se desfazem com facilidade e a linha da testa é imperceptível.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'cacheada-3c',
    nome: 'Cacheada Sublime 3C/4A',
    textura: 'cacheada',
    cor: 'Preto natural profundo',
    comprimento: '45 cm',
    comprimentoCm: 45,
    touca: 'Lace frontal 13x4',
    densidade: '200%',
    preco: 3290,
    fotos: [
      '1641522682419-7e52d83a8ce5',
      '1632765854612-9b02b6ec2b15',
      '1519699047748-de8e457a634e'
    ],
    descricao: 'Cachos estruturados com definição impecável e elasticidade singular. A densidade 200% reproduz a exuberância da coroa crespa/cacheada com extremo conforto.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Virgem do Sul',
      tipo: 'Curvatura 3C a 4A com memória de cacho',
      cuticulas: 'Preservadas com nutrição de óleos vegetais',
      reparticao: '13x4 com nós clareados invisíveis',
      penteadosPermitidos: ['Afro puff', 'Laterais com grampos dourados', 'Coque alto abacaxi'],
      resistenciaCalor: 'Difusor e secador morno permitidos',
    },
    destaque: true,
    badge: 'Volume Poderoso',
    rating: 4.8,
    reviewsCount: 42,
    reviews: [
      {
        id: 'rev-4',
        author: 'Dra. Jaqueline Ramos',
        location: 'Salvador - BA',
        rating: 5,
        date: '21 de Outubro, 2026',
        comment: 'Resgatei minha autoestima. Cachos hiper naturais, não embola e o couro cabeludo respira.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'loira-iluminada',
    nome: 'Loira Iluminada Champagne',
    textura: 'lisa',
    cor: 'Loiro perolado com raiz esfumada mel',
    comprimento: '55 cm',
    comprimentoCm: 55,
    touca: 'Full lace',
    densidade: '150%',
    preco: 4990,
    fotos: [
      '1779912217721-a3cc453ae9d6',
      '1785456283212-338f5bc44d50',
      '1663582815426-3d31dbf17faf'
    ],
    descricao: 'Obra de arte da nossa colorista sênior: degradê suave com mechas tridimensionais champagne. Confeccionada em Full Lace com tela suíça que permite rabo de cavalo alto.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Eslavo Platinum Pure',
      tipo: 'Descoloração lenta com Plex protetor',
      cuticulas: 'Fechadas e seladas com queratina hidrolisada',
      reparticao: 'Full Lace 360° (reparta em qualquer direção)',
      penteadosPermitidos: ['Rabo alto de gala', 'Trança boxeadora', 'Coque bailarina'],
      resistenciaCalor: 'Até 190°C com protetor térmico',
    },
    destaque: false,
    lancamento: true,
    badge: 'Edição Limitada',
    rating: 5.0,
    reviewsCount: 17,
    reviews: [
      {
        id: 'rev-5',
        author: 'Fernanda Peixoto',
        location: 'Curitiba - PR',
        rating: 5,
        date: '10 de Outubro, 2026',
        comment: 'A cor é idêntica à foto. Parece que fiz luzes no melhor salão da cidade. Vale o investimento!',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'lisa-preta-longa',
    nome: 'Lisa Noir Royal 75cm',
    textura: 'lisa',
    cor: 'Preto ônix espelhado',
    comprimento: '75 cm',
    comprimentoCm: 75,
    touca: 'Lace frontal 13x6',
    densidade: '180%',
    preco: 4490,
    fotos: [
      '1663582816158-42354522fe15',
      '1730740505665-511513481bce',
      '1663582815412-665909d70e01'
    ],
    descricao: 'Para quem busca comprimento imponente e caimento de seda pura. A lace 13x6 tem 6 polegadas de profundidade na coroa, permitindo risca ao meio profunda e elegante.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Virgem Selecionado',
      tipo: 'Fio pesado e encorpado com caimento reto',
      cuticulas: '100% preservadas',
      reparticao: 'Lace 13x6 profunda de altíssima definição',
      penteadosPermitidos: ['Efeito molhado', 'Liso chapado impecável', 'Meio preso'],
      resistenciaCalor: 'Resistente até 220°C',
    },
    destaque: false,
    rating: 4.9,
    reviewsCount: 22,
  },
  {
    id: 'lisa-chocolate',
    nome: 'Lisa Chocolate Warm Glow',
    textura: 'lisa',
    cor: 'Castanho chocolate quente com nuances canela',
    comprimento: '60 cm',
    comprimentoCm: 60,
    touca: 'Lace frontal 13x4',
    densidade: '150%',
    preco: 3590,
    fotos: [
      '1758315949140-1972ace0644e',
      '1668505543198-4fb0b42808bc',
      '1663582815426-3d31dbf17faf'
    ],
    descricao: 'A elegância discreta do marrom chocolate. Tons calorosos que iluminam o semblante de forma sutil e harmoniosa. Perfeita para uso diário prolongado.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Brasileiro Virgem',
      tipo: 'Sedoso e maleável',
      cuticulas: 'Intactas',
      reparticao: '13x4 HD Lace',
      penteadosPermitidos: ['Todos os estilos casuais e formais'],
      resistenciaCalor: 'Até 200°C',
    },
    destaque: false,
    rating: 4.7,
    reviewsCount: 31,
  },
  {
    id: 'black-power',
    nome: 'Crespa Magnífica Black Power',
    textura: 'cacheada',
    cor: 'Preto natural suave',
    comprimento: '30 cm',
    comprimentoCm: 30,
    touca: 'Lace frontal 13x4',
    densidade: '200%',
    preco: 2890,
    fotos: [
      '1519699047748-de8e457a634e',
      '1632765854612-9b02b6ec2b15',
      '1641522682419-7e52d83a8ce5'
    ],
    descricao: 'Homenagem à ancestralidade e ao poder da beleza afro. Curvatura 4B/4C com textura macia, volumosa e incrivelmente leve no couro cabeludo.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Texturizado Artesanalmente',
      tipo: 'Curvatura crespa autêntica',
      cuticulas: 'Tratadas com hidratação lipídica',
      reparticao: 'Lace frontal respirável com acabamento aveludado',
      penteadosPermitidos: ['Black power redondo', 'Tapered cut look', 'Preso lateral'],
      resistenciaCalor: 'Secador com ar morno',
    },
    destaque: true,
    badge: 'Best Seller Afro',
    rating: 5.0,
    reviewsCount: 45,
  },
  {
    id: 'ondulada-praia',
    nome: 'Ondulada Beach Blonde Lux',
    textura: 'ondulada',
    cor: 'Castanho iluminado com contorno dourado',
    comprimento: '60 cm',
    comprimentoCm: 60,
    touca: 'Full lace',
    densidade: '180%',
    preco: 4690,
    fotos: [
      '1785456283212-338f5bc44d50',
      '1770576568718-6747e3d85de8',
      '1663582815412-665909d70e01'
    ],
    descricao: 'Visual sofisticado de quem acabou de voltar de férias na Riviera Italiana. Ondas naturais com contorno frontal iluminado para valorizar os traços do rosto.',
    detalhesCabelo: {
      origem: 'Cabelo Humano Selecionado Eslavo',
      tipo: 'Ondulado natural de textura macia',
      cuticulas: 'Totalmente seladas',
      reparticao: 'Full Lace de microtela reforçada',
      penteadosPermitidos: ['Rabo alto', 'Penteados de noiva', 'Trança cascata'],
      resistenciaCalor: 'Até 210°C',
    },
    destaque: false,
    badge: 'Full Lace 360°',
    rating: 4.9,
    reviewsCount: 19,
  }
];
