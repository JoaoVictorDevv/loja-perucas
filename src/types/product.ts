export type TextureType = 'lisa' | 'ondulada' | 'cacheada';
export type CapType = 'Lace frontal 13x4' | 'Lace frontal 13x6' | 'Full lace' | 'Silk Top 4x4' | 'HD Lace 13x4';
export type DensityType = '150%' | '180%' | '200%' | '250%';

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  nome: string;
  textura: TextureType;
  cor: string;
  comprimento: string; // e.g., '65 cm'
  comprimentoCm: number; // numeric value for sorting/filtering
  touca: CapType;
  densidade: DensityType;
  preco: number;
  fotos: string[]; // Unsplash image IDs or full URLs
  descricao: string;
  detalhesCabelo: {
    origem: string;
    tipo: string;
    cuticulas: string;
    reparticao: string;
    penteadosPermitidos: string[];
    resistenciaCalor: string;
  };
  destaque?: boolean;
  lancamento?: boolean;
  badge?: string;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
}

export interface FilterState {
  textura: 'todas' | TextureType;
  comprimento: 'todos' | 'curto' | 'medio' | 'longo' | 'extralongo';
  preco: 'todos' | 'ate3500' | '3500a4500' | 'acima4500';
  touca: 'todas' | CapType;
  densidade: 'todas' | DensityType;
  ordem: 'destaques' | 'menor' | 'maior' | 'comprimento' | 'avaliacao';
  termoBusca?: string;
}
