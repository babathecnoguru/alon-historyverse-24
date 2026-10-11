
/*
============================================================
 ALON HISTORYVERSE 24
 WORLD TOURIST PLACES & WORLD HERITAGE
 File: world-tourist-places.js
 Version: 2.1.0
 Owner: Baba Thecno Guru

 Includes:
 - Separate Country and City selectors
 - City list filtered by selected country
 - Current city weather via Open-Meteo (no API key)
 - Tourist and World Heritage directory filters
 - Search and local-directory AI-style discovery
 - OpenStreetMap links and official source links
 - Public live-camera directory links
 - Camera links shown on every destination card
 - No unauthorized video embedding or rebroadcasting
 - Safe text rendering and responsive cards
============================================================
*/
"use strict";

const TOURIST_PLACES = [
  {id:"eiffel-tower",city:"Paris",country:"France",place:"Eiffel Tower",category:"Landmark",description:"Famous Paris landmark with visitor information and views across the city.",source:"https://www.toureiffel.paris/en",sourceName:"Official Eiffel Tower",latitude:48.8584,longitude:2.2945,heritage:false,tags:["tower","landmark","europe"]},
  {id:"colosseum",city:"Rome",country:"Italy",place:"Colosseum",category:"UNESCO World Heritage",description:"Ancient Roman amphitheatre and a major archaeological landmark.",source:"https://colosseo.it/en/",sourceName:"Colosseum Archaeological Park",latitude:41.8902,longitude:12.4922,heritage:true,tags:["history","ancient","monument"]},
  {id:"venice-grand-canal",city:"Venice",country:"Italy",place:"Grand Canal and Rialto Bridge",category:"Historic Cityscape",description:"Venice's celebrated canal and bridge area in its historic lagoon city.",source:"https://www.veneziaunica.it/en",sourceName:"Official Venice Tourism",latitude:45.4408,longitude:12.3359,heritage:true,tags:["rialto","canal","bridge"]},
  {id:"piazza-san-marco",city:"Venice",country:"Italy",place:"Piazza San Marco",category:"Historic Square",description:"Venice's famous public square beside St Mark's Basilica and the Doge's Palace.",source:"https://www.veneziaunica.it/en",sourceName:"Official Venice Tourism",latitude:45.4342,longitude:12.3388,heritage:true,tags:["st marks","basilica","square"]},
  {id:"florence-cathedral",city:"Florence",country:"Italy",place:"Florence Cathedral and Historic Centre",category:"UNESCO World Heritage",description:"Historic Florence centre, known for Renaissance architecture and the cathedral complex.",source:"https://www.feelflorence.it/en",sourceName:"Feel Florence Tourism",latitude:43.7731,longitude:11.2560,heritage:true,tags:["duomo","renaissance"]},
  {id:"pisa-tower",city:"Pisa",country:"Italy",place:"Leaning Tower of Pisa",category:"UNESCO World Heritage",description:"The famous leaning bell tower in Piazza del Duomo, part of a protected historic complex.",source:"https://www.opapisa.it/en/",sourceName:"Opera della Primaziale Pisana",latitude:43.7230,longitude:10.3966,heritage:true,tags:["pisa tower","piazza dei miracoli"]},
  {id:"siena-piazza",city:"Siena",country:"Italy",place:"Piazza del Campo",category:"Historic Square",description:"Medieval shell-shaped main square in the historic Tuscan city of Siena.",source:"https://www.visittuscany.com/en/places/siena/",sourceName:"Visit Tuscany",latitude:43.3188,longitude:11.3308,heritage:true,tags:["medieval","tuscany"]},
  {id:"matera-sassi",city:"Matera",country:"Italy",place:"Sassi di Matera",category:"UNESCO World Heritage",description:"Historic cave-dwelling districts and stone-built urban landscape.",source:"https://www.basilicataturistica.it/",sourceName:"Basilicata Tourism",latitude:40.6664,longitude:16.6043,heritage:true,tags:["cave houses","historic"]},
  {id:"mount-etna",city:"Catania",country:"Italy",place:"Mount Etna",category:"UNESCO Natural Heritage",description:"Active volcanic landscape. Check official alerts and access conditions before visiting.",source:"https://www.visitsicily.info/en/",sourceName:"Visit Sicily",latitude:37.7510,longitude:14.9934,heritage:true,tags:["volcano","nature","sicily"]},
  {id:"statue-of-liberty",city:"New York",country:"United States",place:"Statue of Liberty",category:"Monument",description:"Historic monument in New York Harbor with official visitor and park information.",source:"https://www.nps.gov/stli/index.htm",sourceName:"US National Park Service",latitude:40.6892,longitude:-74.0445,heritage:false,tags:["usa","liberty","monument"]},
  {id:"times-square",city:"New York",country:"United States",place:"Times Square",category:"Public Square",description:"Famous Manhattan public entertainment district and city landmark.",source:"https://www.timessquarenyc.org/",sourceName:"Times Square Alliance",latitude:40.7580,longitude:-73.9855,heritage:false,tags:["manhattan","square","city"]},
  {id:"grand-canyon",city:"Grand Canyon Village",country:"United States",place:"Grand Canyon National Park",category:"UNESCO Natural Heritage",description:"Vast canyon landscape with official park alerts, visitor guidance and viewpoints.",source:"https://www.nps.gov/grca/index.htm",sourceName:"Grand Canyon National Park",latitude:36.0544,longitude:-112.1401,heritage:true,tags:["nature","canyon","national park"]},
  {id:"sydney-opera-house",city:"Sydney",country:"Australia",place:"Sydney Opera House",category:"UNESCO World Heritage",description:"Landmark performing arts venue on Sydney Harbour; explore official visits and events.",source:"https://www.sydneyoperahouse.com/",sourceName:"Sydney Opera House",latitude:-33.8568,longitude:151.2153,heritage:true,tags:["harbour","architecture"]},
  {id:"taj-mahal",city:"Agra",country:"India",place:"Taj Mahal",category:"UNESCO World Heritage",description:"Mughal-era marble mausoleum and one of India's best-known heritage monuments.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:27.1751,longitude:78.0421,heritage:true,tags:["mughal","history","marble"]},
  {id:"agra-fort",city:"Agra",country:"India",place:"Agra Fort",category:"UNESCO World Heritage",description:"Historic Mughal fort complex in Agra. Check official visitor notices before travel.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:27.1795,longitude:78.0211,heritage:true,tags:["fort","mughal"]},
  {id:"qutub-minar",city:"Delhi",country:"India",place:"Qutb Minar Complex",category:"UNESCO World Heritage",description:"Historic complex featuring the Qutb Minar and important early Indo-Islamic architecture.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:28.5245,longitude:77.1855,heritage:true,tags:["delhi","minar","monument"]},
  {id:"red-fort",city:"Delhi",country:"India",place:"Red Fort",category:"UNESCO World Heritage",description:"Historic Mughal fortification and major heritage landmark in Old Delhi.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:28.6562,longitude:77.2410,heritage:true,tags:["lal qila","mughal","fort"]},
  {id:"hampi",city:"Hampi",country:"India",place:"Group of Monuments at Hampi",category:"UNESCO World Heritage",description:"Extensive historic remains of the Vijayanagara capital in a dramatic boulder landscape.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:15.3350,longitude:76.4600,heritage:true,tags:["karnataka","ruins","vijayanagara"]},
  {id:"khajuraho",city:"Khajuraho",country:"India",place:"Khajuraho Group of Monuments",category:"UNESCO World Heritage",description:"Historic temple group known for its architecture and detailed stone sculpture.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:24.8318,longitude:79.9199,heritage:true,tags:["temples","madhya pradesh"]},
  {id:"sanchi",city:"Sanchi",country:"India",place:"Buddhist Monuments at Sanchi",category:"UNESCO World Heritage",description:"Important Buddhist monument complex including the Great Stupa.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:23.4793,longitude:77.7397,heritage:true,tags:["stupa","buddhist","madhya pradesh"]},
  {id:"ellora-caves",city:"Aurangabad",country:"India",place:"Ellora Caves",category:"UNESCO World Heritage",description:"Rock-cut cave temples and monasteries representing multiple Indian religious traditions.",source:"https://asi.nic.in/",sourceName:"Archaeological Survey of India",latitude:20.0268,longitude:75.1790,heritage:true,tags:["caves","maharashtra","rock cut"]},
  {id:"gateway-of-india",city:"Mumbai",country:"India",place:"Gateway of India",category:"Landmark",description:"Popular public waterfront landmark overlooking Mumbai Harbour.",source:"https://maharashtratourism.gov.in/",sourceName:"Maharashtra Tourism",latitude:18.9220,longitude:72.8347,heritage:false,tags:["waterfront","harbour"]},
  {id:"burj-khalifa",city:"Dubai",country:"United Arab Emirates",place:"Burj Khalifa",category:"Architecture",description:"Iconic Dubai skyscraper. Consult the official site for visitor experiences and access.",source:"https://www.burjkhalifa.ae/",sourceName:"Burj Khalifa",latitude:25.1972,longitude:55.2744,heritage:false,tags:["uae","skyscraper"]},
  {id:"mount-fuji",city:"Fujinomiya",country:"Japan",place:"Mount Fuji",category:"UNESCO World Heritage",description:"Japan's celebrated mountain and cultural landmark. Conditions and access vary by season.",source:"https://www.japan.travel/en/",sourceName:"Japan National Tourism Organization",latitude:35.3606,longitude:138.7274,heritage:true,tags:["mountain","nature","volcano"]},
  {id:"hiroshima-peace-park",city:"Hiroshima",country:"Japan",place:"Hiroshima Peace Memorial Park",category:"Historic Memorial",description:"Public memorial park dedicated to remembrance and peace.",source:"https://www.city.hiroshima.lg.jp/site/english/",sourceName:"Hiroshima City",latitude:34.3955,longitude:132.4536,heritage:true,tags:["peace memorial","atomic bomb dome"]},
  {id:"fushimi-inari",city:"Kyoto",country:"Japan",place:"Fushimi Inari Taisha",category:"Historic Shrine",description:"Famous Shinto shrine known for its trails and rows of torii gates.",source:"https://inari.jp/en/",sourceName:"Fushimi Inari Taisha",latitude:34.9671,longitude:135.7727,heritage:false,tags:["shrine","torii","kyoto"]},
  {id:"itsukushima",city:"Hatsukaichi",country:"Japan",place:"Itsukushima Shrine and Torii Gate",category:"UNESCO World Heritage",description:"Shrine and celebrated torii gate on Miyajima Island; check ferry and tide conditions.",source:"https://www.itsukushimajinja.jp/en/",sourceName:"Itsukushima Shrine",latitude:34.2959,longitude:132.3198,heritage:true,tags:["miyajima","shrine","torii"]},
  {id:"christ-the-redeemer",city:"Rio de Janeiro",country:"Brazil",place:"Christ the Redeemer",category:"Monument",description:"Landmark statue overlooking Rio de Janeiro. Check official visitor arrangements before travelling.",source:"https://riotur.rio/",sourceName:"Rio Tourism",latitude:-22.9519,longitude:-43.2105,heritage:false,tags:["statue","monument","mountain"]},
  {id:"sagrada-familia",city:"Barcelona",country:"Spain",place:"Sagrada Família",category:"Historic Basilica",description:"Renowned basilica in Barcelona. Consult the official site for tickets and access.",source:"https://sagradafamilia.org/en/",sourceName:"Sagrada Família",latitude:41.4036,longitude:2.1744,heritage:false,tags:["architecture","gaudi"]},
  {id:"niagara-falls",city:"Niagara Falls",country:"Canada",place:"Niagara Falls",category:"Natural Attraction",description:"Famous waterfall destination shared by Canada and the United States; check local access information.",source:"https://www.niagaraparks.com/",sourceName:"Niagara Parks",latitude:43.0828,longitude:-79.0742,heritage:false,tags:["waterfall","nature"]},
  {id:"acropolis",city:"Athens",country:"Greece",place:"Acropolis of Athens",category:"UNESCO World Heritage",description:"Ancient citadel above Athens, home to the Parthenon and other classical monuments.",source:"https://www.thisisathens.org/",sourceName:"This is Athens",latitude:37.9715,longitude:23.7257,heritage:true,tags:["parthenon","ancient greece"]},
  {id:"petra-treasury",city:"Wadi Musa",country:"Jordan",place:"Petra — Al-Khazneh Treasury",category:"UNESCO World Heritage",description:"Rock-cut monumental facade in the ancient Nabataean city of Petra.",source:"https://visitpetra.jo/",sourceName:"Petra Development and Tourism Region Authority",latitude:30.3285,longitude:35.4444,heritage:true,tags:["petra","treasury","nabataean"]},
  {id:"prague-old-town",city:"Prague",country:"Czechia",place:"Prague Old Town Square",category:"Historic City Centre",description:"Historic square known for its old town buildings and astronomical clock.",source:"https://www.prague.eu/en",sourceName:"Prague City Tourism",latitude:50.0870,longitude:14.4208,heritage:true,tags:["astronomical clock","old town"]},
  {id:"valletta-grand-harbour",city:"Valletta",country:"Malta",place:"Valletta and Grand Harbour",category:"Historic Cityscape",description:"Fortified historic capital and harbour views in Malta.",source:"https://www.visitmalta.com/en/",sourceName:"Visit Malta",latitude:35.8992,longitude:14.5141,heritage:true,tags:["harbour","fortifications"]},
  {id:"cusco-plaza",city:"Cusco",country:"Peru",place:"Cusco Plaza de Armas",category:"Historic City Centre",description:"Central square in the historic Andean city of Cusco.",source:"https://www.peru.travel/en",sourceName:"Peru Travel",latitude:-13.5160,longitude:-71.9785,heritage:true,tags:["plaza mayor","andes"]},
  {id:"st-peters-square",city:"Vatican City",country:"Vatican City",place:"St. Peter's Square",category:"Historic Landmark",description:"Grand public square in Vatican City, beside St. Peter's Basilica.",source:"https://www.vatican.va/",sourceName:"The Holy See",latitude:41.9022,longitude:12.4539,heritage:false,tags:["vatican","basilica","square"]}
];

/*
 * Public camera directories.
 *
 * These links open the providers' own pages. They are not direct
 * video-stream URLs, and this code does not embed or rebroadcast
 * their video. Embed only a camera with explicit provider permission.
 */
const PUBLIC_CAMERA_DIRECTORIES = [
  {
    id: "skyline-unesco",
    name: "UNESCO Live Cameras",
    url: "https://www.skylinewebcams.com/en/live-cams-category/unesco-cams.html",
    description: "Browse the provider's public UNESCO webcam directory."
  },
  {
    id: "live-world-heritage",
    name: "World Heritage Live Cameras",
    url: "https://liveworldwebcams.com/category/themes/world-heritage-sites/",
    description: "Browse public webcam listings related to world heritage."
  },
  {
    id: "heritage-landmarks",
    name: "Heritage and Landmark Cameras",
    url: "https://tripplanning.org/live-cams/categories/heritage-landmarks/",
    description: "Browse the directory for landmark and heritage webcams."
  }
];

const $ = id => document.getElementById(id);

const touristPlaces = $("touristPlaces");
const emptyState = $("emptyState");
const placeSearch = $("placeSearch");
const searchBtn = $("searchBtn");
const clearBtn = $("clearBtn");
const aiSearch = $("aiSearch");
const aiBtn = $("aiBtn");
const aiResult = $("aiResult");
const countrySelect = $("countrySelect");
const citySelect = $("citySelect");
const heritageFilter = $("heritageFilter");
const cityWeather = $("cityWeather");
const weatherBtn = $("weatherBtn");
const sideDots = $("sideDots");
const sidePanel = $("sidePanel");
const scrollTopBtn = $("scrollTopBtn");
const focusSearchBtn = $("focusSearchBtn");
const focusCountryBtn = $("focusCountryBtn");
const closePanelBtn = $("closePanelBtn");

const weatherCache = new Map();
let currentFilteredPlaces = TOURIST_PLACES.slice();

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function mapUrl(place) {
  const lat = Number(place.latitude);
  const lon = Number(place.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }

  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=15/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function getSelectedCityRecord() {
  const city = citySelect && citySelect.value;
  const country = countrySelect && countrySelect.value;

  if (!city || !country) return null;

  return TOURIST_PLACES.find(
    place => place.city === city && place.country === country
  ) || null;
}

function initializeLocationSelectors() {
  if (!countrySelect || !citySelect) return;

  const countries = uniqueSorted(
    TOURIST_PLACES.map(place => place.country)
  );

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  citySelect.innerHTML =
    '<option value="">Choose a country first</option>';

  citySelect.disabled = true;

  if (weatherBtn) weatherBtn.disabled = true;

  countrySelect.addEventListener("change", () => {
    const country = countrySelect.value;

    citySelect.replaceChildren();

    if (!country) {
      citySelect.disabled = true;
      citySelect.add(new Option("Choose a country first", ""));

      if (weatherBtn) weatherBtn.disabled = true;

      if (cityWeather) {
        cityWeather.textContent =
          "Select a country and city to load current weather.";
      }

      applyFilters();
      return;
    }

    citySelect.disabled = false;
    citySelect.add(new Option("Select a city", ""));

    uniqueSorted(
      TOURIST_PLACES
        .filter(place => place.country === country)
        .map(place => place.city)
    ).forEach(city => {
      citySelect.add(new Option(city, city));
    });

    if (weatherBtn) weatherBtn.disabled = true;

    if (cityWeather) {
      cityWeather.textContent =
        `Choose a city in ${country} to load its current weather.`;
    }

    applyFilters();
  });

  citySelect.addEventListener("change", () => {
    if (weatherBtn) {
      weatherBtn.disabled = !citySelect.value;
    }

    const place = getSelectedCityRecord();

    if (cityWeather) {
      cityWeather.textContent = place
        ? `Selected city: ${place.city}, ${place.country}. Press “Load City Weather” for current conditions.`
        : "Choose a city to load its current weather.";
    }

    applyFilters();
  });
}

function weatherText(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail"
  };

  return descriptions[Number(code)] || "Weather description unavailable";
}

async function loadWeatherForCoordinates(place, container, button) {
  if (!place || !container) return;

  const latitude = Number(place.latitude);
  const longitude = Number(place.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    container.textContent =
      "Weather coordinates are not available for this city.";
    return;
  }

  const originalButtonText = button ? button.textContent : "";

  if (button) {
    button.disabled = true;
    button.textContent = "Loading weather…";
  }

  container.textContent = "Connecting to Open-Meteo…";

  const key = `${latitude},${longitude}`;

  try {
    let cached = weatherCache.get(key);

    if (!cached || Date.now() - cached.savedAt > 10 * 60 * 1000) {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

      const response = await fetch(url, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(
          `Weather service returned HTTP ${response.status}`
        );
      }

      const json = await response.json();

      if (!json || !json.current) {
        throw new Error("Weather data unavailable");
      }

      cached = {
        json,
        savedAt: Date.now()
      };

      weatherCache.set(key, cached);
    }

    const current = cached.json.current;
    const units = cached.json.current_units || {};

    const value = (field, unitField, fallback) =>
      current[field] !== undefined && current[field] !== null
        ? `${current[field]} ${units[unitField] || fallback}`
        : "Unavailable";

    container.innerHTML =
      `<strong>Conditions:</strong> ${escapeHTML(weatherText(current.weather_code))}<br>` +
      `<strong>Temperature:</strong> ${escapeHTML(value("temperature_2m", "temperature_2m", "°C"))}<br>` +
      `<strong>Feels like:</strong> ${escapeHTML(value("apparent_temperature", "apparent_temperature", "°C"))}<br>` +
      `<strong>Humidity:</strong> ${escapeHTML(value("relative_humidity_2m", "relative_humidity_2m", "%"))}<br>` +
      `<strong>Wind:</strong> ${escapeHTML(value("wind_speed_10m", "wind_speed_10m", "km/h"))}<br>` +
      `<strong>Precipitation:</strong> ${escapeHTML(value("precipitation", "precipitation", "mm"))}<br>` +
      `<strong>Local time:</strong> ${escapeHTML(String(current.time || "Unavailable").replace("T", " "))}<br>` +
      `<strong>Time zone:</strong> ${escapeHTML(cached.json.timezone || "Unavailable")}` +
      `<p class="selection-hint">Source: Open-Meteo. Forecast conditions may change; follow local weather warnings.</p>`;
  } catch (error) {
    console.error("Weather lookup failed", error);

    container.textContent =
      "Live weather could not be loaded. Check the internet connection and try again.";
  } finally {
    if (button) {
      button.disabled = button.classList.contains("card-weather-btn")
        ? false
        : !(citySelect && citySelect.value);

      button.textContent = originalButtonText;
    }
  }
}

if (weatherBtn) {
  weatherBtn.addEventListener("click", () => {
    const place = getSelectedCityRecord();

    if (place) {
      loadWeatherForCoordinates(place, cityWeather, weatherBtn);
    }
  });
}

/*
 * Generate safe links to public camera directories.
 * This function intentionally does not generate iframe embeds.
 */
function publicCameraLinks() {
  return PUBLIC_CAMERA_DIRECTORIES
    .filter(camera => validHttpUrl(camera.url))
    .map(camera => `
      <a
        class="tourist-action-btn tourist-camera-link"
        href="${escapeHTML(camera.url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open ${escapeHTML(camera.name)}"
        title="${escapeHTML(camera.description)}"
      >📹 ${escapeHTML(camera.name)}</a>
    `)
    .join("");
}

function renderPlace(place) {
  if (!touristPlaces) return;

  const card = document.createElement("article");

  card.className = "tourist-card";
  card.dataset.placeId = place.id;

  const map = mapUrl(place);
  const source = validHttpUrl(place.source) ? place.source : null;

  card.innerHTML = `
    <div class="tourist-icon" aria-hidden="true">
      ${place.heritage ? "🏛️" : "🌍"}
    </div>

    <div class="tourist-location">
      📍 ${escapeHTML(place.place)}
    </div>

    <div class="tourist-country">
      ${escapeHTML(place.city)} • ${escapeHTML(place.country)}
    </div>

    <div class="tourist-description">
      ${escapeHTML(place.description)}
    </div>

    <div class="tourist-category">
      Category: ${escapeHTML(place.category)}
    </div>

    ${place.heritage
      ? '<div class="heritage-badge">🏛️ WORLD HERITAGE / HISTORIC SITE</div>'
      : ""}

    <div class="tourist-live-actions">
      ${map
        ? `<a class="tourist-action-btn" href="${escapeHTML(map)}" target="_blank" rel="noopener noreferrer">🗺 Open Map</a>`
        : ""}

      <button class="tourist-action-btn card-weather-btn" type="button">
        🌦 Place Weather
      </button>
    </div>

    <section class="tourist-camera-section" aria-label="Public live cameras">
      <h3>📹 Public Live Cameras</h3>

      <p class="tourist-camera-note">
        Choose a camera directory to check available public webcams.
        A destination may not have an active camera. Video availability
        and embedding permissions are controlled by each provider.
        ALON does not copy or rebroadcast external video.
      </p>

      <div class="tourist-live-actions tourist-camera-actions">
        ${publicCameraLinks()}
      </div>
    </section>

    <div class="tourist-weather card-weather" aria-live="polite"></div>

    ${source
      ? `<a class="official-source" href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer">Open ${escapeHTML(place.sourceName || "Official Source")}</a>`
      : ""}
  `;

  const button = card.querySelector(".card-weather-btn");
  const weather = card.querySelector(".card-weather");

  if (button && weather) {
    button.addEventListener("click", () => {
      loadWeatherForCoordinates(place, weather, button);
    });
  }

  touristPlaces.appendChild(card);
}

function renderPlaces(list) {
  if (!touristPlaces || !emptyState) return;

  touristPlaces.replaceChildren();
  currentFilteredPlaces = list.slice();

  list.forEach(renderPlace);

  emptyState.style.display = list.length ? "none" : "block";

  const count = $("touristCount");

  if (count) {
    count.textContent =
      `${list.length} destination${list.length === 1 ? "" : "s"} shown • ${TOURIST_PLACES.length} directory entries total`;
  }
}

function applyFilters(queryOverride) {
  const query = normalizeSearch(
    queryOverride !== undefined
      ? queryOverride
      : (placeSearch ? placeSearch.value : "")
  );

  const country = countrySelect ? countrySelect.value : "";
  const city = citySelect ? citySelect.value : "";
  const type = heritageFilter ? heritageFilter.value : "all";

  const words = query.split(/\s+/).filter(Boolean);

  const results = TOURIST_PLACES.filter(place => {
    if (country && place.country !== country) return false;
    if (city && place.city !== city) return false;
    if (type === "heritage" && !place.heritage) return false;
    if (type === "tourist" && place.heritage) return false;

    const searchable = normalizeSearch([
      place.id,
      place.city,
      place.country,
      place.place,
      place.category,
      place.description,
      place.sourceName,
      ...(place.tags || [])
    ].join(" "));

    return words.every(word => searchable.includes(word));
  });

  renderPlaces(results);
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => applyFilters());
}

if (placeSearch) {
  placeSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      applyFilters();
    }
  });
}

if (heritageFilter) {
  heritageFilter.addEventListener("change", () => applyFilters());
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (placeSearch) placeSearch.value = "";
    if (aiSearch) aiSearch.value = "";

    if (aiResult) {
      aiResult.style.display = "none";
      aiResult.textContent = "";
    }

    if (countrySelect) countrySelect.value = "";

    if (citySelect) {
      citySelect.replaceChildren(
        new Option("Choose a country first", "")
      );
      citySelect.disabled = true;
    }

    if (weatherBtn) weatherBtn.disabled = true;

    if (cityWeather) {
      cityWeather.textContent =
        "Select a country and city to load current weather.";
    }

    if (heritageFilter) heritageFilter.value = "all";

    applyFilters("");

    if (placeSearch) placeSearch.focus();
  });
}

function aiDiscover(query) {
  const normalized = normalizeSearch(query);

  if (!normalized) {
    return {
      text: "Enter a destination, city or country to search the ALON directory.",
      results: []
    };
  }

  const cleaned = normalized
    .replace(/\b(show me|tourist places|tourist place|world heritage|heritage sites|heritage site|places|place|please|find|search|in|of|for|near|the|give me|list|historic sites|tourist destinations)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const searchTerm = cleaned || normalized;
  const words = searchTerm.split(/\s+/).filter(Boolean);

  const results = TOURIST_PLACES.filter(place => {
    const haystack = normalizeSearch([
      place.city,
      place.country,
      place.place,
      place.category,
      ...(place.tags || [])
    ].join(" "));

    return words.some(word => haystack.includes(word));
  });

  if (results.length) {
    return {
      text: `Directory search found ${results.length} matching destination${results.length === 1 ? "" : "s"}. These entries are from the local ALON directory.`,
      results
    };
  }

  return {
    text: `No matching destination is registered for “${searchTerm}”. This does not mean the place does not exist; it may need a verified directory entry.`,
    results: []
  };
}

function runAiSearch() {
  if (!aiSearch || !aiResult) return;

  const result = aiDiscover(aiSearch.value);

  aiResult.style.display = "block";
  aiResult.textContent = result.text;

  if (placeSearch) {
    placeSearch.value = aiSearch.value;
  }

  if (countrySelect) {
    countrySelect.value = "";
  }

  if (citySelect) {
    citySelect.replaceChildren(
      new Option("Choose a country first", "")
    );
    citySelect.disabled = true;
  }

  if (weatherBtn) {
    weatherBtn.disabled = true;
  }

  if (heritageFilter) {
    heritageFilter.value = "all";
  }

  renderPlaces(result.results);
}

if (aiBtn) {
  aiBtn.addEventListener("click", runAiSearch);
}

if (aiSearch) {
  aiSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      runAiSearch();
    }
  });
}

function setSidePanelOpen(open) {
  if (!sidePanel || !sideDots) return;

  sidePanel.classList.toggle("open", open);
  sideDots.setAttribute("aria-expanded", String(open));
  sidePanel.setAttribute("aria-hidden", String(!open));
}

if (sideDots) {
  sideDots.addEventListener("click", () => {
    setSidePanelOpen(!sidePanel.classList.contains("open"));
  });
}

if (closePanelBtn) {
  closePanelBtn.addEventListener("click", () => {
    setSidePanelOpen(false);
  });
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

if (focusSearchBtn && placeSearch) {
  focusSearchBtn.addEventListener("click", () => {
    setSidePanelOpen(false);
    placeSearch.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    placeSearch.focus({ preventScroll: true });
  });
}

if (focusCountryBtn && countrySelect) {
  focusCountryBtn.addEventListener("click", () => {
    setSidePanelOpen(false);
    countrySelect.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    countrySelect.focus({ preventScroll: true });
  });
}

document.addEventListener("click", event => {
  if (
    sidePanel &&
    sideDots &&
    !sidePanel.contains(event.target) &&
    !sideDots.contains(event.target)
  ) {
    setSidePanelOpen(false);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setSidePanelOpen(false);
  }
});

(function initializeTouristPlaces() {
  if (!touristPlaces || !emptyState) {
    console.error(
      "World Tourist Places: required HTML elements are missing."
    );
    return;
  }

  initializeLocationSelectors();
  renderPlaces(TOURIST_PLACES);

  console.info(
    "ALON HISTORYVERSE 24 World Tourist Places initialized.",
    {
      destinations: TOURIST_PLACES.length,
      heritage: TOURIST_PLACES.filter(place => place.heritage).length,
      weather: "Open-Meteo public API",
      maps: "OpenStreetMap",
      publicCameraDirectories: PUBLIC_CAMERA_DIRECTORIES.length,
      cameraEmbedding: "Only with explicit provider permission"
    }
  );
})();
