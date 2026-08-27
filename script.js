/* =========================================================
   CINEMA MELLA / CINEMA HUB
   PUBLIC WEBSITE - FINAL SCRIPT

   DATABASE CHANGE = NO

   FEATURES
   ---------------------------------------------------------
   1. Header MELLA <-> HUB animation
   2. Footer logo static
   3. Category dropdown from existing genre field
   4. Rating 8+ Featured slider
   5. Description only on hover
   6. Hero uses banner_url ONLY
   7. Hero sequence:
      Movie -> Natok -> Series -> Upcoming
      -> Story -> Book -> Tutorial -> Repeat
   8. Movie/Natok/Series/Tutorial Download button
   9. Story reader
   10. Book PDF open
   11. Search
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";


const publicSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   GLOBAL CONTENT
========================================================= */

let databaseContents = [];


/* =========================================================
   TYPE LABELS
========================================================= */

const TYPE_LABELS = {

    movie: "Movie",

    natok: "Natok",

    series: "Web Series",

    upcoming: "Upcoming",

    story: "Story",

    book: "Book",

    tutorial: "Tutorial"

};


/* =========================================================
   SECTION MAP
========================================================= */

const TYPE_SECTIONS = {

    movie: "movies",

    natok: "natok",

    series: "webseries",

    upcoming: "upcoming",

    story: "stories",

    book: "books",

    tutorial: "tutorial"

};


/* =========================================================
   HERO ORDER
========================================================= */

const HERO_SEQUENCE = [

    "movie",

    "natok",

    "series",

    "upcoming",

    "story",

    "book",

    "tutorial"

];


/* =========================================================
   CATEGORY FILTER STATE
========================================================= */

const activeGenreFilters = {

    movie: "all",

    natok: "all",

    series: "all",

    upcoming: "all",

    story: "all",

    book: "all",

    tutorial: "all"

};


/* =========================================================
   HERO STATE
========================================================= */

let heroSlides = [];

let heroIndex = 0;

let heroTimer = null;


/* =========================================================
   FEATURED STATE
========================================================= */

let featuredItems = [];

let featuredIndex = 0;

let featuredTimer = null;


/* =========================================================
   DOM
========================================================= */

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


/* =========================================================
   HEADER LOGO ANIMATION ONLY

   FOOTER WILL NOT ANIMATE
========================================================= */

const headerChangingLogo =
    document.getElementById(
        "logoChangingText"
    );


const headerLogoWords = [

    "MELLA",

    "HUB"

];


let headerLogoIndex = 0;


if (headerChangingLogo) {

    setInterval(
        () => {

            headerLogoIndex =
                (
                    headerLogoIndex + 1
                )
                %
                headerLogoWords.length;


            headerChangingLogo.style.opacity =
                "0";


            headerChangingLogo.style.transform =
                "translateY(5px)";


            setTimeout(
                () => {

                    headerChangingLogo.textContent =
                        headerLogoWords[
                            headerLogoIndex
                        ];


                    headerChangingLogo.style.opacity =
                        "1";


                    headerChangingLogo.style.transform =
                        "translateY(0)";

                },
                300
            );

        },
        2500
    );

}


/* =========================================================
   LOAD CONTENT
========================================================= */

async function loadWebsiteContents() {

    try {

        const {
            data,
            error
        } =
            await publicSupabase
                .from("contents")
                .select("*")
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


        createNavbarDropdowns();


        renderNavbarCategories();


        createFeaturedSection();


        renderAllSections();


        setupFeaturedSlider();


        setupDynamicHero();

    }

    catch (error) {

        console.error(
            "Unable to load Cinema Mella:",
            error
        );


        showDatabaseError();

    }

}


/* =========================================================
   GENRE SPLITTER
========================================================= */

function splitGenres(value) {

    return String(
        value || ""
    )
        .split(",")
        .map(
            genre =>
                genre.trim()
        )
        .filter(Boolean);

}


/* =========================================================
   GET UNIQUE CATEGORIES FROM EXISTING CONTENT
========================================================= */

function getGenresForType(type) {

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
                                    oldGenre =>
                                        oldGenre
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


    genres.sort(
        (
            a,
            b
        ) =>
            a.localeCompare(b)
    );


    return genres;

}


/* =========================================================
   CREATE CATEGORY DROPDOWN WRAPPERS
========================================================= */

function createNavbarDropdowns() {

    const navMenu =
        document.querySelector(
            ".nav-menu"
        );


    if (!navMenu) {

        return;

    }


    const dropdownMap = {

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
            dropdownMap
        )
        .forEach(
            (
                [
                    href,
                    type
                ]
            ) => {

                const link =
                    navMenu.querySelector(
                        `a.nav-link[href="${href}"]`
                    );


                if (!link) {

                    return;

                }


                /*
                   Already wrapped hole duplicate korbe na
                */

                if (
                    link.parentElement &&
                    link.parentElement
                        .classList
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


                wrapper.dataset.contentType =
                    type;


                const dropdown =
                    document.createElement(
                        "div"
                    );


                dropdown.className =
                    "genre-dropdown-menu";


                dropdown.innerHTML = `

                    <div
                        class="genre-dropdown-head"
                    >

                        ${escapeHTML(
                            TYPE_LABELS[type]
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


                wrapper.appendChild(
                    link
                );


                wrapper.appendChild(
                    dropdown
                );

            }
        );

}


/* =========================================================
   RENDER CATEGORY DROPDOWNS
========================================================= */

function renderNavbarCategories() {

    document
        .querySelectorAll(
            ".nav-category-dropdown"
        )
        .forEach(
            wrapper => {

                const type =
                    wrapper.dataset
                        .contentType;


                const dynamicBox =
                    wrapper.querySelector(
                        ".genre-menu-dynamic"
                    );


                if (
                    !type ||
                    !dynamicBox
                ) {

                    return;

                }


                const genres =
                    getGenresForType(
                        type
                    );


                let html = `

                    <button
                        type="button"
                        class="genre-menu-item active"
                        data-content-type="${escapeAttribute(
                            type
                        )}"
                        data-genre="all"
                    >

                        All ${escapeHTML(
                            TYPE_LABELS[
                                type
                            ]
                        )}

                    </button>

                `;


                genres.forEach(
                    genre => {

                        html += `

                            <button
                                type="button"
                                class="genre-menu-item"
                                data-content-type="${escapeAttribute(
                                    type
                                )}"
                                data-genre="${escapeAttribute(
                                    genre
                                )}"
                            >

                                ${escapeHTML(
                                    genre
                                )}

                            </button>

                        `;

                    }
                );


                dynamicBox.innerHTML =
                    html;

            }
        );

}


/* =========================================================
   CATEGORY BUTTON CLICK
========================================================= */

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
                type in
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
                    menuButton => {

                        menuButton.classList.remove(
                            "active"
                        );

                    }
                );

        }


        button.classList.add(
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


/* =========================================================
   CATEGORY MATCH
========================================================= */

function itemMatchesGenre(
    item,
    selectedGenre
) {

    if (
        !selectedGenre ||
        selectedGenre === "all"
    ) {

        return true;

    }


    return splitGenres(
        item.genre
    )
        .some(
            genre =>
                genre
                    .toLowerCase()
                ===
                selectedGenre
                    .toLowerCase()
        );

}


/* =========================================================
   FILTER CONTENT
========================================================= */

function getFilteredContents(type) {

    return databaseContents
        .filter(
            item =>
                item.type === type
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


/* =========================================================
   EMPTY CATEGORY TEXT
========================================================= */

function getEmptyText(
    type,
    normalText
) {

    const category =
        activeGenreFilters[
            type
        ];


    if (
        !category ||
        category === "all"
    ) {

        return normalText;

    }


    return `No ${category} content found.`;

}


/* =========================================================
   RENDER ALL SECTIONS
========================================================= */

function renderAllSections() {

    renderMovies();

    renderNatok();

    renderSeries();

    renderUpcoming();

    renderStories();

    renderBooks();

    renderTutorial();

}


/* =========================================================
   RENDER SECTION BY TYPE
========================================================= */

function renderSectionByType(type) {

    const rendererMap = {

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
        rendererMap[
            type
        ]
    ) {

        rendererMap[
            type
        ]();

    }

}


/* =========================================================
   MOVIES
========================================================= */

function renderMovies() {

    renderVideoGrid(
        "moviesGrid",
        "movie",
        "MOVIE",
        "No movies added yet."
    );

}


/* =========================================================
   NATOK
========================================================= */

function renderNatok() {

    renderVideoGrid(
        "natokGrid",
        "natok",
        "NATOK",
        "No natok added yet."
    );

}


/* =========================================================
   SERIES
========================================================= */

function renderSeries() {

    renderVideoGrid(
        "webseriesGrid",
        "series",
        "WEB SERIES",
        "No web series added yet."
    );

}


/* =========================================================
   MOVIE / NATOK / SERIES GRID
========================================================= */

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


    if (!items.length) {

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


/* =========================================================
   MOVIE / NATOK / SERIES CARD

   IMPORTANT:
   DOWNLOAD BUTTON IS HERE
========================================================= */

function createVideoCard(
    item,
    label
) {

    const poster =
        item.poster_url ||
        "";


    let leftMeta =
        item.year ||
        "";


    if (
        item.type === "series" &&
        item.season
    ) {

        leftMeta =
            `S${String(
                item.season
            ).padStart(
                2,
                "0"
            )}`;

    }


    return `

        <article
            class="movie-card"
            data-content-id="${item.id}"
        >

            <div
                class="movie-poster"
                style='${
                    poster
                        ?
                        `background-image:url("${escapeCssUrl(
                            poster
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


                ${createHoverOverlay(
                    item
                )}


                ${
                    item.video_url
                        ?
                        `

                            <button
                                type="button"
                                class="poster-play content-video-button"
                                data-content-id="${item.id}"
                                aria-label="Watch ${escapeAttribute(
                                    item.title
                                )}"
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
                        item.title ||
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


                <!-- ======================================
                     MOVIE / NATOK / SERIES DOWNLOAD
                ======================================= -->

                ${
                    item.download_url
                        ?
                        `

                            <button
                                type="button"
                                class="content-download-button"
                                data-content-id="${item.id}"
                            >

                                <i
                                    class="fa-solid fa-download"
                                ></i>

                                Download

                            </button>

                        `
                        :
                        ""
                }

            </div>

        </article>

    `;

}


/* =========================================================
   UPCOMING
========================================================= */

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


    if (!items.length) {

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

                    const poster =
                        item.poster_url ||
                        "";


                    return `

                        <article
                            class="upcoming-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="upcoming-poster"
                                style='${
                                    poster
                                        ?
                                        `background-image:url("${escapeCssUrl(
                                            poster
                                        )}")`
                                        :
                                        ""
                                }'
                            >

                                <span
                                    class="coming-badge"
                                >

                                    ${escapeHTML(
                                        item.badge ||
                                        "COMING SOON"
                                    )}

                                </span>


                                ${createHoverOverlay(
                                    item
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
                                        item.title ||
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


/* =========================================================
   STORIES
========================================================= */

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


    if (!items.length) {

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

                    const poster =
                        item.poster_url ||
                        "";


                    return `

                        <article
                            class="story-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="story-image"
                                style='${
                                    poster
                                        ?
                                        `background-image:url("${escapeCssUrl(
                                            poster
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


                                ${createHoverOverlay(
                                    item
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
                                        item.title ||
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
                                    type="button"
                                    class="story-button content-story-button"
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


/* =========================================================
   BOOKS
========================================================= */

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


    if (!items.length) {

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

                    const poster =
                        item.poster_url ||
                        "";


                    return `

                        <article
                            class="book-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="book-cover"
                                style='${
                                    poster
                                        ?
                                        `background-image:url("${escapeCssUrl(
                                            poster
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


                                ${createHoverOverlay(
                                    item
                                )}

                            </div>


                            <div
                                class="book-info"
                            >

                                <span
                                    class="book-category"
                                >

                                    ${escapeHTML(
                                        item.genre ||
                                        "BOOK"
                                    )}

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        item.title ||
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
                                                type="button"
                                                class="book-button content-book-button"
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


/* =========================================================
   TUTORIAL

   DOWNLOAD BUTTON INCLUDED
========================================================= */

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


    if (!items.length) {

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

                    const poster =
                        item.poster_url ||
                        "";


                    return `

                        <article
                            class="movie-card"
                            data-content-id="${item.id}"
                        >

                            <div
                                class="movie-poster"
                                style='${
                                    poster
                                        ?
                                        `background-image:url("${escapeCssUrl(
                                            poster
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


                                ${createHoverOverlay(
                                    item
                                )}


                                ${
                                    item.video_url
                                        ?
                                        `

                                            <button
                                                type="button"
                                                class="poster-play content-video-button"
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
                                        item.title ||
                                        "Untitled"
                                    )}

                                </h3>


                                <div
                                    class="card-meta"
                                >

                                    <span>

                                        ${escapeHTML(
                                            item.year ||
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
                                                type="button"
                                                class="content-download-button"
                                                data-content-id="${item.id}"
                                            >

                                                <i
                                                    class="fa-solid fa-download"
                                                ></i>

                                                Download

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


/* =========================================================
   HOVER DESCRIPTION
========================================================= */

function createHoverOverlay(item) {

    return `

        <div
            class="card-hover-overlay"
        >

            <h4>

                ${escapeHTML(
                    item.title ||
                    "Untitled"
                )}

            </h4>


            <p>

                ${escapeHTML(
                    item.description ||
                    "No description available."
                )}

            </p>


            <span
                class="card-hover-action"
            >

                ${escapeHTML(
                    getActionText(
                        item
                    )
                )}

                <i
                    class="fa-solid fa-arrow-right"
                ></i>

            </span>

        </div>

    `;

}


/* =========================================================
   ACTION TEXT
========================================================= */

function getActionText(item) {

    if (!item) {

        return "Open";

    }


    if (
        item.type === "story"
    ) {

        return "Read Story";

    }


    if (
        item.type === "book"
    ) {

        return "Read Book";

    }


    if (
        item.type === "tutorial"
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
        item.type === "upcoming"
    ) {

        return "Coming Soon";

    }


    return "Watch Now";

}


/* =========================================================
   FIND CONTENT BY ID
========================================================= */

function findContentById(id) {

    return databaseContents.find(
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


/* =========================================================
   VIDEO CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-video-button"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const item =
            findContentById(
                button.dataset
                    .contentId
            );


        if (
            item &&
            item.video_url
        ) {

            window.open(
                item.video_url,
                "_blank",
                "noopener,noreferrer"
            );

        }

    }
);


/* =========================================================
   DOWNLOAD CLICK

   MOVIE
   NATOK
   SERIES
   TUTORIAL
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-download-button"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const item =
            findContentById(
                button.dataset
                    .contentId
            );


        if (
            !item ||
            !item.download_url
        ) {

            return;

        }


        window.open(
            item.download_url,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================================================
   STORY BUTTON
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-story-button"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const story =
            findContentById(
                button.dataset
                    .contentId
            );


        if (story) {

            openStoryReader(
                story
            );

        }

    }
);


/* =========================================================
   BOOK BUTTON
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-book-button"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const item =
            findContentById(
                button.dataset
                    .contentId
            );


        if (
            item &&
            item.file_url
        ) {

            window.open(
                item.file_url,
                "_blank",
                "noopener,noreferrer"
            );

        }

    }
);


/* =========================================================
   CARD CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        /*
           Button click hole card click trigger korbe na
        */

        if (
            event.target.closest(
                "button"
            )
        ) {

            return;

        }


        const card =
            event.target.closest(
                ".movie-card, .story-card, .book-card, .upcoming-card, .featured-card"
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


/* =========================================================
   OPEN CONTENT
========================================================= */

function openContent(item) {

    if (!item) {

        return;

    }


    /* STORY */

    if (
        item.type === "story"
    ) {

        openStoryReader(
            item
        );


        return;

    }


    /* BOOK */

    if (
        item.type === "book"
    ) {

        if (
            item.file_url
        ) {

            window.open(
                item.file_url,
                "_blank",
                "noopener,noreferrer"
            );

        }


        return;

    }


    /* VIDEO FIRST */

    if (
        item.video_url
    ) {

        window.open(
            item.video_url,
            "_blank",
            "noopener,noreferrer"
        );


        return;

    }


    /* DOWNLOAD FALLBACK */

    if (
        item.download_url
    ) {

        window.open(
            item.download_url,
            "_blank",
            "noopener,noreferrer"
        );

    }

}


/* =========================================================
   STORY READER
========================================================= */

function openStoryReader(story) {

    const existingModal =
        document.getElementById(
            "storyReaderModal"
        );


    if (
        existingModal
    ) {

        existingModal.remove();

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
                background:rgba(0,0,0,.9);
            "
        >

            <div
                style="
                    position:relative;
                    width:min(760px,100%);
                    max-height:86vh;
                    overflow-y:auto;
                    padding:32px;
                    background:#101116;
                    border:1px solid rgba(255,255,255,.10);
                    border-radius:16px;
                "
            >

                <button
                    type="button"
                    id="closeStoryReader"
                    style="
                        position:absolute;
                        top:18px;
                        right:18px;
                        width:38px;
                        height:38px;
                        border:none;
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
                        padding-right:55px;
                        margin-bottom:8px;
                    "
                >

                    ${escapeHTML(
                        story.title ||
                        "Untitled Story"
                    )}

                </h2>


                ${
                    story.author
                        ?
                        `

                            <p
                                style="
                                    margin-bottom:24px;
                                    color:#ff1b2d;
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
                        color:rgba(255,255,255,.80);
                        line-height:1.9;
                        font-size:15px;
                    "
                >

                    ${escapeHTML(
                        story.full_content ||
                        "Story content is not available."
                    )}

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
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
                    event.target.classList
                        .contains(
                            "story-reader-overlay"
                        )
                ) {

                    modal.remove();

                }

            }
        );

}


/* =========================================================
   CREATE FEATURED SECTION
========================================================= */

function createFeaturedSection() {

    /*
       Already ache hole abar create korbe na
    */

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
            class="section-heading"
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
                    type="button"
                    id="featuredPrev"
                    aria-label="Previous"
                >

                    <i
                        class="fa-solid fa-chevron-left"
                    ></i>

                </button>


                <button
                    type="button"
                    id="featuredNext"
                    aria-label="Next"
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


/* =========================================================
   FEATURED SLIDER
   RATING 8+
========================================================= */

function setupFeaturedSlider() {

    const track =
        document.getElementById(
            "featuredTrack"
        );


    if (!track) {

        return;

    }


    featuredItems =
        databaseContents
            .filter(
                item => {

                    const rating =
                        Number(
                            item.rating
                        );


                    return (
                        Number.isFinite(
                            rating
                        )
                        &&
                        rating >= 8
                        &&
                        Boolean(
                            item.poster_url
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


    if (!featuredItems.length) {

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
                item => `

                    <article
                        class="featured-card"
                        data-content-id="${item.id}"
                    >

                        <div
                            class="featured-card-poster"
                            style='background-image:url("${escapeCssUrl(
                                item.poster_url
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


                            ${createHoverOverlay(
                                item
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
                                    item.title ||
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

                `
            )
            .join("");


    featuredIndex =
        0;


    updateFeaturedPosition();


    startFeaturedAutoPlay();


    document
        .getElementById(
            "featuredNext"
        )
        ?.addEventListener(
            "click",
            () => {

                featuredGoNext();

                startFeaturedAutoPlay();

            }
        );


    document
        .getElementById(
            "featuredPrev"
        )
        ?.addEventListener(
            "click",
            () => {

                featuredGoPrev();

                startFeaturedAutoPlay();

            }
        );


    const viewport =
        document.getElementById(
            "featuredViewport"
        );


    viewport?.addEventListener(
        "mouseenter",
        stopFeaturedAutoPlay
    );


    viewport?.addEventListener(
        "mouseleave",
        startFeaturedAutoPlay
    );

}


/* =========================================================
   FEATURED META
========================================================= */

function getFeaturedMeta(item) {

    if (
        item.type === "series"
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
        item.year ||
        item.genre ||
        ""
    );

}


/* =========================================================
   FEATURED VISIBLE COUNT
========================================================= */

function getFeaturedVisibleCount() {

    if (
        window.innerWidth <= 760
    ) {

        return 2;

    }


    if (
        window.innerWidth <= 1000
    ) {

        return 4;

    }


    return 5;

}


/* =========================================================
   FEATURED MAX INDEX
========================================================= */

function getFeaturedMaxIndex() {

    return Math.max(

        0,

        featuredItems.length
        -
        getFeaturedVisibleCount()

    );

}


/* =========================================================
   FEATURED POSITION
========================================================= */

function updateFeaturedPosition() {

    const track =
        document.getElementById(
            "featuredTrack"
        );


    const firstCard =
        track?.querySelector(
            ".featured-card"
        );


    if (
        !track ||
        !firstCard
    ) {

        return;

    }


    const trackStyle =
        getComputedStyle(
            track
        );


    const gap =
        parseFloat(
            trackStyle.gap ||
            "0"
        )
        ||
        0;


    const cardWidth =
        firstCard
            .getBoundingClientRect()
            .width;


    const step =
        cardWidth + gap;


    const maxIndex =
        getFeaturedMaxIndex();


    if (
        featuredIndex > maxIndex
    ) {

        featuredIndex =
            maxIndex;

    }


    track.style.transform =
        `translateX(-${featuredIndex * step}px)`;

}


/* =========================================================
   FEATURED NEXT
========================================================= */

function featuredGoNext() {

    const maxIndex =
        getFeaturedMaxIndex();


    if (
        maxIndex <= 0
    ) {

        return;

    }


    featuredIndex =
        featuredIndex >= maxIndex
            ?
            0
            :
            featuredIndex + 1;


    updateFeaturedPosition();

}


/* =========================================================
   FEATURED PREVIOUS
========================================================= */

function featuredGoPrev() {

    const maxIndex =
        getFeaturedMaxIndex();


    if (
        maxIndex <= 0
    ) {

        return;

    }


    featuredIndex =
        featuredIndex <= 0
            ?
            maxIndex
            :
            featuredIndex - 1;


    updateFeaturedPosition();

}


/* =========================================================
   FEATURED AUTO PLAY
========================================================= */

function startFeaturedAutoPlay() {

    stopFeaturedAutoPlay();


    featuredTimer =
        setInterval(
            featuredGoNext,
            4000
        );

}


/* =========================================================
   STOP FEATURED
========================================================= */

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


/* =========================================================
   HERO SETUP

   IMPORTANT:
   HERO USES banner_url ONLY
   poster_url NEVER USED HERE
========================================================= */

function setupDynamicHero() {

    if (!heroBackground) {

        return;

    }


    heroSlides =
        HERO_SEQUENCE
            .map(
                type => {

                    return databaseContents.find(
                        item =>
                            item.type === type
                            &&
                            Boolean(
                                item.banner_url
                            )
                    );

                }
            )
            .filter(Boolean);


    if (!heroSlides.length) {

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


    restartHeroTimer();

}


/* =========================================================
   SHOW HERO SLIDE
========================================================= */

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
        !item ||
        !item.banner_url
    ) {

        return;

    }


    heroIndex =
        index;


    const banner =
        item.banner_url;


    const applyBanner =
        () => {

            heroBackground
                .classList
                .remove(
                    "zoom"
                );


            heroBackground.style
                .backgroundImage =
                `url("${escapeCssUrl(
                    banner
                )}")`;


            heroBackground.style
                .backgroundSize =
                "cover";


            heroBackground.style
                .backgroundPosition =
                "center";


            heroBackground.style.opacity =
                "1";


            /*
               Restart zoom animation
            */

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

        applyBanner();


        return;

    }


    heroBackground.style.opacity =
        "0";


    setTimeout(
        applyBanner,
        350
    );

}


/* =========================================================
   HERO TIMER
========================================================= */

function restartHeroTimer() {

    if (
        heroTimer
    ) {

        clearInterval(
            heroTimer
        );

    }


    if (
        heroSlides.length <= 1
    ) {

        return;

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
            3800
        );

}


/* =========================================================
   HERO DOTS
========================================================= */

function renderHeroDots() {

    if (
        !heroDotsContainer
    ) {

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
                        aria-label="${escapeAttribute(
                            formatType(
                                item.type
                            )
                        )}"
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


                        restartHeroTimer();

                    }
                );

            }
        );

}


/* =========================================================
   HERO ACTIVE DOT
========================================================= */

function updateHeroDots() {

    if (
        !heroDotsContainer
    ) {

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


/* =========================================================
   SEARCH OPEN
========================================================= */

function openSearch() {

    if (
        !searchBox
    ) {

        return;

    }


    searchBox.classList.add(
        "active"
    );


    setTimeout(
        () => {

            searchInput?.focus();

        },
        100
    );

}


/* =========================================================
   SEARCH CLOSE
========================================================= */

function closeSearch() {

    if (
        !searchBox
    ) {

        return;

    }


    searchBox.classList.remove(
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


/* =========================================================
   SEARCH BUTTON
========================================================= */

if (
    searchToggle
) {

    searchToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                searchBox &&
                searchBox.classList
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


/* =========================================================
   SEARCH CLOSE BUTTON
========================================================= */

if (
    searchClose
) {

    searchClose.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            closeSearch();

        }
    );

}


/* =========================================================
   SEARCH INPUT
========================================================= */

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        event => {

            performSearch(
                event.target.value
            );

        }
    );

}


/* =========================================================
   SEARCH FUNCTION
========================================================= */

function performSearch(keyword) {

    if (
        !searchResults
    ) {

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

                    const searchableText = [

                        item.title,

                        item.genre,

                        item.author,

                        TYPE_LABELS[
                            item.type
                        ]

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        text
                    );

                }
            );


    if (!results.length) {

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
                                    item.title ||
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


/* =========================================================
   SEARCH RESULT CLICK
========================================================= */

if (
    searchResults
) {

    searchResults.addEventListener(
        "click",
        event => {

            const result =
                event.target.closest(
                    ".dynamic-search-result"
                );


            if (!result) {

                return;

            }


            const type =
                result.dataset.type;


            closeSearch();


            const section =
                document.getElementById(
                    TYPE_SECTIONS[
                        type
                    ]
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


/* =========================================================
   CLICK OUTSIDE SEARCH
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !searchBox
        ) {

            return;

        }


        const insideSearch =
            searchBox.contains(
                event.target
            );


        const clickedSearchButton =
            searchToggle &&
            searchToggle.contains(
                event.target
            );


        if (
            !insideSearch &&
            !clickedSearchButton
        ) {

            closeSearch();

        }

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function closeMobileMenu() {

    if (
        !mobileNav
    ) {

        return;

    }


    mobileNav.classList.remove(
        "active"
    );


    const icon =
        mobileMenuButton
            ?.querySelector(
                "i"
            );


    if (
        icon
    ) {

        icon.classList.remove(
            "fa-xmark"
        );


        icon.classList.add(
            "fa-bars"
        );

    }

}


/* =========================================================
   MOBILE MENU BUTTON
========================================================= */

if (
    mobileMenuButton
) {

    mobileMenuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                !mobileNav
            ) {

                return;

            }


            mobileNav.classList.toggle(
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


            const open =
                mobileNav.classList
                    .contains(
                        "active"
                    );


            icon.classList.toggle(
                "fa-bars",
                !open
            );


            icon.classList.toggle(
                "fa-xmark",
                open
            );

        }
    );

}


/* =========================================================
   MOBILE NAV LINKS
========================================================= */

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


/* =========================================================
   SMOOTH SCROLL
========================================================= */

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


                    if (
                        !target
                    ) {

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


/* =========================================================
   ACTIVE NAVBAR LINK
========================================================= */

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


                const sectionTop =
                    section.offsetTop
                    -
                    150;


                const sectionBottom =
                    sectionTop
                    +
                    section.offsetHeight;


                if (
                    window.scrollY >=
                    sectionTop
                    &&
                    window.scrollY <
                    sectionBottom
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


/* =========================================================
   ESC KEY
========================================================= */

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


        const storyModal =
            document.getElementById(
                "storyReaderModal"
            );


        if (
            storyModal
        ) {

            storyModal.remove();

        }

    }
);


/* =========================================================
   DATABASE ERROR
========================================================= */

function showDatabaseError() {

    const gridIds = [

        "moviesGrid",

        "natokGrid",

        "webseriesGrid",

        "upcomingGrid",

        "storiesGrid",

        "booksGrid",

        "tutorialGrid"

    ];


    gridIds.forEach(
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


/* =========================================================
   HAS RATING
========================================================= */

function hasRating(item) {

    return (
        item &&
        item.rating !== null &&
        item.rating !== undefined &&
        item.rating !== ""
    );

}


/* =========================================================
   FORMAT TYPE
========================================================= */

function formatType(type) {

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


/* =========================================================
   TYPE ICON
========================================================= */

function getTypeIcon(type) {

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


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (
        !date
    ) {

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

    catch (error) {

        return date;

    }

}


/* =========================================================
   EMPTY MESSAGE
========================================================= */

function emptyMessage(message) {

    return `

        <div
            class="database-loading"
        >

            ${escapeHTML(
                message
            )}

        </div>

    `;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
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


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   ESCAPE CSS URL
========================================================= */

function escapeCssUrl(value) {

    return String(
        value || ""
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


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
           Temporary fallback while DB loads
        */

        if (
            heroBackground
        ) {

            heroBackground.style
                .backgroundImage =
                "linear-gradient(120deg,#11001f 0%,#2a075c 48%,#4d0c79 100%)";


            heroBackground.style.opacity =
                "1";

        }


        updateActiveNav();


        await loadWebsiteContents();

    }
);