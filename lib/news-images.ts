// Helper to provide nice background images since the scraper doesn't get them.
// Using Unsplash source URLs for reliability and quality.

export const getNewsImage = (category: string = ''): string => {
  const lowerCat = category.toLowerCase().trim();

  // Saúde / Vacinação / Hospital
  if (lowerCat.includes('saúde') || lowerCat.includes('saude') || lowerCat.includes('vaci') || lowerCat.includes('covid') || lowerCat.includes('médic')) {
    return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop';
  }

  // Educação / Escola
  if (lowerCat.includes('educa') || lowerCat.includes('escola') || lowerCat.includes('aluno') || lowerCat.includes('professor')) {
    return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1532&auto=format&fit=crop';
  }

  // Obras / Infraestrutura
  if (lowerCat.includes('obra') || lowerCat.includes('infra') || lowerCat.includes('constru') || lowerCat.includes('paviment')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop';
  }

  // Meio Ambiente / Agricultura / Rural
  if (lowerCat.includes('ambiente') || lowerCat.includes('agric') || lowerCat.includes('rural') || lowerCat.includes('campo')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1632&auto=format&fit=crop';
  }

  // Cultura / Eventos
  if (lowerCat.includes('cultura') || lowerCat.includes('fest') || lowerCat.includes('evento')) {
    return 'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1470&auto=format&fit=crop';
  }
  
  // Social / Assistência
  if (lowerCat.includes('social') || lowerCat.includes('assist')) {
    return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1470&auto=format&fit=crop';
  }

  // Esporte
  if (lowerCat.includes('esporte') || lowerCat.includes('futebol') || lowerCat.includes('lazer')) {
    return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop';
  }

  // Fallback: Mulungu Generic / City Hall / Governance
  // Using an abstract reliable "Gov/Office" image or a nice nature shot if generic
  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop';
};