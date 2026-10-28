// Dados da loja e das perucas de EXEMPLO.
// Troque aqui o nome, o WhatsApp e as peças reais quando tiver.

const LOJA = {
  nome: 'Sua Marca',
  whatsapp: '5500000000000', // DDI + DDD + número, só dígitos
  instagram: 'suamarca',
  descontoPix: 0.05,         // 5% de desconto no Pix
  parcelas: 10               // até 10x sem juros
};

// Fotos ilustrativas do Unsplash (uso livre). Trocar pelas fotos reais das peças.
function foto(id, largura) {
  return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (largura || 900) + '&q=80';
}

const PERUCAS = [
  {
    id: 'lisa-castanho',
    nome: 'Lisa Castanho Natural',
    textura: 'lisa',
    cor: 'Castanho escuro natural',
    comprimento: '65 cm',
    touca: 'Lace frontal 13x4',
    densidade: '150%',
    preco: 3890,
    fotos: ['1668505543198-4fb0b42808bc', '1730740505665-511513481bce', '1663582815426-3d31dbf17faf'],
    descricao: 'Fios lisos com caimento leve e brilho natural. Lace transparente que se adapta a vários tons de pele.'
  },
  {
    id: 'ondulada-morena',
    nome: 'Ondulada Morena',
    textura: 'ondulada',
    cor: 'Castanho médio',
    comprimento: '70 cm',
    touca: 'Lace frontal 13x4',
    densidade: '180%',
    preco: 4290,
    fotos: ['1770576568718-6747e3d85de8', '1785456283212-338f5bc44d50', '1663582815412-665909d70e01'],
    descricao: 'Ondas abertas e volumosas, prontas para usar. Aceita escova e babyliss.'
  },
  {
    id: 'cacheada-3c',
    nome: 'Cacheada Natural 3C',
    textura: 'cacheada',
    cor: 'Preto natural',
    comprimento: '45 cm',
    touca: 'Lace frontal 13x4',
    densidade: '200%',
    preco: 3290,
    fotos: ['1641522682419-7e52d83a8ce5', '1632765854612-9b02b6ec2b15', '1519699047748-de8e457a634e'],
    descricao: 'Cachos definidos e cheios, com raiz natural. Ideal para quem quer volume com leveza.'
  },
  {
    id: 'loira-iluminada',
    nome: 'Loira Iluminada',
    textura: 'lisa',
    cor: 'Loiro mel iluminado',
    comprimento: '55 cm',
    touca: 'Full lace',
    densidade: '150%',
    preco: 4990,
    fotos: ['1779912217721-a3cc453ae9d6', '1785456283212-338f5bc44d50', '1663582815426-3d31dbf17faf'],
    descricao: 'Loiro com nuances de mel e raiz esfumada. Full lace permite repartir o cabelo em qualquer lado.'
  },
  {
    id: 'lisa-preta-longa',
    nome: 'Lisa Preta Longa',
    textura: 'lisa',
    cor: 'Preto natural',
    comprimento: '75 cm',
    touca: 'Lace frontal 13x6',
    densidade: '180%',
    preco: 4490,
    fotos: ['1663582816158-42354522fe15', '1730740505665-511513481bce', '1663582815412-665909d70e01'],
    descricao: 'Comprimento longo, fios alinhados e muito brilho. Lace 13x6 para uma linha frontal ainda mais natural.'
  },
  {
    id: 'lisa-chocolate',
    nome: 'Lisa Chocolate',
    textura: 'lisa',
    cor: 'Castanho chocolate',
    comprimento: '60 cm',
    touca: 'Lace frontal 13x4',
    densidade: '150%',
    preco: 3590,
    fotos: ['1758315949140-1972ace0644e', '1668505543198-4fb0b42808bc', '1663582815426-3d31dbf17faf'],
    descricao: 'Tom chocolate quente com movimento suave nas pontas. Fácil de cuidar no dia a dia.'
  },
  {
    id: 'black-power',
    nome: 'Black Power Volume',
    textura: 'cacheada',
    cor: 'Preto natural',
    comprimento: '30 cm',
    touca: 'Lace frontal 13x4',
    densidade: '200%',
    preco: 2890,
    fotos: ['1519699047748-de8e457a634e', '1632765854612-9b02b6ec2b15', '1641522682419-7e52d83a8ce5'],
    descricao: 'Volume máximo com textura crespa natural. Leve na cabeça apesar do volume.'
  },
  {
    id: 'ondulada-praia',
    nome: 'Ondulada Iluminada',
    textura: 'ondulada',
    cor: 'Castanho com mechas mel',
    comprimento: '60 cm',
    touca: 'Full lace',
    densidade: '180%',
    preco: 4690,
    fotos: ['1785456283212-338f5bc44d50', '1770576568718-6747e3d85de8', '1663582815412-665909d70e01'],
    descricao: 'Ondas soltas com mechas que iluminam o rosto. Full lace para prender em rabo alto.'
  }
];
