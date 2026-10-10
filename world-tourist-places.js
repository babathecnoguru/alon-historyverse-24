/*
============================================================
 ALON HISTORYVERSE 24
 WORLD TOURIST PLACES
 File: world-tourist-places.js
 Version: 1.0.0
 Owner: Baba Thecno Guru

 FEATURES
 -----------------------------------------------------------
 1. Verified public tourist-place directory
 2. Search by place, city, country and category
 3. AI-style local directory discovery
 4. Live weather using Open-Meteo
 5. Public map links using OpenStreetMap
 6. Official source links
 7. Optional authorized live-camera links
 8. Mobile-friendly results
 9. Safe HTML rendering
 10. No API key required for Open-Meteo's public endpoints

 IMPORTANT
 -----------------------------------------------------------
 Weather and maps require internet access.
 Live cameras appear only for entries with a configured,
 verified public camera URL. This file does not invent
 camera feeds or bypass access restrictions.
============================================================
*/

"use strict";

/* =========================================================
   VERIFIED PUBLIC DESTINATION DIRECTORY

   Camera links are intentionally empty until verified.
   Coordinates identify public tourist destinations.
========================================================= */

const TOURIST_PLACES = [
    {
        id: "eiffel-tower",
        city: "Paris",
        country: "France",
        place: "Eiffel Tower",
        category: "Landmark",
        description: "Famous Paris landmark with visitor information and views across the city.",
        source: "https://www.toureiffel.paris/en",
        sourceName: "Official Eiffel Tower",
        latitude: 48.8584,
        longitude: 2.2945,
        tags: ["paris", "france", "tower", "landmark", "europe"]
    },
    {
        id: "colosseum",
        city: "Rome",
        country: "Italy",
        place: "Colosseum",
        category: "Historical Monument",
        description: "Ancient Roman amphitheatre. Check official visitor information before travelling.",
        source: "https://colosseo.it/en/",
        sourceName: "Colosseum Archaeological Park",
        latitude: 41.8902,
        longitude: 12.4922,
        tags: ["rome", "italy", "history", "ancient", "monument"]
    },
    {
        id: "statue-of-liberty",
        city: "New York",
        country: "United States",
        place: "Statue of Liberty",
        category: "Monument",
        description: "Historic monument in New York Harbor with official visitor and park information.",
        source: "https://www.nps.gov/stli/index.htm",
        sourceName: "US National Park Service",
        latitude: 40.6892,
        longitude: -74.0445,
        tags: ["new york", "usa", "united states", "liberty", "monument"]
    },
    {
        id: "sydney-opera-house",
        city: "Sydney",
        country: "Australia",
        place: "Sydney Opera House",
        category: "Architecture",
        description: "Landmark performing arts venue. Explore official visits, performances and events.",
        source: "https://www.sydneyoperahouse.com/",
        sourceName: "Sydney Opera House",
        latitude: -33.8568,
        longitude: 151.2153,
        tags: ["sydney", "australia", "opera", "harbour", "architecture"]
    },
    {
        id: "taj-mahal",
        city: "Agra",
        country: "India",
        place: "Taj Mahal",
        category: "World Heritage Monument",
        description: "World-famous Mughal-era monument. Verify current visiting rules and timings before travel.",
        source: "https://asi.nic.in/",
        sourceName: "Archaeological Survey of India",
        latitude: 27.1751,
        longitude: 78.0421,
        tags: ["agra", "india", "taj", "heritage", "history"]
    },
    {
        id: "gateway-of-india",
        city: "Mumbai",
        country: "India",
        place: "Gateway of India",
        category: "Landmark",
        description: "Popular public waterfront landmark in Mumbai.",
        source: "https://maharashtratourism.gov.in/",
        sourceName: "Maharashtra Tourism",
        latitude: 18.9220,
        longitude: 72.8347,
        tags: ["mumbai", "india", "gateway", "waterfront"]
    },
    {
        id: "burj-khalifa",
        city: "Dubai",
        country: "United Arab Emirates",
        place: "Burj Khalifa",
        category: "Architecture",
        description: "Iconic Dubai skyscraper. Consult the official site for visitor experiences and access.",
        source: "https://www.burjkhalifa.ae/",
        sourceName: "Burj Khalifa",
        latitude: 25.1972,
        longitude: 55.2744,
        tags: ["dubai", "uae", "united arab emirates", "skyscraper"]
    },
    {
        id: "mount-fuji",
        city: "Fujinomiya",
        country: "Japan",
        place: "Mount Fuji",
        category: "Natural Landmark",
        description: "Japan's celebrated mountain. Conditions, access and climbing rules vary by season.",
        source: "https://www.japan.travel/en/",
        sourceName: "Japan National Tourism Organization",
        latitude: 35.3606,
        longitude: 138.7274,
        tags: ["japan", "fuji", "mountain", "nature", "volcano"]
    },
    {
        id: "times-square",
        city: "New York",
        country: "United States",
        place: "Times Square",
        category: "Public Square",
        description: "Famous Manhattan public entertainment district.",
        source: "https://www.timessquarenyc.org/",
        sourceName: "Times Square Alliance",
        latitude: 40.7580,
        longitude: -73.9855,
        tags: ["new york", "usa", "manhattan", "square", "city"]
    },
    {
        id: "christ-the-redeemer",
        city: "Rio de Janeiro",
        country: "Brazil",
        place: "Christ the Redeemer",
        category: "Monument",
        description: "Landmark statue overlooking Rio de Janeiro. Check official visitor arrangements before travelling.",
        source: "https://riotur.rio/",
        sourceName: "Rio Tourism",
        latitude: -22.9519,
        longitude: -43.2105,
        tags: ["rio", "brazil", "statue", "monument", "mountain"]
    },
    {
        id: "sagrada-familia",
        city: "Barcelona",
        country: "Spain",
        place: "Sagrada Família",
        category: "Architecture",
        description: "Renowned basilica in Barcelona. Consult the official site for tickets and access.",
        source: "https://sagradafamilia.org/en/",
        sourceName: "Sagrada Família",
        latitude: 41.4036,
        longitude: 2.1744,
        tags: ["barcelona", "spain", "basilica", "architecture"]
    },
    {
        id: "niagara-falls",
        city: "Niagara Falls",
        country: "Canada",
        place: "Niagara Falls",
        category: "Natural Attraction",
        description: "Famous waterfall destination. Check official local visitor information for current access.",
        source: "https://www.niagaraparks.com/",
        sourceName: "Niagara Parks",
        latitude: 43.0828,
        longitude: -79.0742,
        tags: ["canada", "waterfall", "nature", "niagara"]
    }
];


/* =========================================================
   OPTIONAL AUTHORIZED LIVE CAMERAS

   Add a camera only after checking that the source is
   public and the provider permits the intended linking.

   Example:
   {
       placeId: "times-square",
       url: "VERIFIED_PUBLIC_CAMERA_URL",
       sourceName: "Camera Provider"
   }

   Do not add private, restricted or unauthorized feeds.
========================================================= */

const TOURIST_LIVE_CAMERAS = [];


/* =========================================================
   ELEMENT REFERENCES
========================================================= */

const touristPlaces =
    document.getElementById("touristPlaces");

const emptyState =
    document.getElementById("emptyState");

const placeSearch =
    document.getElementById("placeSearch");

const searchBtn =
    document.getElementById("searchBtn");

const clearBtn =
    document.getElementById("clearBtn");

const aiSearch =
    document.getElementById("aiSearch");

const aiBtn =
    document.getElementById("aiBtn");

const aiResult =
    document.getElementById("aiResult");

const sideDots =
    document.getElementById("sideDots");

const sidePanel =
    document.getElementById("sidePanel");

const scrollTopBtn =
    document.getElementById("scrollTopBtn");

const focusSearchBtn =
    document.getElementById("focusSearchBtn");

const closePanelBtn =
    document.getElementById("closePanelBtn");


/* =========================================================
   INITIALIZATION CHECK
========================================================= */

if (!touristPlaces || !emptyState) {
    console.error(
        "World Tourist Places: required HTML elements are missing."
    );
}


/* =========================================================
   ADDITIONAL STYLES

   Existing HTML and CSS remain untouched.
========================================================= */

(function addTouristStyles() {
    if (document.getElementById("touristLiveStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "touristLiveStyles";

    style.textContent = `
        .tourist-live-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
        }

        .tourist-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 9px 12px;
            border: 1px solid rgba(215,179,90,.35);
            border-radius: 10px;
            color: #f0d27a;
            background: rgba(215,179,90,.07);
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }

        .tourist-action-btn:hover {
            background: rgba(215,179,90,.16);
        }

        .tourist-weather {
            display: none;
            margin-top: 13px;
            padding: 12px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 12px;
            color: #c9ced7;
            background: rgba(0,0,0,.2);
            font-size: 12px;
            line-height: 1.7;
        }

        .tourist-weather strong {
            color: #f0d27a;
        }

        .tourist-weather-error {
            color: #e9a7a7;
        }

        .tourist-live-status {
            margin-top: 10px;
            color: #8f9aaa;
            font-size: 11px;
            line-height: 1.5;
        }

        .tourist-count {
            width: min(1400px, 94%);
            margin: 0 auto 15px;
            color: #929baa;
            font-size: 12px;
        }

        .tourist-camera-note {
            margin-top: 12px;
            color: #929baa;
            font-size: 11px;
            line-height: 1.6;
        }
    `;

    document.head.appendChild(style);
})();


/* =========================================================
   SAFE TEXT HELPERS
========================================================= */

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


function isValidHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" ||
               url.protocol === "http:";
    } catch {
        return false;
    }
}


function safeExternalUrl(value) {
    return isValidHttpUrl(value)
        ? value
        : "#";
}


/* =========================================================
   CAMERA LOOKUP
========================================================= */

function getAuthorizedCamera(placeId) {
    return TOURIST_LIVE_CAMERAS.find(camera =>
        camera.placeId === placeId &&
        isValidHttpUrl(camera.url)
    ) || null;
}


/* =========================================================
   MAP URL
========================================================= */

function getMapUrl(place) {
    const lat = Number(place.latitude);
    const lon = Number(place.longitude);

    if (!Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 || lat > 90 ||
        lon < -180 || lon > 180) {
        return null;
    }

    return (
        "https://www.openstreetmap.org/" +
        "?mlat=" + encodeURIComponent(lat) +
        "&mlon=" + encodeURIComponent(lon) +
        "#map=15/" + encodeURIComponent(lat) +
        "/" + encodeURIComponent(lon)
    );
}


/* =========================================================
   WEATHER HELPERS
   Open-Meteo public API. No API key is configured here.
========================================================= */

const weatherCache = new Map();

function weatherDescription(code) {
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

    return descriptions[Number(code)] ||
        "Weather description unavailable";
}


function showWeatherMessage(container, message, isError) {
    container.style.display = "block";
    container.classList.toggle(
        "tourist-weather-error",
        Boolean(isError)
    );
    container.textContent = message;
}


async function loadLiveWeather(place, container, button) {
    if (!container || !button) return;

    const latitude = Number(place.latitude);
    const longitude = Number(place.longitude);

    if (!Number.isFinite(latitude) ||
        !Number.isFinite(longitude)) {
        showWeatherMessage(
            container,
            "Weather is unavailable because this destination has no verified coordinates.",
            true
        );
        return;
    }

    button.disabled = true;
    button.textContent = "Loading weather…";
    container.style.display = "block";
    container.classList.remove("tourist-weather-error");
    container.textContent = "Connecting to the weather service…";

    const cacheKey = place.id;
    const cached = weatherCache.get(cacheKey);

    try {
        let data;

        if (cached && Date.now() - cached.time < 10 * 60 * 1000) {
            data = cached.data;
        } else {
            const url =
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=" + encodeURIComponent(latitude) +
                "&longitude=" + encodeURIComponent(longitude) +
                "&current=temperature_2m,relative_humidity_2m," +
                "apparent_temperature,is_day,precipitation," +
                "weather_code,wind_speed_10m" +
                "&timezone=auto";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(
                    "Weather service returned HTTP " +
                    response.status
                );
            }

            data = await response.json();

            if (!data || !data.current) {
                throw new Error("Weather data is unavailable.");
            }

            weatherCache.set(cacheKey, {
                time: Date.now(),
                data
            });
        }

        const current = data.current;
        const units = data.current_units || {};

        const temperature =
            Number.isFinite(Number(current.temperature_2m))
                ? Number(current.temperature_2m) + " " +
                  (units.temperature_2m || "°C")
                : "Unavailable";

        const feelsLike =
            Number.isFinite(Number(current.apparent_temperature))
                ? Number(current.apparent_temperature) + " " +
                  (units.apparent_temperature || "°C")
                : "Unavailable";

        const humidity =
            Number.isFinite(Number(current.relative_humidity_2m))
                ? Number(current.relative_humidity_2m) + "%"
                : "Unavailable";

        const wind =
            Number.isFinite(Number(current.wind_speed_10m))
                ? Number(current.wind_speed_10m) + " " +
                  (units.wind_speed_10m || "km/h")
                : "Unavailable";

        const precipitation =
            Number.isFinite(Number(current.precipitation))
                ? Number(current.precipitation) + " " +
                  (units.precipitation || "mm")
                : "Unavailable";

        const localTime = current.time
            ? String(current.time).replace("T", " ") +
              (data.timezone ? " (" + data.timezone + ")" : "")
            : "Time unavailable";

        container.innerHTML = `
            <strong>🌦 Current Weather</strong>
            <br>
            <strong>Conditions:</strong>
            ${escapeHTML(weatherDescription(current.weather_code))}
            <br>
            <strong>Temperature:</strong>
            ${escapeHTML(temperature)}
            <br>
            <strong>Feels like:</strong>
            ${escapeHTML(feelsLike)}
            <br>
            <strong>Humidity:</strong>
            ${escapeHTML(humidity)}
            <br>
            <strong>Wind:</strong>
            ${escapeHTML(wind)}
            <br>
            <strong>Precipitation:</strong>
            ${escapeHTML(precipitation)}
            <br>
            <strong>Local observation time:</strong>
            ${escapeHTML(localTime)}
            <div class="tourist-live-status">
                Source: Open-Meteo. Weather may change; check
                local authorities before outdoor activities.
            </div>
        `;

        container.classList.remove("tourist-weather-error");
        container.style.display = "block";

    } catch (error) {
        console.error(
            "Weather lookup failed for " + place.id,
            error
        );

        showWeatherMessage(
            container,
            "Live weather could not be loaded. Check your internet connection and try again.",
            true
        );
    } finally {
        button.disabled = false;
        button.textContent = "🌦 Live Weather";
    }
}


/* =========================================================
   CREATE TOURIST CARD
========================================================= */

function renderTouristPlace(place) {
    const card = document.createElement("article");
    card.className = "tourist-card";
    card.dataset.placeId = place.id;

    card.dataset.city = normalizeSearch(place.city);
    card.dataset.country = normalizeSearch(place.country);

    const mapUrl = getMapUrl(place);
    const camera = getAuthorizedCamera(place.id);

    const safePlace = escapeHTML(place.place);
    const safeCity = escapeHTML(place.city);
    const safeCountry = escapeHTML(place.country);
    const safeCategory = escapeHTML(place.category);
    const safeDescription = escapeHTML(place.description);
    const safeSourceName = escapeHTML(place.sourceName);

    const sourceUrl = safeExternalUrl(place.source);

    card.innerHTML = `
        <div class="tourist-icon" aria-hidden="true">🌍</div>

        <div class="tourist-location">
            📍 ${safePlace}
        </div>

        <div class="tourist-country">
            ${safeCity} • ${safeCountry}
        </div>

        <div class="tourist-description">
            ${safeDescription}
        </div>

        <div class="tourist-category">
            Category: ${safeCategory}
        </div>

        <div class="tourist-live-actions">
            ${
                mapUrl
                    ? `<a class="tourist-action-btn"
                         href="${escapeHTML(mapUrl)}"
                         target="_blank"
                         rel="noopener noreferrer">
                         🗺 Open Map
                       </a>`
                    : ""
            }

            <button class="tourist-action-btn weather-btn"
                    type="button">
                🌦 Live Weather
            </button>

            ${
                camera
                    ? `<a class="tourist-action-btn"
                         href="${escapeHTML(camera.url)}"
                         target="_blank"
                         rel="noopener noreferrer">
                         📹 Official Live Camera
                       </a>`
                    : ""
            }
        </div>

        <div class="tourist-weather"
             aria-live="polite"></div>

        ${
            camera
                ? `<div class="tourist-camera-note">
                    Camera source: ${escapeHTML(camera.sourceName)}.
                    Opens on the provider's website.
                   </div>`
                : `<div class="tourist-camera-note">
                    No verified live camera is configured for this
                    destination yet.
                   </div>`
        }

        <a class="official-source"
           href="${escapeHTML(sourceUrl)}"
           target="_blank"
           rel="noopener noreferrer">
            Open ${safeSourceName}
        </a>
    `;

    const weatherButton = card.querySelector(".weather-btn");
    const weatherContainer = card.querySelector(".tourist-weather");

    weatherButton.addEventListener("click", () => {
        loadLiveWeather(
            place,
            weatherContainer,
            weatherButton
        );
    });

    touristPlaces.appendChild(card);
}


/* =========================================================
   RENDER DIRECTORY
========================================================= */

function renderTouristPlaces(list) {
    if (!touristPlaces || !emptyState) return;

    touristPlaces.replaceChildren();

    if (!list.length) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    const fragment = document.createDocumentFragment();

    list.forEach(place => {
        renderTouristPlace(place);
    });

    const count = document.getElementById("touristCount");

    if (count) {
        count.textContent =
            list.length + " public tourist destination" +
            (list.length === 1 ? "" : "s") + " listed";
    }
}


/* =========================================================
   SEARCH DIRECTORY
========================================================= */

function searchTouristPlaces(query) {
    const search = normalizeSearch(query);

    if (!search) {
        renderTouristPlaces(TOURIST_PLACES);
        return;
    }

    const words = search.split(/\s+/).filter(Boolean);

    const results = TOURIST_PLACES.filter(place => {
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

    renderTouristPlaces(results);
}


if (searchBtn && placeSearch) {
    searchBtn.addEventListener("click", () => {
        searchTouristPlaces(placeSearch.value);
    });

    placeSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            searchTouristPlaces(placeSearch.value);
        }
    });
}


if (clearBtn && placeSearch) {
    clearBtn.addEventListener("click", () => {
        placeSearch.value = "";

        if (aiSearch) aiSearch.value = "";

        if (aiResult) {
            aiResult.style.display = "none";
            aiResult.textContent = "";
        }

        renderTouristPlaces(TOURIST_PLACES);
        placeSearch.focus();
    });
}


/* =========================================================
   AI-STYLE DIRECTORY DISCOVERY

   This searches the local directory; it is not a remote
   generative AI service and does not invent results.
========================================================= */

function aiDiscover(query) {
    const normalized = normalizeSearch(query);

    if (!normalized) {
        return {
            text:
                "Enter a destination, city or country. This search checks the ALON verified tourist-place directory.",
            results: []
        };
    }

    const cleaned = normalized
        .replace(/\b(show me|tourist places|tourist place|places|place|please|find|search|in|of|for|near|the|give me|list)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const searchTerm = cleaned || normalized;

    const words = searchTerm.split(/\s+/).filter(Boolean);

    const results = TOURIST_PLACES.filter(place => {
        const searchable = normalizeSearch([
            place.city,
            place.country,
            place.place,
            place.category,
            ...(place.tags || [])
        ].join(" "));

        return words.some(word => searchable.includes(word));
    });

    if (results.length) {
        return {
            text:
                "Directory search found " + results.length +
                " matching destination" +
                (results.length === 1 ? "" : "s") +
                ". These results come from the local ALON directory.",
            results
        };
    }

    return {
        text:
            'No matching destination is registered for "' +
            searchTerm +
            '". This does not mean the place does not exist. ' +
            "The directory may need a verified entry added.",
        results: []
    };
}


function runAiSearch() {
    if (!aiSearch || !aiResult) return;

    const result = aiDiscover(aiSearch.value);

    aiResult.style.display = "block";
    aiResult.textContent = result.text;

    renderTouristPlaces(result.results);
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


/* =========================================================
   SIDE MENU
========================================================= */

function setSidePanelOpen(open) {
    if (!sidePanel || !sideDots) return;

    sidePanel.classList.toggle("open", open);

    sideDots.setAttribute(
        "aria-expanded",
        String(open)
    );

    sidePanel.setAttribute(
        "aria-hidden",
        String(!open)
    );
}


if (sideDots) {
    sideDots.addEventListener("click", () => {
        const isOpen = sidePanel
            ? !sidePanel.classList.contains("open")
            : false;

        setSidePanelOpen(isOpen);
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

        placeSearch.focus({
            preventScroll: true
        });
    });
}


document.addEventListener("click", event => {
    if (!sidePanel || !sideDots) return;

    const clickedInsidePanel =
        sidePanel.contains(event.target);

    const clickedDots =
        sideDots.contains(event.target);

    if (!clickedInsidePanel && !clickedDots) {
        setSidePanelOpen(false);
    }
});


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        setSidePanelOpen(false);
    }
});


/* =========================================================
   INITIAL LOAD
========================================================= */

(function initializeTouristPlaces() {
    if (!touristPlaces || !emptyState) return;

    renderTouristPlaces(TOURIST_PLACES);

    console.info(
        "ALON HISTORYVERSE 24 World Tourist Places initialized.",
        {
            destinations: TOURIST_PLACES.length,
            weather: "Open-Meteo public API",
            maps: "OpenStreetMap",
            verifiedCameraLinks: TOURIST_LIVE_CAMERAS.length
        }
    );
})();