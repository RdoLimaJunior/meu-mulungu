import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export const dynamic = 'force-dynamic'; // Garante que não faça cache estático incorreto

// Dados de fallback alinhados com o site oficial (HTML fornecido)
const MOCK_NEWS = [
  { 
    id: 183, 
    title: "Prefeitura de Mulungu realiza licitação para concessão de quiosques em pontos turísticos da cidade", 
    category: "Administração", 
    date: "Há 34 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/183/prefeitura-de-mulungu-realiza-licita-o-para-conces",
    imageUrl: "https://www.mulungu.ce.gov.br/fotos/183/Img0_600x400.jpg"
  },
  { 
    id: 181, 
    title: "Mulungu conquista o Selo TCE Ceará Sustentável", 
    category: "MeioAmbiente", 
    date: "Há 46 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/181/mulungu-conquista-o-selo-tce-cear-sustent-vel",
    imageUrl: "https://www.mulungu.ce.gov.br/fotos/181/Capa181.jpg"
  },
  { 
    id: 180, 
    title: "6° CONFERÊNCIA MUNICIPAL DAS CIDADES", 
    category: "Desenvolvimento", 
    date: "Há 205 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/180/6-confer-ncia-municipal-das-cidades",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/180/051e06498ade9579ff26e7a2a9213822"
  },
  { 
    id: 179, 
    title: "Festa Anual das Árvores 2025 em Mulungu: Por um Ceará Mais Verde e Sustentável", 
    category: "MeioAmbiente", 
    date: "Há 282 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/179/festa-anual-das-rvores-2025-em-mulungu-por-um-cear",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/179/cf18655dae5ba2b544d530cb24f1aee4"
  },
  { 
    id: 178, 
    title: "Mulungu realiza a 1ª Corrida de Rua na Semana do Município", 
    category: "Esporte", 
    date: "Há 296 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/178/mulungu-realiza-a-1-corrida-de-rua-na-semana-do-mu",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/178/db31c846ee2a38819bb0c1354b6b68ba"
  }
];

export async function GET() {
  try {
    const url = 'https://www.mulungu.ce.gov.br/informa.php';

    // 1. Baixar o HTML Bruto
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MulunguApp/1.0'
      }
    });

    // 2. Decodificar (ISO-8859-1)
    const html = iconv.decode(response.data, 'iso-8859-1'); 
    const $ = cheerio.load(html);
    
    const newsItems: any[] = [];

    // 3. Estratégia de Raspagem
    $('.col-md-4').each((i, element) => {
      if (newsItems.length >= 6) return;

      const el = $(element);
      const titleElement = el.find('h4.data_h4 strong');
      let title = titleElement.text().trim();
      
      if (!title) title = el.find('h4.data_h4').text().trim();
      if (!title) return;

      let category = el.find('.tag_news').text().trim().replace('#', '').trim();
      
      const fullText = el.text();
      const dateMatch = fullText.match(/Há \d+ dias?/);
      const date = dateMatch ? dateMatch[0] : 'Recente';

      const linkEl = el.find('a.LinkInforma3');
      let link = linkEl.attr('href');
      if (link && !link.startsWith('http')) {
        link = `https://www.mulungu.ce.gov.br${link}`;
      }

      const imgEl = el.find('img.img-responsive');
      let imageUrl = imgEl.attr('src');
      
      if (imageUrl) {
        if (!imageUrl.startsWith('http')) {
          imageUrl = imageUrl.startsWith('/') 
            ? `https://www.mulungu.ce.gov.br${imageUrl}`
            : `https://www.mulungu.ce.gov.br/${imageUrl}`;
        }
      }

      newsItems.push({
        id: i,
        title,
        category: category || 'Geral',
        date,
        link: link || '#',
        imageUrl: imageUrl
      });
    });

    if (newsItems.length === 0) {
       return NextResponse.json({ news: MOCK_NEWS });
    }

    return NextResponse.json({ news: newsItems });

  } catch (error) {
    // console.error('Erro ao fazer scrape:', error);
    // Em caso de falha, retorna o MOCK_NEWS para manter a UI funcionando
    return NextResponse.json({ news: MOCK_NEWS });
  }
}