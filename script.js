/* =====================================================
   CINEMA MELLA - PUBLIC WEBSITE
   NO DATABASE CHANGE VERSION
   Uses only existing "contents" table
===================================================== */

const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";

const publicSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =====================================================
   GLOBAL DATA
===================================================== */

let databaseContents = [];

let featuredItems = [];
let featuredIndex = 0;
let featuredTimer = null;

let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;


const TYPE_LABELS = {

    movie: "Movie",

    natok: "Natok",

    series: "Web Series",

    upcoming: "Upcoming",

    story: "Story",

    book: "Book",

    tutorial: "Tutorial"

};


const TYPE_SECTIONS = {

    movie: "movies",

    natok: "natok",

    series: "webseries",

    upcoming: "upcoming",

    story: "stories",

    book: "books",

    tutorial: "tutorial"

};


const HERO_SEQUENCE = [

    "movie",

    "natok",

    "series",

    "upcoming",

    "story",

    "book",

    "tutorial"

];


const activeGenreFilters = {

    movie: "all",

    natok: "all",

    series: "all",

    upcoming: "all",

    story: "all",

    book: "all",

    tutorial: "all"

};


/* =====================================================
   DOM ELEMENTS
===================================================== */

const heroBackground =
    document.getElementById(
        "heroBackground"
    );


const heroDotsContainer =
    document.getElementById(
        "heroDots"
    );


const searchToggle =
    document.getElementById(
        "searchToggle"
    );


const searchBox =
    document.getElementById(
        "searchBox"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchClose =
    document.getElementById(
        "searchClose"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const mobileNav =
    document.getElementById(
        "mobileNav"
    );


/* =====================================================
   LOGO ANIMATION
===================================================== */

const logoWords = [

    "MELLA",

    "HUB"

];


let logoIndex = 0;


setInterval(
    () => {

        logoIndex =
            (
                logoIndex + 1
            )
            %
            logoWords.length;


        document
            .querySelectorAll(
                ".logo-changing"
            )
            .forEach(
                logo => {

                    logo.style.opacity =
                        "0";


                    logo.style.transform =
                        "translateY(5px)";


                    setTimeout(
                        () => {

                            logo.textContent =
                                logoWords[
                                    logoIndex
                                ];


                            logo.style.opacity =
                                "1";


                            logo.style.transform =
                                "translateY(0)";

                        },
                        300
                    );

                }
            );

    },
    2500
);


/* =====================================================
   LOAD CONTENT
===================================================== */

async function loadWebsiteContents() {

    try {

        const {
            data,
            error
        } =
            await publicSupabase
                .from(
                    "contents"
                )
                .select(
                    "*"
                )
                .eq(
                    "status",
                    "published"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        databaseContents =
            data || [];


        createCategoryDropdowns();

        renderCategoryDropdowns();

        createFeaturedSection();

        renderAllSections();

        setupFeaturedSlider();

        setupDynamicHero();

    }

    catch (error) {

        console.error(
            "Supabase Error:",
            error
        );


        showDatabaseError();

    }

}


/* =====================================================
   CATEGORY SYSTEM

   DATABASE CHANGE LAGBE NA

   CATEGORY ASBE contents.genre THEKE

   Example:

   Movie:
   Action
   Horror

   Natok:
   Bangla
   Hindi

   Tutorial:
   SEO
   Coding
   Web Design
===================================================== */

function splitGenres(
    value
) {

    return String(
        value || ""
    )
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(
            Boolean
        );

}


/* =====================================================
   GET UNIQUE GENRES
===================================================== */

function getGenresForType(
    type
) {

    const genres = [];


    databaseContents
        .filter(
            item =>
                item.type === type
        )
        .forEach(
            item => {

                splitGenres(
                    item.genre
                )
                    .forEach(
                        genre => {

                            const exists =
                                genres.some(
                                    current =>
                                        current
                                            .toLowerCase()
                                        ===
                                        genre
                                            .toLowerCase()
                                );


                            if (!exists) {

                                genres.push(
                                    genre
                                );

                            }

                        }
                    );

            }
        );


    return genres.sort(
        (
            a,
            b
        ) =>
            a.localeCompare(
                b
            )
    );

}


/* =====================================================
   CREATE NAV DROPDOWN

   Existing index.html change na korleo JS
   menu create korbe
===================================================== */

function createCategoryDropdowns() {

    const navMenu =
        document.querySelector(
            ".nav-menu"
        );


    if (!navMenu) {

        return;

    }


    const map = {

        "#movies":
            "movie",

        "#natok":
            "natok",

        "#webseries":
            "series",

        "#upcoming":
            "upcoming",

        "#stories":
            "story",

        "#books":
            "book",

        "#tutorial":
            "tutorial"

    };


    Object
        .entries(
            map
        )
        .forEach(
            (
                [
                    href,
                    type
                ]
            ) => {

                const link =
                    navMenu
                        .querySelector(
                            `a.nav-link[href="${href}"]`
                        );


                if (!link) {

                    return;

                }


                if (
                    link
                        .parentElement
                        ?.classList
                        .contains(
                            "nav-category-dropdown"
                        )
                ) {

                    return;

                }


                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    "nav-category-dropdown";


                wrapper.dataset
                    .contentType =
                    type;


                const menu =
                    document.createElement(
                        "div"
                    );


                menu.className =
                    "genre-dropdown-menu";


                menu.innerHTML = `

                    <div
                        class="genre-dropdown-head"
                    >

                        ${escapeHTML(
                            TYPE_LABELS[
                                type
                            ]
                        )}

                    </div>


                    <div
                        class="genre-menu-dynamic"
                    ></div>

                `;


                link.parentNode
                    .insertBefore(
                        wrapper,
                        link
                    );


                wrapper
                    .appendChild(
                        link
                    );


                wrapper
                    .appendChild(
                        menu
                    );

            }
        );

}


/* =====================================================
   RENDER NAV CATEGORIES
===================================================== */

function renderCategoryDropdowns() {

    document
        .querySelectorAll(
            ".nav-category-dropdown"
        )
        .forEach(
            wrapper => {

                const type =
                    wrapper.dataset
                        .contentType;


                const box =
                    wrapper
                        .querySelector(
                            ".genre-menu-dynamic"
                        );


                if (
                    !type ||
                    !box
                ) {

                    return;

                }


                const genres =
                    getGenresForType(
                        type
                    );


                box.innerHTML = `

                    <button
                        class="genre-menu-item active"
                        type="button"
                        data-content-type="${type}"
                        data-genre="all"
                    >

                        All ${escapeHTML(
                            TYPE_LABELS[
                                type
                            ]
                        )}

                    </button>


                    ${

                        genres
                            .map(
                                genre => `

                                    <button
                                        class="genre-menu-item"
                                        type="button"
                                        data-content-type="${type}"
                                        data-genre="${escapeAttribute(
                                            genre
                                        )}"
                                    >

                                        ${escapeHTML(
                                            genre
                                        )}

                                    </button>

                                `
                            )
                            .join("")

                    }

                `;

            }
        );

}


/* =====================================================
   CATEGORY CLICK
===================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".genre-menu-item"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const type =
            button.dataset
                .contentType;


        const genre =
            button.dataset
                .genre
            ||
            "all";


        if (
            !type ||
            !(
                type
                in
                activeGenreFilters
            )
        ) {

            return;

        }


        activeGenreFilters[
            type
        ] =
            genre;


        const wrapper =
            button.closest(
                ".nav-category-dropdown"
            );


        if (wrapper) {

            wrapper
                .querySelectorAll(
                    ".genre-menu-item"
                )
                .forEach(
                    item => {

                        item.classList
                            .remove(
                                "active"
                            );

                    }
                );

        }


        button.classList
            .add(
                "active"
            );


        renderSectionByType(
            type
        );


        const section =
            document.getElementById(
                TYPE_SECTIONS[
                    type
                ]
            );


        if (section) {

            section.scrollIntoView(
                {

                    behavior:
                        "smooth",

                    block:
                        "start"

                }
            );

        }

    }
);


/* =====================================================
   GENRE MATCH
===================================================== */

function itemMatchesGenre(
    item,
    genre
) {

    if (
        !genre ||
        genre === "all"
    ) {

        return true;

    }


    return splitGenres(
        item.genre
    )
        .some(
            current =>
                current
                    .toLowerCase()
                ===
                genre
                    .toLowerCase()
        );

}


/* =====================================================
   FILTER CONTENT
===================================================== */

function getFilteredContents(
    type
) {

    return databaseContents
        .filter(
            item =>
                item.type ===
                type
        )
        .filter(
            item =>
                itemMatchesGenre(
                    item,
                    activeGenreFilters[
                        type
                    ]
                )
        );

}


/* =====================================================
   EMPTY TEXT
===================================================== */

function getEmptyText(
    type,
    normalText
) {

    const genre =
        activeGenreFilters[
            type
        ];


    if (
        !genre ||
        genre === "all"
    ) {

        return normalText;

    }


    return `No ${genre} content found.`;

}


/* =====================================================
   RENDER ALL
===================================================== */

function renderAllSections() {

    renderMovies();

    renderNatok();

    renderSeries();

    renderUpcoming();

    renderStories();

    renderBooks();

    renderTutorial();

}


/* =====================================================
   RENDER BY TYPE
===================================================== */

function renderSectionByType(
    type
) {

    const map = {

        movie:
            renderMovies,

        natok:
            renderNatok,

        series:
            renderSeries,

        upcoming:
            renderUpcoming,

        story:
            renderStories,

        book:
            renderBooks,

        tutorial:
            renderTutorial

    };


    if (
        map[
            type
        ]
    ) {

        map[
            type
        ]();

    }

}


/* =====================================================
   MOVIES
===================================================== */

function renderMovies() {

    renderVideoGrid(

        "moviesGrid",

        "movie",

        "MOVIE",

        "No movies added yet."

    );

}


/* =====================================================
   NATOK
===================================================== */

function renderNatok() {

    renderVideoGrid(

        "natokGrid",

        "natok",

        "NATOK",

        "No natok added yet."

    );

}


/* =====================================================
   SERIES
===================================================== */

function renderSeries() {

    renderVideoGrid(

        "webseriesGrid",

        "series",

        "WEB SERIES",

        "No web series added yet."

    );

}


/* =====================================================
   VIDEO GRID
===================================================== */

function renderVideoGrid(
    gridId,
    type,
    label,
    emptyText
) {

    const grid =
        document.getElementById(
            gridId
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredContents(
            type
        );


    if (
        items.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                getEmptyText(
                    type,
                    emptyText
                )
            );


        return;

    }


    grid.innerHTML =
        items
            .map(
                item =>
                    createVideoCard(
                        item,
                        label
                    )
            )
            .join("");

}


/* =====================================================
   VIDEO CARD

   Description niche thakbe na.
   Hover korle poster er upor show korbe.
===================================================== */

function createVideoCard(
    item,
    label
) {

    const image =
        item.poster_url
        ||
        item.banner_url
        ||
        "";


    const leftMeta =
        (
            item.type ===
            "series"
            &&
            item.season
        )

            ?

            `S${String(
                item.season
            ).padStart(
                2,
                "0"
            )}`

            :

            (
                item.year
                ||
                ""
            );


    return `

        <article
            class="movie-card content-open-card"
            data-content-id="${item.id}"
        >

            <div
                class="movie-poster"
                style='${
                    image

                        ?

                        `background-image:url("${escapeCssUrl(
                            image
                        )}")`

                        :

                        ""
                }'
            >


                ${
                    item.badge

                        ?

                        `

                            <span
                                class="content-badge"
                            >

                                ${escapeHTML(
                                    item.badge
                                )}

                            </span>

                        `

                        :

                        ""
                }


                <div
                    class="card-hover-overlay"
                >

                    <h4>

                        ${escapeHTML(
                            item.title
                            ||
                            "Untitled"
                        )}

                    </h4>


                    <p>

                        ${escapeHTML(
                            item.description
                            ||
                            "No description available."
                        )}

                    </p>


                    <span
                        class="card-hover-action"
                    >

                        ${getActionText(
                            item
                        )}

                        <i
                            class="fa-solid fa-arrow-right"
                        ></i>

                    </span>

                </div>


                ${
                    getMainActionUrl(
                        item
                    )

                        ?

                        `

                            <button
                                class="poster-play content-action-button"
                                type="button"
                                data-content-id="${item.id}"
                            >

                                <i
                                    class="fa-solid fa-play"
                                ></i>

                            </button>

                        `

                        :

                        ""
                }

            </div>


            <div
                class="card-info"
            >

                <span
                    class="card-category"
                >

                    ${label}

                </span>


                <h3>

                    ${escapeHTML(
                        item.title
                        ||
                        "Untitled"
                    )}

                </h3>


                <div
                    class="card-meta"
                >

                    <span>

                        ${escapeHTML(
                            leftMeta
                        )}

                    </span>


                    <span>

                        ${
                            hasRating(
                                item
                            )

                                ?

                                `

                                    <i
                                        class="fa-solid fa-star"
                                    ></i>

                                    ${escapeHTML(
                                        item.rating
                                    )}

                                `

                                :

                                ""
                        }

                    </span>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   UPCOMING
===================================================== */

function renderUpcoming() {

    const grid =
        document.getElementById(
            "upcomingGrid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredContents(
            "upcoming"
        );


    if (
        items.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(

                getEmptyText(

                    "upcoming",

                    "No upcoming content."

                )

            );


        return;

    }


    grid.innerHTML =
        items
            .map(
                item => {

                    const image =
                        item.banner_url
                        ||
                        item.poster_url
                        ||
                        "";


                    return `

                        <article
                            class="upcoming-card content-open-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="upcoming-poster"
                                style='${
                                    image

                                        ?

                                        `background-image:url("${escapeCssUrl(
                                            image
                                        )}")`

                                        :

                                        ""
                                }'
                            >

                                <span
                                    class="coming-badge"
                                >

                                    ${escapeHTML(
                                        item.badge
                                        ||
                                        "COMING SOON"
                                    )}

                                </span>


                                ${hoverOverlay(
                                    item,
                                    "View Content"
                                )}

                            </div>


                            <div
                                class="upcoming-info"
                            >

                                <span>

                                    RELEASE DATE

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title
                                        ||
                                        ""
                                    )}

                                </h3>


                                <p>

                                    ${
                                        item.release_date

                                            ?

                                            escapeHTML(
                                                formatDate(
                                                    item.release_date
                                                )
                                            )

                                            :

                                            "Coming Soon"
                                    }

                                </p>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   STORIES
===================================================== */

function renderStories() {

    const grid =
        document.getElementById(
            "storiesGrid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredContents(
            "story"
        );


    if (
        items.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(

                getEmptyText(

                    "story",

                    "No stories added yet."

                )

            );


        return;

    }


    grid.innerHTML =
        items
            .map(
                item => {

                    const image =
                        item.poster_url
                        ||
                        "";


                    return `

                        <article
                            class="story-card content-open-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="story-image"
                                style='${
                                    image

                                        ?

                                        `background-image:url("${escapeCssUrl(
                                            image
                                        )}")`

                                        :

                                        ""
                                }'
                            >

                                <span
                                    class="story-badge"
                                >

                                    ${
                                        item.featured

                                            ?

                                            "FEATURED"

                                            :

                                            "STORY"
                                    }

                                </span>


                                ${hoverOverlay(
                                    item,
                                    "Read Story"
                                )}

                            </div>


                            <div
                                class="story-info"
                            >

                                <span
                                    class="story-date"
                                >

                                    ${
                                        item.release_date

                                            ?

                                            escapeHTML(
                                                formatDate(
                                                    item.release_date
                                                )
                                            )

                                            :

                                            ""
                                    }

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title
                                        ||
                                        ""
                                    )}

                                </h3>


                                ${
                                    item.author

                                        ?

                                        `

                                            <p>

                                                By ${escapeHTML(
                                                    item.author
                                                )}

                                            </p>

                                        `

                                        :

                                        ""
                                }


                                <button
                                    class="story-button content-action-button"
                                    type="button"
                                    data-content-id="${item.id}"
                                >

                                    Read Story

                                    <i
                                        class="fa-solid fa-arrow-right"
                                    ></i>

                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   BOOKS
===================================================== */

function renderBooks() {

    const grid =
        document.getElementById(
            "booksGrid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredContents(
            "book"
        );


    if (
        items.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(

                getEmptyText(

                    "book",

                    "No books added yet."

                )

            );


        return;

    }


    grid.innerHTML =
        items
            .map(
                item => {

                    const image =
                        item.poster_url
                        ||
                        "";


                    return `

                        <article
                            class="book-card content-open-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="book-cover"
                                style='${
                                    image

                                        ?

                                        `background-image:url("${escapeCssUrl(
                                            image
                                        )}")`

                                        :

                                        ""
                                }'
                            >

                                <span
                                    class="book-badge"
                                >

                                    ${
                                        item.featured

                                            ?

                                            "FEATURED"

                                            :

                                            "BOOK"
                                    }

                                </span>


                                ${hoverOverlay(
                                    item,
                                    "Read Book"
                                )}

                            </div>


                            <div
                                class="book-info"
                            >

                                <span
                                    class="book-category"
                                >

                                    ${escapeHTML(
                                        item.genre
                                        ||
                                        "BOOK"
                                    )}

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title
                                        ||
                                        ""
                                    )}

                                </h3>


                                ${
                                    item.author

                                        ?

                                        `

                                            <p>

                                                By ${escapeHTML(
                                                    item.author
                                                )}

                                            </p>

                                        `

                                        :

                                        ""
                                }


                                ${
                                    item.file_url

                                        ?

                                        `

                                            <button
                                                class="book-button content-action-button"
                                                type="button"
                                                data-content-id="${item.id}"
                                            >

                                                Read Book

                                                <i
                                                    class="fa-solid fa-arrow-right"
                                                ></i>

                                            </button>

                                        `

                                        :

                                        ""
                                }

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   TUTORIAL
===================================================== */

function renderTutorial() {

    const grid =
        document.getElementById(
            "tutorialGrid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredContents(
            "tutorial"
        );


    if (
        items.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(

                getEmptyText(

                    "tutorial",

                    "No tutorial content added yet."

                )

            );


        return;

    }


    grid.innerHTML =
        items
            .map(
                item => {

                    const image =
                        item.poster_url
                        ||
                        item.banner_url
                        ||
                        "";


                    return `

                        <article
                            class="movie-card content-open-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="movie-poster"
                                style='${
                                    image

                                        ?

                                        `background-image:url("${escapeCssUrl(
                                            image
                                        )}")`

                                        :

                                        ""
                                }'
                            >


                                ${
                                    item.genre

                                        ?

                                        `

                                            <span
                                                class="content-badge"
                                            >

                                                ${escapeHTML(
                                                    item.genre
                                                )}

                                            </span>

                                        `

                                        :

                                        ""
                                }


                                ${hoverOverlay(
                                    item,
                                    getActionText(
                                        item
                                    )
                                )}


                                ${
                                    getMainActionUrl(
                                        item
                                    )

                                        ?

                                        `

                                            <button
                                                class="poster-play content-action-button"
                                                type="button"
                                                data-content-id="${item.id}"
                                            >

                                                <i
                                                    class="fa-solid fa-play"
                                                ></i>

                                            </button>

                                        `

                                        :

                                        ""
                                }

                            </div>


                            <div
                                class="card-info"
                            >

                                <span
                                    class="card-category"
                                >

                                    TUTORIAL

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title
                                        ||
                                        "Untitled"
                                    )}

                                </h3>


                                <div
                                    class="card-meta"
                                >

                                    <span>

                                        ${escapeHTML(
                                            item.year
                                            ||
                                            ""
                                        )}

                                    </span>


                                    <span>

                                        ${
                                            hasRating(
                                                item
                                            )

                                                ?

                                                `

                                                    <i
                                                        class="fa-solid fa-star"
                                                    ></i>

                                                    ${escapeHTML(
                                                        item.rating
                                                    )}

                                                `

                                                :

                                                ""
                                        }

                                    </span>

                                </div>


                                ${
                                    item.download_url

                                        ?

                                        `

                                            <button
                                                class="book-button content-action-button"
                                                type="button"
                                                data-content-id="${item.id}"
                                                style="margin-top:12px;"
                                            >

                                                Download

                                                <i
                                                    class="fa-solid fa-download"
                                                ></i>

                                            </button>

                                        `

                                        :

                                        ""
                                }

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   HOVER OVERLAY
===================================================== */

function hoverOverlay(
    item,
    actionText
) {

    return `

        <div
            class="card-hover-overlay"
        >

            <h4>

                ${escapeHTML(
                    item.title
                    ||
                    "Untitled"
                )}

            </h4>


            <p>

                ${escapeHTML(
                    item.description
                    ||
                    "No description available."
                )}

            </p>


            <span
                class="card-hover-action"
            >

                ${escapeHTML(
                    actionText
                )}

                <i
                    class="fa-solid fa-arrow-right"
                ></i>

            </span>

        </div>

    `;

}


/* =====================================================
   CONTENT CLICK
===================================================== */

document.addEventListener(
    "click",
    event => {

        const actionButton =
            event.target.closest(
                ".content-action-button"
            );


        if (actionButton) {

            event.preventDefault();

            event.stopPropagation();


            const item =
                findContentById(
                    actionButton.dataset
                        .contentId
                );


            if (item) {

                openContent(
                    item
                );

            }


            return;

        }


        const card =
            event.target.closest(
                ".content-open-card, .featured-card"
            );


        if (!card) {

            return;

        }


        const item =
            findContentById(
                card.dataset
                    .contentId
            );


        if (item) {

            openContent(
                item
            );

        }

    }
);


/* =====================================================
   FIND CONTENT
===================================================== */

function findContentById(
    id
) {

    return databaseContents
        .find(
            item =>
                String(
                    item.id
                )
                ===
                String(
                    id
                )
        );

}


/* =====================================================
   ACTION URL
===================================================== */

function getMainActionUrl(
    item
) {

    if (!item) {

        return "";

    }


    if (
        [
            "movie",
            "natok",
            "series",
            "upcoming"
        ].includes(
            item.type
        )
    ) {

        return (
            item.video_url
            ||
            ""
        );

    }


    if (
        item.type ===
        "book"
    ) {

        return (
            item.file_url
            ||
            ""
        );

    }


    if (
        item.type ===
        "tutorial"
    ) {

        return (

            item.video_url
            ||

            item.download_url
            ||

            ""

        );

    }


    return "";

}


/* =====================================================
   ACTION TEXT
===================================================== */

function getActionText(
    item
) {

    if (!item) {

        return "Open";

    }


    if (
        item.type ===
        "story"
    ) {

        return "Read Story";

    }


    if (
        item.type ===
        "book"
    ) {

        return "Read Book";

    }


    if (
        item.type ===
        "tutorial"
    ) {

        if (
            item.video_url
        ) {

            return "Watch Tutorial";

        }


        if (
            item.download_url
        ) {

            return "Download";

        }


        return "View Tutorial";

    }


    if (
        item.type ===
        "upcoming"
    ) {

        return "View Content";

    }


    return "Watch Now";

}


/* =====================================================
   OPEN CONTENT
===================================================== */

function openContent(
    item
) {

    if (
        item.type ===
        "story"
    ) {

        openStoryReader(
            item
        );


        return;

    }


    const url =
        getMainActionUrl(
            item
        );


    if (url) {

        window.open(

            url,

            "_blank",

            "noopener,noreferrer"

        );

    }

}


/* =====================================================
   STORY READER
===================================================== */

function openStoryReader(
    story
) {

    const oldModal =
        document.getElementById(
            "storyReaderModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "storyReaderModal";


    modal.innerHTML = `

        <div
            class="story-reader-overlay"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                background:rgba(0,0,0,.88);
            "
        >

            <div
                style="
                    position:relative;
                    width:min(760px,100%);
                    max-height:86vh;
                    overflow-y:auto;
                    padding:32px;
                    border:1px solid rgba(255,255,255,.1);
                    border-radius:16px;
                    background:#101116;
                "
            >

                <button
                    id="closeStoryReader"
                    type="button"
                    style="
                        position:absolute;
                        top:18px;
                        right:18px;
                        width:38px;
                        height:38px;
                        border:0;
                        border-radius:50%;
                        background:#ef1024;
                        color:#fff;
                        cursor:pointer;
                    "
                >

                    <i
                        class="fa-solid fa-xmark"
                    ></i>

                </button>


                <h2
                    style="
                        padding-right:50px;
                        margin-bottom:8px;
                    "
                >

                    ${escapeHTML(
                        story.title
                        ||
                        "Untitled Story"
                    )}

                </h2>


                ${
                    story.author

                        ?

                        `

                            <p
                                style="
                                    color:#ff1b2d;
                                    margin-bottom:24px;
                                "
                            >

                                By ${escapeHTML(
                                    story.author
                                )}

                            </p>

                        `

                        :

                        ""
                }


                <div
                    style="
                        white-space:pre-wrap;
                        color:rgba(255,255,255,.78);
                        line-height:1.9;
                        font-size:15px;
                    "
                >

                    ${escapeHTML(
                        story.full_content
                        ||
                        "Story content is not available."
                    )}

                </div>

            </div>

        </div>

    `;


    document.body
        .appendChild(
            modal
        );


    modal
        .querySelector(
            "#closeStoryReader"
        )
        ?.addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    modal
        .querySelector(
            ".story-reader-overlay"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target
                        .classList
                        .contains(
                            "story-reader-overlay"
                        )
                ) {

                    modal.remove();

                }

            }
        );

}


/* =====================================================
   CREATE FEATURED SECTION

   index.html e manually section add korte hobe na
===================================================== */

function createFeaturedSection() {

    if (
        document.getElementById(
            "featured"
        )
    ) {

        return;

    }


    const moviesSection =
        document.getElementById(
            "movies"
        );


    if (!moviesSection) {

        return;

    }


    const section =
        document.createElement(
            "section"
        );


    section.id =
        "featured";


    section.className =
        "featured-section";


    section.innerHTML = `

        <div
            class="section-heading featured-heading"
        >

            <div
                class="heading-left"
            >

                <span
                    class="heading-line"
                ></span>


                <div>

                    <h2>

                        Featured

                    </h2>


                    <p>

                        Top rated content

                    </p>

                </div>

            </div>


            <div
                class="featured-controls"
            >

                <button
                    id="featuredPrev"
                    type="button"
                >

                    <i
                        class="fa-solid fa-chevron-left"
                    ></i>

                </button>


                <button
                    id="featuredNext"
                    type="button"
                >

                    <i
                        class="fa-solid fa-chevron-right"
                    ></i>

                </button>

            </div>

        </div>


        <div
            class="featured-viewport"
            id="featuredViewport"
        >

            <div
                class="featured-track"
                id="featuredTrack"
            ></div>

        </div>

    `;


    moviesSection
        .parentNode
        .insertBefore(
            section,
            moviesSection
        );

}


/* =====================================================
   FEATURED SLIDER

   Existing rating field use korbe.
   8+ hole show korbe.
===================================================== */

function setupFeaturedSlider() {

    const track =
        document.getElementById(
            "featuredTrack"
        );


    const viewport =
        document.getElementById(
            "featuredViewport"
        );


    const prev =
        document.getElementById(
            "featuredPrev"
        );


    const next =
        document.getElementById(
            "featuredNext"
        );


    if (!track) {

        return;

    }


    featuredItems =
        databaseContents
            .filter(
                item => {

                    return (

                        Number(
                            item.rating
                        )
                        >=
                        8

                        &&

                        (
                            item.poster_url
                            ||
                            item.banner_url
                        )

                    );

                }
            )
            .sort(
                (
                    a,
                    b
                ) =>

                    Number(
                        b.rating
                    )
                    -
                    Number(
                        a.rating
                    )

            );


    if (
        featuredItems.length ===
        0
    ) {

        track.innerHTML = `

            <div
                class="database-loading"
            >

                No content with rating 8.0 or higher yet.

            </div>

        `;


        return;

    }


    track.innerHTML =
        featuredItems
            .map(
                item => {

                    const image =
                        item.poster_url
                        ||
                        item.banner_url
                        ||
                        "";


                    return `

                        <article
                            class="featured-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="featured-card-poster"
                                style='background-image:url("${escapeCssUrl(
                                    image
                                )}")'
                            >

                                <span
                                    class="featured-badge"
                                >

                                    FEATURED

                                </span>


                                <span
                                    class="featured-rating"
                                >

                                    <i
                                        class="fa-solid fa-star"
                                    ></i>

                                    ${escapeHTML(
                                        item.rating
                                    )}

                                </span>


                                ${hoverOverlay(
                                    item,
                                    getActionText(
                                        item
                                    )
                                )}

                            </div>


                            <div
                                class="featured-card-info"
                            >

                                <span
                                    class="featured-type"
                                >

                                    ${escapeHTML(
                                        formatType(
                                            item.type
                                        )
                                    )}

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title
                                        ||
                                        "Untitled"
                                    )}

                                </h3>


                                <p>

                                    ${escapeHTML(
                                        getFeaturedMeta(
                                            item
                                        )
                                    )}

                                </p>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");


    featuredIndex =
        0;


    updateFeaturedPosition();


    startFeaturedAutoPlay();


    if (next) {

        next.addEventListener(
            "click",
            () => {

                featuredGoNext();

                startFeaturedAutoPlay();

            }
        );

    }


    if (prev) {

        prev.addEventListener(
            "click",
            () => {

                featuredGoPrev();

                startFeaturedAutoPlay();

            }
        );

    }


    if (viewport) {

        viewport.addEventListener(
            "mouseenter",
            stopFeaturedAutoPlay
        );


        viewport.addEventListener(
            "mouseleave",
            startFeaturedAutoPlay
        );

    }

}


/* =====================================================
   FEATURED META
===================================================== */

function getFeaturedMeta(
    item
) {

    if (
        item.type ===
        "series"
        &&
        item.season
    ) {

        return `Season ${item.season}`;

    }


    if (
        [
            "story",
            "book"
        ].includes(
            item.type
        )
        &&
        item.author
    ) {

        return item.author;

    }


    return (

        item.year
        ||
        item.genre
        ||
        ""

    );

}


/* =====================================================
   FEATURED RESPONSIVE COUNT
===================================================== */

function getFeaturedVisibleCount() {

    if (
        window.innerWidth
        <=
        760
    ) {

        return 2;

    }


    if (
        window.innerWidth
        <=
        1000
    ) {

        return 4;

    }


    return 5;

}


/* =====================================================
   FEATURED MAX
===================================================== */

function getFeaturedMaxIndex() {

    return Math.max(

        0,

        featuredItems.length
        -
        getFeaturedVisibleCount()

    );

}


/* =====================================================
   FEATURED POSITION
===================================================== */

function updateFeaturedPosition() {

    const track =
        document.getElementById(
            "featuredTrack"
        );


    const firstCard =
        track
            ?.querySelector(
                ".featured-card"
            );


    if (
        !track ||
        !firstCard
    ) {

        return;

    }


    const gap =
        parseFloat(
            getComputedStyle(
                track
            ).gap
            ||
            "0"
        )
        ||
        0;


    const step =
        firstCard
            .getBoundingClientRect()
            .width
        +
        gap;


    featuredIndex =
        Math.min(

            featuredIndex,

            getFeaturedMaxIndex()

        );


    track.style.transform =
        `translateX(-${featuredIndex * step}px)`;

}


/* =====================================================
   FEATURED NEXT
===================================================== */

function featuredGoNext() {

    const max =
        getFeaturedMaxIndex();


    if (
        max <= 0
    ) {

        return;

    }


    featuredIndex =
        featuredIndex >= max

            ?

            0

            :

            featuredIndex + 1;


    updateFeaturedPosition();

}


/* =====================================================
   FEATURED PREVIOUS
===================================================== */

function featuredGoPrev() {

    const max =
        getFeaturedMaxIndex();


    if (
        max <= 0
    ) {

        return;

    }


    featuredIndex =
        featuredIndex <= 0

            ?

            max

            :

            featuredIndex - 1;


    updateFeaturedPosition();

}


/* =====================================================
   FEATURED AUTO
===================================================== */

function startFeaturedAutoPlay() {

    stopFeaturedAutoPlay();


    featuredTimer =
        setInterval(

            featuredGoNext,

            4000

        );

}


function stopFeaturedAutoPlay() {

    if (
        featuredTimer
    ) {

        clearInterval(
            featuredTimer
        );

    }


    featuredTimer =
        null;

}


window.addEventListener(
    "resize",
    updateFeaturedPosition
);


/* =====================================================
   HERO IMAGE
===================================================== */

function getHeroImage(
    item
) {

    if (!item) {

        return "";

    }


    if (
        [
            "movie",
            "natok",
            "series",
            "upcoming"
        ].includes(
            item.type
        )
    ) {

        return (

            item.banner_url
            ||
            item.poster_url
            ||
            ""

        );

    }


    return (

        item.poster_url
        ||
        item.banner_url
        ||
        ""

    );

}


/* =====================================================
   DYNAMIC HERO

   Movie
   Natok
   Series
   Upcoming
   Story
   Book
   Tutorial
   repeat
===================================================== */

function setupDynamicHero() {

    if (!heroBackground) {

        return;

    }


    heroSlides =
        HERO_SEQUENCE
            .map(
                type => {

                    return databaseContents
                        .find(
                            item =>

                                item.type === type

                                &&

                                getHeroImage(
                                    item
                                )

                        );

                }
            )
            .filter(
                Boolean
            );


    if (
        heroSlides.length ===
        0
    ) {

        heroBackground.style
            .backgroundImage =

            "linear-gradient(120deg,#11001f 0%,#2a075c 48%,#4d0c79 100%)";


        return;

    }


    heroIndex =
        0;


    renderHeroDots();


    showHeroSlide(
        0,
        false
    );


    if (
        heroTimer
    ) {

        clearInterval(
            heroTimer
        );

    }


    heroTimer =
        setInterval(
            () => {

                heroIndex =
                    (
                        heroIndex + 1
                    )
                    %
                    heroSlides.length;


                showHeroSlide(

                    heroIndex,

                    true

                );

            },
            3600
        );

}


/* =====================================================
   SHOW HERO
===================================================== */

function showHeroSlide(
    index,
    animate = true
) {

    const item =
        heroSlides[
            index
        ];


    if (
        !heroBackground ||
        !item
    ) {

        return;

    }


    const image =
        getHeroImage(
            item
        );


    if (!image) {

        return;

    }


    heroIndex =
        index;


    const apply =
        () => {

            heroBackground
                .classList
                .remove(
                    "zoom"
                );


            heroBackground.style
                .backgroundImage =

                `url("${escapeCssUrl(
                    image
                )}")`;


            heroBackground.style
                .backgroundSize =
                "cover";


            heroBackground.style
                .backgroundPosition =
                "center";


            heroBackground.style
                .opacity =
                "1";


            void heroBackground
                .offsetWidth;


            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            heroBackground
                                .classList
                                .add(
                                    "zoom"
                                );

                        }
                    );

                }
            );


            updateHeroDots();

        };


    if (!animate) {

        apply();

        return;

    }


    heroBackground.style
        .opacity =
        "0";


    setTimeout(

        apply,

        350

    );

}


/* =====================================================
   HERO DOTS
===================================================== */

function renderHeroDots() {

    if (!heroDotsContainer) {

        return;

    }


    heroDotsContainer.innerHTML =
        heroSlides
            .map(
                (
                    item,
                    index
                ) => `

                    <button
                        type="button"
                        class="hero-dot ${
                            index === 0
                                ?
                                "active"
                                :
                                ""
                        }"
                        data-hero-index="${index}"
                    ></button>

                `
            )
            .join("");


    heroDotsContainer
        .querySelectorAll(
            ".hero-dot"
        )
        .forEach(
            dot => {

                dot.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                dot.dataset
                                    .heroIndex
                            );


                        if (
                            !Number.isFinite(
                                index
                            )
                        ) {

                            return;

                        }


                        showHeroSlide(
                            index,
                            true
                        );


                        if (
                            heroTimer
                        ) {

                            clearInterval(
                                heroTimer
                            );

                        }


                        heroTimer =
                            setInterval(
                                () => {

                                    heroIndex =
                                        (
                                            heroIndex + 1
                                        )
                                        %
                                        heroSlides.length;


                                    showHeroSlide(
                                        heroIndex,
                                        true
                                    );

                                },
                                3600
                            );

                    }
                );

            }
        );

}


/* =====================================================
   UPDATE HERO DOT
===================================================== */

function updateHeroDots() {

    if (!heroDotsContainer) {

        return;

    }


    heroDotsContainer
        .querySelectorAll(
            ".hero-dot"
        )
        .forEach(
            (
                dot,
                index
            ) => {

                dot.classList.toggle(

                    "active",

                    index ===
                    heroIndex

                );

            }
        );

}


/* =====================================================
   SEARCH
===================================================== */

function openSearch() {

    if (!searchBox) {

        return;

    }


    searchBox.classList
        .add(
            "active"
        );


    setTimeout(
        () => {

            if (
                searchInput
            ) {

                searchInput.focus();

            }

        },
        100
    );

}


function closeSearch() {

    if (!searchBox) {

        return;

    }


    searchBox.classList
        .remove(
            "active"
        );


    if (
        searchInput
    ) {

        searchInput.value =
            "";

    }


    if (
        searchResults
    ) {

        searchResults.innerHTML =
            "";

    }

}


if (
    searchToggle
) {

    searchToggle
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (
                    searchBox
                    &&
                    searchBox
                        .classList
                        .contains(
                            "active"
                        )
                ) {

                    closeSearch();

                }

                else {

                    openSearch();

                }

            }
        );

}


if (
    searchClose
) {

    searchClose
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeSearch();

            }
        );

}


if (
    searchInput
) {

    searchInput
        .addEventListener(
            "input",
            event => {

                performSearch(
                    event.target
                        .value
                );

            }
        );

}


/* =====================================================
   SEARCH FUNCTION
===================================================== */

function performSearch(
    keyword
) {

    if (!searchResults) {

        return;

    }


    const text =
        keyword
            .trim()
            .toLowerCase();


    if (!text) {

        searchResults.innerHTML =
            "";


        return;

    }


    const results =
        databaseContents
            .filter(
                item => {

                    const data = [

                        item.title,

                        item.genre,

                        item.author,

                        formatType(
                            item.type
                        )

                    ]
                        .filter(
                            Boolean
                        )
                        .join(
                            " "
                        )
                        .toLowerCase();


                    return data.includes(
                        text
                    );

                }
            );


    if (
        results.length ===
        0
    ) {

        searchResults.innerHTML = `

            <div
                class="search-result-item"
            >

                <div
                    class="search-result-icon"
                >

                    <i
                        class="fa-solid fa-magnifying-glass"
                    ></i>

                </div>


                <div>

                    <h4>

                        No result found

                    </h4>


                    <p>

                        Try another keyword

                    </p>

                </div>

            </div>

        `;


        return;

    }


    searchResults.innerHTML =
        results
            .slice(
                0,
                8
            )
            .map(
                item => `

                    <div
                        class="search-result-item dynamic-search-result"
                        data-type="${escapeAttribute(
                            item.type
                        )}"
                    >

                        <div
                            class="search-result-icon"
                        >

                            <i
                                class="${getTypeIcon(
                                    item.type
                                )}"
                            ></i>

                        </div>


                        <div>

                            <h4>

                                ${escapeHTML(
                                    item.title
                                    ||
                                    "Untitled"
                                )}

                            </h4>


                            <p>

                                ${escapeHTML(
                                    formatType(
                                        item.type
                                    )
                                )}

                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   SEARCH RESULT CLICK
===================================================== */

if (
    searchResults
) {

    searchResults
        .addEventListener(
            "click",
            event => {

                const result =
                    event.target.closest(
                        ".dynamic-search-result"
                    );


                if (!result) {

                    return;

                }


                closeSearch();


                const section =
                    document.getElementById(

                        TYPE_SECTIONS[
                            result.dataset.type
                        ]
                        ||
                        "home"

                    );


                if (
                    section
                ) {

                    section.scrollIntoView(
                        {

                            behavior:
                                "smooth",

                            block:
                                "start"

                        }
                    );

                }

            }
        );

}


/* =====================================================
   CLICK OUTSIDE SEARCH
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (!searchBox) {

            return;

        }


        const clickedInside =
            searchBox.contains(
                event.target
            );


        const clickedButton =
            searchToggle
            &&
            searchToggle.contains(
                event.target
            );


        if (
            !clickedInside
            &&
            !clickedButton
        ) {

            closeSearch();

        }

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

function closeMobileMenu() {

    if (
        mobileNav
    ) {

        mobileNav.classList
            .remove(
                "active"
            );

    }


    const icon =
        mobileMenuButton
            ?.querySelector(
                "i"
            );


    if (
        icon
    ) {

        icon.classList
            .remove(
                "fa-xmark"
            );


        icon.classList
            .add(
                "fa-bars"
            );

    }

}


if (
    mobileMenuButton
) {

    mobileMenuButton
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (!mobileNav) {

                    return;

                }


                mobileNav.classList
                    .toggle(
                        "active"
                    );


                const icon =
                    mobileMenuButton
                        .querySelector(
                            "i"
                        );


                if (!icon) {

                    return;

                }


                const active =
                    mobileNav.classList
                        .contains(
                            "active"
                        );


                icon.classList.toggle(
                    "fa-bars",
                    !active
                );


                icon.classList.toggle(
                    "fa-xmark",
                    active
                );

            }
        );

}


if (
    mobileNav
) {

    mobileNav
        .querySelectorAll(
            "a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            }
        );

}


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {

                            behavior:
                                "smooth",

                            block:
                                "start"

                        }
                    );

                }
            );

        }
    );


/* =====================================================
   ACTIVE NAV
===================================================== */

function updateActiveNav() {

    let current =
        "home";


    document
        .querySelectorAll(
            "section[id]"
        )
        .forEach(
            section => {

                if (
                    section.id ===
                    "featured"
                ) {

                    return;

                }


                const top =
                    section.offsetTop
                    -
                    150;


                const bottom =
                    top
                    +
                    section.offsetHeight;


                if (
                    window.scrollY
                    >=
                    top

                    &&

                    window.scrollY
                    <
                    bottom
                ) {

                    current =
                        section.id;

                }

            }
        );


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link => {

                link.classList.toggle(

                    "active",

                    link.getAttribute(
                        "href"
                    )
                    ===
                    `#${current}`

                );

            }
        );

}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeSearch();

        closeMobileMenu();


        const modal =
            document.getElementById(
                "storyReaderModal"
            );


        if (
            modal
        ) {

            modal.remove();

        }

    }
);


/* =====================================================
   ERROR
===================================================== */

function showDatabaseError() {

    [

        "moviesGrid",

        "natokGrid",

        "webseriesGrid",

        "upcomingGrid",

        "storiesGrid",

        "booksGrid",

        "tutorialGrid"

    ]
        .forEach(
            id => {

                const grid =
                    document.getElementById(
                        id
                    );


                if (
                    grid
                ) {

                    grid.innerHTML =
                        emptyMessage(
                            "Unable to load content."
                        );

                }

            }
        );

}


/* =====================================================
   HELPERS
===================================================== */

function hasRating(
    item
) {

    return (

        item
        &&
        item.rating
        !==
        null
        &&
        item.rating
        !==
        undefined
        &&
        item.rating
        !==
        ""

    );

}


function formatType(
    type
) {

    return (

        TYPE_LABELS[
            type
        ]
        ||
        type
        ||
        ""

    );

}


function getTypeIcon(
    type
) {

    const icons = {

        movie:
            "fa-solid fa-film",

        natok:
            "fa-solid fa-clapperboard",

        series:
            "fa-solid fa-tv",

        upcoming:
            "fa-solid fa-clock",

        story:
            "fa-solid fa-book-open",

        book:
            "fa-solid fa-book",

        tutorial:
            "fa-solid fa-graduation-cap"

    };


    return (

        icons[
            type
        ]
        ||
        "fa-solid fa-film"

    );

}


function formatDate(
    date
) {

    if (!date) {

        return "";

    }


    try {

        return new Date(
            `${date}T00:00:00`
        )
            .toLocaleDateString(
                "en-US",
                {

                    year:
                        "numeric",

                    month:
                        "short",

                    day:
                        "numeric"

                }
            );

    }

    catch (
        error
    ) {

        return date;

    }

}


function emptyMessage(
    message
) {

    return `

        <div
            style="
                grid-column:1/-1;
                padding:35px 20px;
                text-align:center;
                color:rgba(255,255,255,.42);
                background:#101116;
                border:1px solid rgba(255,255,255,.06);
                border-radius:12px;
            "
        >

            ${escapeHTML(
                message
            )}

        </div>

    `;

}


function escapeHTML(
    value
) {

    if (
        value ===
        null
        ||
        value ===
        undefined
    ) {

        return "";

    }


    return String(
        value
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


function escapeCssUrl(
    value
) {

    return String(
        value
        ||
        ""
    )

        .replaceAll(
            "\\",
            "\\\\"
        )

        .replaceAll(
            '"',
            '\\"'
        )

        .replaceAll(
            "\n",
            ""
        )

        .replaceAll(
            "\r",
            ""
        );

}


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            heroBackground
        ) {

            heroBackground.style
                .backgroundImage =

                "linear-gradient(120deg,#11001f 0%,#2a075c 48%,#4d0c79 100%)";


            heroBackground.style
                .opacity =
                "1";

        }


        updateActiveNav();


        await loadWebsiteContents();

    }
);