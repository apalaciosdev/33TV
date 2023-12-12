const { response } = require("express") //this helps VSC for code snippetsconst { response } = require("express") //this helps VSC for code snippets
const cheerio = require("cheerio")
const axios = require("axios")

const searchMedia = async (req, res = response) => {
  try {
    const { query } = req.params;

    const url = "https://playdede.us/search?s=" + query;
    let data = [];

    const response = await axios.get(url, {
      headers: {
        Cookie:
          "_ga_D9G0K8CJ8D=GS1.1.1701859968.15.1.1701859985.0.0.0; _ga=GA1.1.750629935.1701513860; cf_clearance=iZgjGHx2.hTnEBgFMSBWPmrDwhw3ElV5uNXpofgloHs-1701855916-0-1-6ac52d8.930039bf.d62ee2aa-0.2.1701855916; utoken=VBVZsybpGiDo5eQSH6CwlvR4nXMxicIh; PLAYDEDE_SESSION=c3827bcdc92a2af8f99abc5129b7fd1f",
        Host: "playdede.us",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    });

    const $ = cheerio.load(response.data);
    const tvShowDivs = $(".item.tvshows");

    tvShowDivs.each((index, element) => {
      const image = $(element).find(".poster img").attr("src");
      const link = $(element).find("a").attr("href");
      const date = $(element).find(".data p").text();
      const title = $(element).find(".data h3").text();
      const genre = $(element).find(".data span").text();
      const dataType = $(element).find(".poster-mark").attr("data-type");

      data.push({ image, link, date, title, genre, dataType });
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


const getEpisodes = async (req, res = response) => {
  try {
    const { query } = req.body;

    const url = "https://playdede.us/" + query;
    let data = [];

    const response = await axios.get(url, {
      headers: {
        Cookie:
          "_ga_D9G0K8CJ8D=GS1.1.1701859968.15.1.1701859985.0.0.0; _ga=GA1.1.750629935.1701513860; cf_clearance=iZgjGHx2.hTnEBgFMSBWPmrDwhw3ElV5uNXpofgloHs-1701855916-0-1-6ac52d8.930039bf.d62ee2aa-0.2.1701855916; utoken=VBVZsybpGiDo5eQSH6CwlvR4nXMxicIh; PLAYDEDE_SESSION=c3827bcdc92a2af8f99abc5129b7fd1f",
        Host: "playdede.us",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    });

    const $ = cheerio.load(response.data);

    // Seleccionar el div con id "seasons"
    const seasonsDiv = $("#seasons");

    // Obtener las temporadas
    seasonsDiv.find(".se-c").each((seasonIndex, seasonElement) => {
      const season = {
        seasonNumber: $(seasonElement).data("season"),
        episodes: [],
      };

      // Obtener los episodios de la temporada
      $(seasonElement)
        .find(".episodios li")
        .each((episodeIndex, episodeElement) => {
          const episode = {
            href: $(episodeElement).find("a").attr("href"),
            imgSrc: $(episodeElement).find(".imagen img").attr("src"),
            title: $(episodeElement).find(".episodiotitle .epst").text(),
            numerando: $(episodeElement).find(".episodiotitle .numerando").text(),
            date: $(episodeElement).find(".episodiotitle .date").text().trim(),
          };
          season.episodes.push(episode);
        });

      // Añadir la temporada al array de datos
      data.push(season);
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


const getReproducers = async (req, res = response) => {
  try {
    const { query } = req.body;
    const resultados = [];
    const url = "https://playdede.us/" + query;

    const response = await axios.get(url, {
      headers: {
        Cookie:
          "_ga_D9G0K8CJ8D=GS1.1.1701859968.15.1.1701859985.0.0.0; _ga=GA1.1.750629935.1701513860; cf_clearance=iZgjGHx2.hTnEBgFMSBWPmrDwhw3ElV5uNXpofgloHs-1701855916-0-1-6ac52d8.930039bf.d62ee2aa-0.2.1701855916; utoken=VBVZsybpGiDo5eQSH6CwlvR4nXMxicIh; PLAYDEDE_SESSION=c3827bcdc92a2af8f99abc5129b7fd1f",
        Host: "playdede.us",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    });

    const $ = cheerio.load(response.data);


    // Obtener información de la sección 'info'
    const infoSection = $('#info');

    // Extraer el título (h1) y la descripción (p)
    const title = infoSection.find('h1').text().trim();
    const description = infoSection.find('.wp-content p').text().trim();



    const navEpDiv = $('.navEP');
    const navigationLinks = {};

    const anteriorLink = navEpDiv.find('a:contains("Anterior")').attr('href');
    const seasonsLink = navEpDiv.find('a:contains("temporadas")').attr('href');
    const siguienteLink = navEpDiv.find('a:contains("Siguiente")').attr('href');

    navigationLinks.anterior = anteriorLink ? anteriorLink : null;
    navigationLinks.seasons = seasonsLink ? seasonsLink : null;
    navigationLinks.siguiente = siguienteLink ? siguienteLink : null;


    // Utiliza un bucle asíncrono
    for (const element of $('.playerItem[data-lang="esp"]').toArray()) {
      const dataLoadPlayer = $(element).attr('data-loadplayer');
      if (dataLoadPlayer) {
        const iframeUrl = `https://playdede.us/embed.php?id=${dataLoadPlayer}&width=431&height=540`;
        await getIframe(iframeUrl, resultados);
      }
    }

    return res.status(200).json({resultados, info: { title, description }, navigationLinks});

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getIframe = async (url, resultados) => {
  try {
    const iframeResponse = await axios.get(url);
    const iframeHtml = iframeResponse.data;

    // Utilizar Cheerio para extraer la etiqueta <iframe> y su contenido
    const $iframe = cheerio.load(iframeHtml);
    const $iframeTag = $iframe('iframe');

    // Comprobar si ya existe el atributo sandbox
    const sandboxAttribute = $iframeTag.attr('sandbox');

    if (!sandboxAttribute) {
      // Si no existe, agregar el atributo sandbox con los valores especificados
      $iframeTag.attr('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allowfullscreen');
    }

    // Quitar los atributos width y height
    $iframeTag.removeAttr('width');
    $iframeTag.removeAttr('height');

    // Quitar los atributos adicionales
    $iframeTag.removeAttr('frameborder');
    $iframeTag.removeAttr('marginwidth');
    $iframeTag.removeAttr('marginheight');
    $iframeTag.removeAttr('scrolling');

    // Agregar el atributo style con los estilos especificados
    $iframeTag.attr('style', 'width: 95%; height: 95%; position: absolute; top: 0; left: 0; bottom: 0; right: 0;');

    const iframeTag = $iframeTag.toString();

    // Ahora, puedes procesar o almacenar la etiqueta <iframe> en el array resultados
    resultados.push(iframeTag);
  } catch (error) {
    console.error("Error obteniendo el iframe:", error.message);
  }
};






async function extraerIframesCompleto(url) {
  try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const iframes = [];

      $('iframe').each((index, element) => {
          // Obtener la etiqueta completa del iframe como una cadena
          const iframeString = $.html(element);
          iframes.push(iframeString);
      });

      return iframes;
  } catch (error) {
      console.error(`Error al obtener ${url}: ${error.message}`);
      return [];
  }
}


const getTest = async(req, res = response ) => {
  console.log("Uptime Robot Request")
  return res.status(201).end();
}

module.exports = {
  searchMedia,
  getEpisodes,
  getReproducers,
  getTest
}