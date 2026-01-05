export function getNewsImage(category: string = ''): string {
  const cat = category.toLowerCase().trim();

  // Saúde / Vacinação / Hospital
  if (cat.includes('saúde') || cat.includes('saude') || cat.includes('vaci') || cat.includes('covid') || cat.includes('dengue') || cat.includes('medic')) {
    return 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1632&auto=format&fit=crop';
  }
  
  // Educação / Escola
  if (cat.includes('educa') || cat.includes('escola') || cat.includes('aluno') || cat.includes('aula') || cat.includes('professor')) {
    return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop';
  }
  
  // Obras / Infraestrutura
  if (cat.includes('obra') || cat.includes('infra') || cat.includes('asfalto') || cat.includes('constru')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop';
  }
  
  // Meio Ambiente / Agricultura / Rural
  if (cat.includes('ambiente') || cat.includes('verde') || cat.includes('agric') || cat.includes('água') || cat.includes('rural')) {
    return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1613&auto=format&fit=crop';
  }
  
  // Cultura / Eventos / Esporte
  if (cat.includes('cultura') || cat.includes('festa') || cat.includes('evento') || cat.includes('esporte') || cat.includes('lazer')) {
    return 'https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=1470&auto=format&fit=crop';
  }

  // Social
  if (cat.includes('social') || cat.includes('assist')) {
    return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1470&auto=format&fit=crop';
  }

  // Fallback: Imagem Genérica Institucional
  return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1544&auto=format&fit=crop';
}