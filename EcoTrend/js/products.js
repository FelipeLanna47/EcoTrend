/* products.js
   Declaração dos produtos e exposição em window.products
   Ajuste os caminhos das imagens se necessário (mantive `img/...`).
*/

const products = [
  {
    id: 1,
    name: "Camiseta de Algodão (Azul)",
    price: 89.90,
    category: "Roupas",
    image: "img/camisas de algodao/azul gola em V.webp",
    description: "Camiseta de algodão orgânico, macia e confortável.",
    featured: true
  },
  {
    id: 2,
    name: "Camiseta de Algodão (Branca)",
    price: 99.90,
    category: "Roupas",
    image: "img/camisas de algodao/branca basica.webp",
    description: "Camiseta básica branca, sustentável.",
    featured: false
  },
  {
    id: 3,
    name: "Carregador Portátil de Bambu",
    price: 159.90,
    category: "Tecnologia",
    image: "img/Carregador portatil de bambu/Carregador portatil de bambu.avif",
    description: "Powerbank ecológico com carcaça de bambu.",
    featured: true
  },
  {
    id: 4,
    name: "Escova de Dentes de Bambu",
    price: 19.90,
    category: "Beleza",
    image: "img/Escova de bambu/Escova de bambu.webp",
    description: "Escova biodegradável com cerdas suaves.",
    featured: false
  },
  {
    id: 5,
    name: "Hidratante Corporal Natural",
    price: 49.90,
    category: "Beleza",
    image: "img/hidratane/hidratante corporal natural.webp",
    description: "Hidratante com ingredientes naturais e perfumação leve.",
    featured: false
  },
  {
    id: 6,
    name: "Jaqueta Reutilizada (Plástico Reciclado)",
    price: 249.90,
    category: "Roupas",
    image: "img/Jaqueta de plastico/Jaqueta de plastico.webp",
    description: "Jaqueta feita a partir de plástico reciclado.",
    featured: true
  },
  {
    id: 7,
    name: "Sabonete Vegano em Barra",
    price: 12.50,
    category: "Beleza",
    image: "img/Sabonete vegano em barra/sabonete vegano em barra.webp",
    description: "Sabonete artesanal, vegano e sem sulfatos.",
    featured: false
  },
  {
    id: 8,
    name: "Kit Utensílios de Bambu",
    price: 79.90,
    category: "Casa",
    image: "img/utensilios de bambu/kit utensilios de bambu.jpg",
    description: "Kit prático para cozinha com talheres e espátula em bambu.",
    featured: false
  },
  {
    id: 9,
    name: "Camiseta de Algodão (Preta)",
    price: 119.90,
    category: "Roupas",
    image: "img/camisas de algodao/preta basica.webp",
    description: "Camiseta preta básica, algodão orgânico.",
    featured: false
  }
];

if (typeof window !== "undefined") {
  window.products = products;
}
