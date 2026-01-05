import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export async function GET() {
  const TARGET_URL = 'https://www.mulungu.ce.gov.br/informa.php';

  try {
    // 1. Fetch the HTML with axios
    // We use 'arraybuffer' to handle encoding manually with iconv-lite
    const response = await axios.get(TARGET_URL, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // 2. Decode the response
    // Most older government sites in Brazil use ISO-8859-1 (Latin1)
    // If the site is UTF-8, change 'iso-8859-1' to 'utf-8'
    const decodedHtml = iconv.decode(response.data, 'iso-8859-1');

    // 3. Load into Cheerio
    const $ = cheerio.load(decodedHtml);
    const news: any[] = [];

    // 4. Scrape the data
    // ! ATENÇÃO: Seletores CSS baseados em uma estrutura hipotética padrão de portais governamentais.
    // ! Você precisará Inspecionar Elemento no site real e ajustar as classes abaixo.
    
    // Iterating over card elements. 
    // Exemplo hipotético: div.noticia-item, ou div.card, ou article
    $('.noticia_item, .blog-post, .card').slice(0, 5).each((index, element) => {
      
      // Title Selector (Adjust '.titulo', 'h3', etc)
      const title = $(element).find('h3, .titulo, .title').text().trim();
      
      // Date Selector (Adjust '.data', '.date', etc)
      const date = $(element).find('.data, .date, span.fa-calendar').parent().text().trim() || 'Recente';
      
      // Link Selector
      const relativeLink = $(element).find('a').attr('href');
      const link = relativeLink ? (relativeLink.startsWith('http') ? relativeLink : `https://www.mulungu.ce.gov.br/${relativeLink}`) : '#';

      // Category (Often inside a badge or distinct span)
      const category = $(element).find('.categoria, .badge, .label').text().trim() || 'Informativo';

      // Image (Optional)
      const imgRelative = $(element).find('img').attr('src');
      const imageUrl = imgRelative ? (imgRelative.startsWith('http') ? imgRelative : `https://www.mulungu.ce.gov.br/${imgRelative}`) : undefined;

      if (title) {
        news.push({
          title,
          date,
          category,
          link,
          imageUrl
        });
      }
    });

    // Fallback Mock Data if scraper finds nothing (so the app doesn't look broken during dev)
    if (news.length === 0) {
      console.warn("Scraper returned 0 items. Using fallback data. Check CSS Selectors.");
      return NextResponse.json({
        news: [
          {
            title: "Campanha de Vacinação contra a Gripe começa nesta segunda-feira",
            date: "Há 2 dias",
            category: "Saúde",
            link: "https://www.mulungu.ce.gov.br/informa.php",
            imageUrl: ""
          },
          {
            title: "Prefeitura realiza manutenção nas estradas vicinais do distrito",
            date: "Há 5 dias",
            category: "Obras",
            link: "https://www.mulungu.ce.gov.br/informa.php",
            imageUrl: ""
          },
          {
            title: "Secretaria de Educação divulga calendário de matrículas 2024",
            date: "Há 1 semana",
            category: "Educação",
            link: "https://www.mulungu.ce.gov.br/informa.php",
            imageUrl: ""
          }
        ]
      });
    }

    return NextResponse.json({ news });

  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news from Mulungu portal' },
      { status: 500 }
    );
  }
}