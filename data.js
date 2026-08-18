/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/data.js
   CENTRAL DATA ENGINE
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   PROJECT CONFIGURATION
========================================================= */

export const APP_DATA = {

    name:
        "ALON HISTORYVERSE 24",

    shortName:
        "HistoryVerse 24",

    creator:
        "Baba Thecno Guru",

    version:
        "V100",

    defaultLanguage:
        "en",

    supportedInterfaceLanguages: [
        "en",
        "hi"
    ]

};


/* =========================================================
   HOME EXPLORE DATA
========================================================= */

export const EXPLORE_DATA = [

    {
        id: "civilizations",

        route: "civilizations",

        icon: "🏛️",

        title: "Civilizations",

        description:
            "Explore the rise, development and legacy of great civilizations."

    },


    {
        id: "countries",

        route: "countries",

        icon: "🌍",

        title: "Countries",

        description:
            "Discover nations, cultures, people and historical journeys."

    },


    {
        id: "heritage",

        route: "heritage",

        icon: "🏺",

        title: "Heritage",

        description:
            "Explore cultural, historical and natural heritage from around the world."

    },


    {
        id: "timeline",

        route: "timeline",

        icon: "⌛",

        title: "Timeline",

        description:
            "Travel through important moments across human history."

    },


    {
        id: "library",

        route: "library",

        icon: "📚",

        title: "Library",

        description:
            "Explore Departments, Subjects, Books and the Read system."

    },


    {
        id: "discover",

        route: "discover",

        icon: "🔎",

        title: "Discover",

        description:
            "Find new stories, knowledge and historical connections."

    }

];


/* =========================================================
   FEATURED HOME DATA
========================================================= */

export const FEATURED_DATA = [

    {
        id: "human-story",

        route: "articles",

        icon: "📜",

        title: "The Human Story",

        description:
            "Explore historical stories from different eras, regions and cultures."

    },


    {
        id: "ancient-worlds",

        route: "civilizations",

        icon: "🏛️",

        title: "Ancient Worlds",

        description:
            "Discover civilizations that shaped the foundations of human society."

    },


    {
        id: "world-heritage",

        route: "heritage",

        icon: "🏺",

        title: "World Heritage",

        description:
            "Discover cultural traditions, historic places and natural treasures."

    }

];


/* =========================================================
   CIVILIZATIONS
========================================================= */

export const CIVILIZATIONS = [

    {
        id: "indus-valley",

        name: "Indus Valley Civilization",

        period: "c. 3300–1300 BCE",

        region: "South Asia",

        icon: "🏺",

        description:
            "One of the world's earliest urban civilizations, known for planned cities, trade and sophisticated water systems."

    },


    {
        id: "ancient-egypt",

        name: "Ancient Egypt",

        period: "c. 3100–30 BCE",

        region: "North Africa",

        icon: "𓂀",

        description:
            "A civilization along the Nile known for monumental architecture, writing, science and complex religious traditions."

    },


    {
        id: "mesopotamia",

        name: "Mesopotamia",

        period: "c. 3500–539 BCE",

        region: "West Asia",

        icon: "🏛️",

        description:
            "A major center of early urban civilization between the Tigris and Euphrates rivers."

    },


    {
        id: "ancient-greece",

        name: "Ancient Greece",

        period: "c. 800–146 BCE",

        region: "Mediterranean",

        icon: "🏛️",

        description:
            "Known for philosophy, political thought, science, literature, art and architecture."

    },


    {
        id: "roman-civilization",

        name: "Roman Civilization",

        period: "c. 753 BCE–476 CE",

        region: "Europe and Mediterranean",

        icon: "🛡️",

        description:
            "A powerful civilization whose institutions, engineering and culture influenced Europe and the Mediterranean world."

    },


    {
        id: "maurya",

        name: "Maurya Empire",

        period: "c. 322–185 BCE",

        region: "South Asia",

        icon: "🦁",

        description:
            "A major ancient Indian empire associated with Chandragupta Maurya and Emperor Ashoka."

    },


    {
        id: "gupta",

        name: "Gupta Empire",

        period: "c. 320–550 CE",

        region: "South Asia",

        icon: "📜",

        description:
            "A period associated with major developments in mathematics, astronomy, literature and art."

    },


    {
        id: "maya",

        name: "Maya Civilization",

        period: "c. 2000 BCE–16th century CE",

        region: "Mesoamerica",

        icon: "🌄",

        description:
            "A Mesoamerican civilization known for cities, calendars, writing, mathematics and astronomy."

    }

];


/* =========================================================
   COUNTRIES
========================================================= */

export const COUNTRIES = [

    {
        id: "india",

        name: "India",

        nativeName: "भारत",

        region: "Asia",

        icon: "🇮🇳",

        description:
            "A South Asian country with a long and diverse history spanning ancient civilizations, kingdoms, empires and modern India."

    },


    {
        id: "egypt",

        name: "Egypt",

        nativeName: "مصر",

        region: "Africa",

        icon: "🇪🇬",

        description:
            "A country centered around the Nile with a rich ancient and modern historical heritage."

    },


    {
        id: "greece",

        name: "Greece",

        nativeName: "Ελλάδα",

        region: "Europe",

        icon: "🇬🇷",

        description:
            "A Mediterranean country with a major legacy in philosophy, democracy, art and ancient civilization."

    },


    {
        id: "italy",

        name: "Italy",

        nativeName: "Italia",

        region: "Europe",

        icon: "🇮🇹",

        description:
            "A European country closely connected with the Roman world, Renaissance and major cultural movements."

    },


    {
        id: "china",

        name: "China",

        nativeName: "中国",

        region: "Asia",

        icon: "🇨🇳",

        description:
            "A civilization and country with thousands of years of recorded history and rich cultural traditions."

    },


    {
        id: "japan",

        name: "Japan",

        nativeName: "日本",

        region: "Asia",

        icon: "🇯🇵",

        description:
            "An East Asian island country with a distinctive historical, cultural and technological development."

    },


    {
        id: "united-kingdom",

        name: "United Kingdom",

        nativeName: "United Kingdom",

        region: "Europe",

        icon: "🇬🇧",

        description:
            "A country with a complex history involving England, Scotland, Wales and Northern Ireland."

    },


    {
        id: "mexico",

        name: "Mexico",

        nativeName: "México",

        region: "North America",

        icon: "🇲🇽",

        description:
            "A country shaped by ancient Mesoamerican civilizations, colonial history and modern cultural traditions."

    }

];


/* =========================================================
   HERITAGE
========================================================= */

export const HERITAGE = [

    {
        id: "taj-mahal",

        title: "Taj Mahal",

        country: "India",

        type: "Cultural Heritage",

        icon: "🏛️",

        description:
            "A historic monument in Agra renowned for its architecture and cultural significance."

    },


    {
        id: "pyramids-giza",

        title: "Pyramids of Giza",

        country: "Egypt",

        type: "Ancient Heritage",

        icon: "🔺",

        description:
            "Monumental pyramids on the Giza plateau representing one of the world's most famous ancient landscapes."

    },


    {
        id: "acropolis",

        title: "Acropolis of Athens",

        country: "Greece",

        type: "Cultural Heritage",

        icon: "🏛️",

        description:
            "An ancient citadel containing important monuments of classical Greek architecture."

    },


    {
        id: "great-wall",

        title: "Great Wall",

        country: "China",

        type: "Historic Heritage",

        icon: "🧱",

        description:
            "A vast system of fortifications built and expanded across different periods of Chinese history."

    }

];


/* =========================================================
   TIMELINE
========================================================= */

export const TIMELINE_DATA = [

    {
        id: "early-civilization",

        year: "c. 3500 BCE",

        title: "Early Urban Civilizations",

        description:
            "Large settlements and early cities developed in regions including Mesopotamia and the Indus Valley."

    },


    {
        id: "writing",

        year: "c. 3200 BCE",

        title: "Early Writing Systems",

        description:
            "Writing systems emerged in several ancient societies, transforming administration and the preservation of knowledge."

    },


    {
        id: "pyramids",

        year: "c. 2600 BCE",

        title: "Great Pyramid Era",

        description:
            "The monumental pyramid-building tradition reached an extraordinary scale in ancient Egypt."

    },


    {
        id: "buddha",

        year: "c. 5th century BCE",

        title: "Age of Philosophical Traditions",

        description:
            "Major philosophical and religious traditions developed across South and East Asia and the Mediterranean world."

    },


    {
        id: "ashoka",

        year: "3rd century BCE",

        title: "Ashoka",

        description:
            "The Mauryan emperor Ashoka became associated with the spread of Buddhism and a major imperial transformation."

    },


    {
        id: "roman",

        year: "1st century BCE–1st century CE",

        title: "Roman Expansion",

        description:
            "Rome became a dominant political and cultural power across much of the Mediterranean world."

    },


    {
        id: "renaissance",

        year: "14th–17th centuries",

        title: "Renaissance",

        description:
            "A major European cultural movement transformed art, scholarship, science and intellectual life."

    },


    {
        id: "industrial",

        year: "18th–19th centuries",

        title: "Industrial Revolution",

        description:
            "Industrialization transformed manufacturing, transportation, cities and global economic systems."

    },


    {
        id: "digital",

        year: "20th–21st centuries",

        title: "Digital Age",

        description:
            "Computing, telecommunications and the internet transformed how humanity creates, stores and shares knowledge."

    }

];


/* =========================================================
   LIBRARY DEPARTMENTS
========================================================= */

export const LIBRARY_DEPARTMENTS = [

    {
        id: "ancient-history",

        title: "Ancient History",

        icon: "🏺",

        description:
            "Ancient civilizations, societies, cultures and historical sources."

    },


    {
        id: "medieval-history",

        title: "Medieval History",

        icon: "🏰",

        description:
            "Kingdoms, empires, societies and cultures of the medieval world."

    },


    {
        id: "modern-history",

        title: "Modern History",

        icon: "🌐",

        description:
            "Modern nations, political transformations and global historical developments."

    },


    {
        id: "culture",

        title: "Culture & Society",

        icon: "🎭",

        description:
            "Languages, traditions, customs, arts and social development."

    },


    {
        id: "science",

        title: "Science & Knowledge",

        icon: "🔬",

        description:
            "Scientific discoveries, inventions, mathematics and intellectual history."

    },


    {
        id: "geography",

        title: "Geography",

        icon: "🗺️",

        description:
            "Places, landscapes, regions, maps and the relationship between geography and history."

    }

];


/* =========================================================
   LIBRARY SUBJECTS
========================================================= */

export const LIBRARY_SUBJECTS = [

    {
        id: "archaeology",

        department:
            "ancient-history",

        title: "Archaeology",

        icon: "⛏️",

        description:
            "Study material remains and archaeological evidence from the human past."

    },


    {
        id: "empires",

        department:
            "ancient-history",

        title: "Empires",

        icon: "👑",

        description:
            "Explore major empires and their political, economic and cultural systems."

    },


    {
        id: "religion-history",

        department:
            "culture",

        title: "History of Religions",

        icon: "🕊️",

        description:
            "Explore the historical development and cultural influence of religious traditions."

    },


    {
        id: "language-history",

        department:
            "culture",

        title: "Languages",

        icon: "🔤",

        description:
            "Explore the development, diversity and history of human languages."

    },


    {
        id: "science-history",

        department:
            "science",

        title: "History of Science",

        icon: "🔬",

        description:
            "Discover major scientific ideas, discoveries and the people behind them."

    },


    {
        id: "technology",

        department:
            "science",

        title: "Technology",

        icon: "⚙️",

        description:
            "Explore the evolution of tools, machines, computing and technology."

    }

];


/* =========================================================
   LIBRARY BOOKS
========================================================= */

export const LIBRARY_BOOKS = [

    {
        id: "history-of-indus",

        subject:
            "archaeology",

        title: "The Indus Valley Civilization",

        author: "HistoryVerse Collection",

        icon: "📕",

        description:
            "An introductory historical collection about the Indus Valley Civilization."

    },


    {
        id: "ancient-egypt-book",

        subject:
            "archaeology",

        title: "Ancient Egypt",

        author: "HistoryVerse Collection",

        icon: "📕",

        description:
            "A journey through ancient Egyptian society, monuments and culture."

    },


    {
        id: "great-empires",

        subject:
            "empires",

        title: "Great Empires of History",

        author: "HistoryVerse Collection",

        icon: "📕",

        description:
            "A comparative exploration of major empires across world history."

    },


    {
        id: "history-of-language",

        subject:
            "language-history",

        title: "History of Human Language",

        author: "HistoryVerse Collection",

        icon: "📕",

        description:
            "An introduction to the diversity and development of human languages."

    }

];


/* =========================================================
   SAMPLE READ CONTENT
========================================================= */

export const READ_CONTENT = {

    "history-of-indus": {

        title:
            "The Indus Valley Civilization",

        chapters: [

            {
                id: "chapter-1",

                title:
                    "Origins and Geography",

                content:
                    "The Indus Valley Civilization developed across parts of South Asia and became known for large settlements, organized urban planning, craft production and long-distance trade."
            },


            {
                id: "chapter-2",

                title:
                    "Cities and Architecture",

                content:
                    "Cities such as Harappa and Mohenjo-daro show evidence of carefully planned streets, buildings and water-management systems."
            },


            {
                id: "chapter-3",

                title:
                    "Legacy",

                content:
                    "Archaeological discoveries from the civilization continue to provide important evidence about early urban life in South Asia."
            }

        ]

    },


    "ancient-egypt-book": {

        title:
            "Ancient Egypt",

        chapters: [

            {
                id: "chapter-1",

                title:
                    "The Nile",

                content:
                    "The Nile River was central to agriculture, transportation and settlement in ancient Egypt."
            },


            {
                id: "chapter-2",

                title:
                    "Monuments",

                content:
                    "Ancient Egyptian monuments included temples, tombs and pyramids built over many centuries."
            }

        ]

    }

};


/* =========================================================
   HOME DATA ACCESS
========================================================= */

export function getHomeData() {

    return {

        explore:
            EXPLORE_DATA,

        featured:
            FEATURED_DATA

    };

}


export function getExploreData() {

    return EXPLORE_DATA;

}


/* =========================================================
   GENERAL DATA ACCESSORS
========================================================= */

export function getCivilizations() {

    return [
        ...CIVILIZATIONS
    ];

}


export function getCountries() {

    return [
        ...COUNTRIES
    ];

}


export function getHeritage() {

    return [
        ...HERITAGE
    ];

}


export function getTimeline() {

    return [
        ...TIMELINE_DATA
    ];

}


export function getLibraryDepartments() {

    return [
        ...LIBRARY_DEPARTMENTS
    ];

}


export function getLibrarySubjects(
    departmentId = null
) {

    const subjects =
        [...LIBRARY_SUBJECTS];


    if (!departmentId) {

        return subjects;

    }


    return subjects.filter(
        subject =>
            subject.department ===
            departmentId
    );

}


export function getLibraryBooks(
    subjectId = null
) {

    const books =
        [...LIBRARY_BOOKS];


    if (!subjectId) {

        return books;

    }


    return books.filter(
        book =>
            book.subject ===
            subjectId
    );

}


export function getReadContent(
    bookId
) {

    return (
        READ_CONTENT[bookId] ||
        null
    );

}


/* =========================================================
   UNIVERSAL SEARCH
========================================================= */

export function searchHistoryVerse(
    query
) {

    const term =
        String(query || "")
            .trim()
            .toLowerCase();


    if (!term) {

        return [];

    }


    const collections = [

        ...CIVILIZATIONS.map(
            item => ({
                ...item,
                type: "civilization",
                route: "civilizations"
            })
        ),

        ...COUNTRIES.map(
            item => ({
                ...item,
                type: "country",
                route: "countries"
            })
        ),

        ...HERITAGE.map(
            item => ({
                ...item,
                type: "heritage",
                route: "heritage"
            })
        ),

        ...LIBRARY_BOOKS.map(
            item => ({
                ...item,
                type: "book",
                route: "books"
            })
        )

    ];


    return collections.filter(
        item => {

            const searchableText =
                [

                    item.title,

                    item.name,

                    item.nativeName,

                    item.description,

                    item.region,

                    item.country,

                    item.author

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


            return searchableText.includes(
                term
            );

        }
    );

}


/* =========================================================
   DATA VERSION
========================================================= */

export const DATA_VERSION =
    "ALON-HISTORYVERSE-DATA-100";