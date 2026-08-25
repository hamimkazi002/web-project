/* =====================================================
   CINEMA MELLA
   MAIN WEBSITE
   DATABASE VERSION
===================================================== */


/* =====================================================
   SUPABASE CONFIG
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
   DATABASE CONTENT
===================================================== */

let databaseContents = [];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const changingLogo =
    document.getElementById(
        "logoChangingText"
    );


const heroBackground =
    document.getElementById(
        "heroBackground"
    );


const heroDots =
    document.querySelectorAll(
        ".hero-dot"
    );


const searchIconButton =
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
   LOGO TEXT
===================================================== */

const logoWords = [
    "MELLA",
    "HUB"
];


let logoIndex = 0;


function changeLogoText() {

    if (!changingLogo) {
        return;
    }


    changingLogo.style.opacity =
        "0";


    changingLogo.style.transform =
        "translateY(-5px)";


    setTimeout(() => {

        changingLogo.textContent =
            logoWords[logoIndex];


        changingLogo.style.opacity =
            "1";


        changingLogo.style.transform =
            "translateY(0)";


        logoIndex++;


        if (
            logoIndex >=
            logoWords.length
        ) {

            logoIndex = 0;

        }

    }, 250);

}


setInterval(
    changeLogoText,
    2500
);


/* =====================================================
   HERO SLIDER
===================================================== */

const heroImages = [

    "linear-gradient(120deg, #1a0033 0%, #3a0ca3 45%, #7209b7 100%)",

    "linear-gradient(120deg, #2c0703 0%, #6a040f 45%, #9d0208 100%)",

    "linear-gradient(120deg, #03071e 0%, #10002b 45%, #3c096c 100%)",

    "linear-gradient(120deg, #0f3057 0%, #00587a 45%, #14213d 100%)"

];


let currentHeroIndex = 0;


function updateHeroDots(index) {

    heroDots.forEach(
        (
            dot,
            dotIndex
        ) => {

            dot.classList.toggle(
                "active",
                dotIndex === index
            );

        }
    );

}


function showHeroImage(index) {

    if (!heroBackground) {
        return;
    }


    heroBackground.style.opacity =
        "0";


    setTimeout(() => {

        heroBackground.style.backgroundImage =
            heroImages[index];


        heroBackground.style.transition =
            "opacity 0.65s ease";


        heroBackground.classList.remove(
            "zoom"
        );


        heroBackground.style.opacity =
            "1";


        void heroBackground.offsetWidth;


        heroBackground.style.transition =
            "opacity 0.65s ease, transform 4s cubic-bezier(0.2, 0.5, 0.3, 1)";


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                heroBackground.classList.add(
                    "zoom"
                );

            });

        });


        updateHeroDots(index);

    }, 450);

}


/* INITIAL HERO */

if (heroBackground) {

    heroBackground.style.backgroundImage =
        heroImages[0];


    heroBackground.style.opacity =
        "1";


    setTimeout(() => {

        heroBackground.classList.add(
            "zoom"
        );

    }, 300);

}


/* AUTO HERO */

let heroTimer =
    setInterval(() => {

        currentHeroIndex++;


        if (
            currentHeroIndex >=
            heroImages.length
        ) {

            currentHeroIndex = 0;

        }


        showHeroImage(
            currentHeroIndex
        );

    }, 4000);


/* DOT CLICK */

heroDots.forEach(
    (
        dot,
        index
    ) => {

        dot.addEventListener(
            "click",
            () => {

                currentHeroIndex =
                    index;


                showHeroImage(
                    currentHeroIndex
                );


                clearInterval(
                    heroTimer
                );


                heroTimer =
                    setInterval(() => {

                        currentHeroIndex++;


                        if (
                            currentHeroIndex >=
                            heroImages.length
                        ) {

                            currentHeroIndex = 0;

                        }


                        showHeroImage(
                            currentHeroIndex
                        );

                    }, 4000);

            }
        );

    }
);


/* =====================================================
   LOAD SUPABASE CONTENT
===================================================== */

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


        renderMovies();

        renderNatok();

        renderSeries();

        renderUpcoming();

        renderStories();

        renderBooks();

        renderEducation();


        console.log(
            "Database content loaded:",
            databaseContents
        );

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
   MOVIES
===================================================== */

function renderMovies() {

    const grid =
        document.getElementById(
            "moviesGrid"
        );


    if (!grid) {
        return;
    }


    const movies =
        databaseContents.filter(
            item =>
                item.type ===
                "movie"
        );


    if (
        movies.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No movies added yet."
            );

        return;

    }


    grid.innerHTML =
        movies
            .map(
                item =>
                    createVideoCard(
                        item,
                        "MOVIE"
                    )
            )
            .join("");

}


/* =====================================================
   NATOK
===================================================== */

function renderNatok() {

    const grid =
        document.getElementById(
            "natokGrid"
        );


    if (!grid) {
        return;
    }


    const natok =
        databaseContents.filter(
            item =>
                item.type ===
                "natok"
        );


    if (
        natok.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No natok added yet."
            );

        return;

    }


    grid.innerHTML =
        natok
            .map(
                item =>
                    createVideoCard(
                        item,
                        "NATOK"
                    )
            )
            .join("");

}


/* =====================================================
   WEB SERIES
===================================================== */

function renderSeries() {

    const grid =
        document.getElementById(
            "webseriesGrid"
        );


    if (!grid) {
        return;
    }


    const series =
        databaseContents.filter(
            item =>
                item.type ===
                "series"
        );


    if (
        series.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No web series added yet."
            );

        return;

    }


    grid.innerHTML =
        series
            .map(
                item =>
                    createVideoCard(
                        item,
                        "WEB SERIES"
                    )
            )
            .join("");

}


/* =====================================================
   VIDEO CARD
===================================================== */

function createVideoCard(
    item,
    category
) {

    const posterStyle =
        item.poster_url
            ? `
                background-image:
                url("${escapeAttribute(
                    item.poster_url
                )}");
            `
            : "";


    let leftMeta = "";


    if (
        item.type ===
        "series"
    ) {

        if (item.season) {

            leftMeta =
                `S${String(
                    item.season
                ).padStart(
                    2,
                    "0"
                )}`;

        }

    }

    else {

        leftMeta =
            item.year || "";

    }


    return `

        <article
            class="movie-card"
            data-content-id="${item.id}"
        >

            <div
                class="movie-poster"
                style='${posterStyle}'
            >


                ${
                    item.badge
                        ? `

                            <span
                                class="content-badge"
                            >

                                ${escapeHTML(
                                    item.badge
                                )}

                            </span>

                        `
                        : ""
                }


                ${
                    item.video_url
                        ? `

                            <button
                                class="poster-play dynamic-play"
                                type="button"
                                data-video="${escapeAttribute(
                                    item.video_url
                                )}"
                            >

                                <i
                                    class="fa-solid fa-play"
                                ></i>

                            </button>

                        `
                        : ""
                }

            </div>


            <div class="card-info">


                <span class="card-category">

                    ${category}

                </span>


                <h3>

                    ${escapeHTML(
                        item.title ||
                        "Untitled"
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        item.description ||
                        ""
                    )}

                </p>


                <div class="card-meta">


                    <span>

                        ${escapeHTML(
                            leftMeta
                        )}

                    </span>


                    <span>

                        ${
                            item.rating
                                ? `

                                    <i
                                        class="fa-solid fa-star"
                                    ></i>

                                    ${escapeHTML(
                                        item.rating
                                    )}

                                `
                                : ""
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


    const upcoming =
        databaseContents.filter(
            item =>
                item.type ===
                "upcoming"
        );


    if (
        upcoming.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No upcoming content."
            );

        return;

    }


    grid.innerHTML =
        upcoming
            .map(item => {

                const image =
                    item.banner_url ||
                    item.poster_url;


                const backgroundStyle =
                    image
                        ? `
                            background-image:
                            url("${escapeAttribute(
                                image
                            )}");
                        `
                        : "";


                return `

                    <article
                        class="upcoming-card"
                    >


                        <div
                            class="upcoming-poster"
                            style='${backgroundStyle}'
                        >


                            <span
                                class="coming-badge"
                            >

                                ${escapeHTML(
                                    item.badge ||
                                    "COMING SOON"
                                )}

                            </span>

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


                            ${
                                item.release_date
                                    ? `

                                        <p>

                                            ${escapeHTML(
                                                formatDate(
                                                    item.release_date
                                                )
                                            )}

                                        </p>

                                    `
                                    : ""
                            }


                            <p>

                                ${escapeHTML(
                                    item.description ||
                                    ""
                                )}

                            </p>

                        </div>

                    </article>

                `;

            })
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


    const stories =
        databaseContents.filter(
            item =>
                item.type ===
                "story"
        );


    if (
        stories.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No stories added yet."
            );

        return;

    }


    grid.innerHTML =
        stories
            .map(item => {

                const backgroundStyle =
                    item.poster_url
                        ? `
                            background-image:
                            url("${escapeAttribute(
                                item.poster_url
                            )}");
                        `
                        : "";


                return `

                    <article
                        class="story-card"
                    >


                        <div
                            class="story-image"
                            style='${backgroundStyle}'
                        >


                            <span
                                class="story-badge"
                            >

                                ${
                                    item.featured
                                        ? "FEATURED"
                                        : "STORY"
                                }

                            </span>

                        </div>


                        <div
                            class="story-info"
                        >


                            <span
                                class="story-date"
                            >

                                ${
                                    item.release_date
                                        ? escapeHTML(
                                            formatDate(
                                                item.release_date
                                            )
                                        )
                                        : ""
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
                                    ? `

                                        <p>

                                            By ${escapeHTML(
                                                item.author
                                            )}

                                        </p>

                                    `
                                    : ""
                            }


                            <p>

                                ${escapeHTML(
                                    item.description ||
                                    ""
                                )}

                            </p>


                            <button
                                class="story-button dynamic-story"
                                type="button"
                                data-id="${item.id}"
                            >

                                Read Story

                                <i
                                    class="fa-solid fa-arrow-right"
                                ></i>

                            </button>

                        </div>

                    </article>

                `;

            })
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


    const books =
        databaseContents.filter(
            item =>
                item.type ===
                "book"
        );


    if (
        books.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No books added yet."
            );

        return;

    }


    grid.innerHTML =
        books
            .map(item => {

                const backgroundStyle =
                    item.poster_url
                        ? `
                            background-image:
                            url("${escapeAttribute(
                                item.poster_url
                            )}");
                        `
                        : "";


                return `

                    <article
                        class="book-card"
                    >


                        <div
                            class="book-cover"
                            style='${backgroundStyle}'
                        >


                            <span
                                class="book-badge"
                            >

                                ${
                                    item.featured
                                        ? "FEATURED"
                                        : "BOOK"
                                }

                            </span>

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
                                    ? `

                                        <p>

                                            By ${escapeHTML(
                                                item.author
                                            )}

                                        </p>

                                    `
                                    : ""
                            }


                            <p>

                                ${escapeHTML(
                                    item.description ||
                                    ""
                                )}

                            </p>


                            ${
                                item.file_url
                                    ? `

                                        <button
                                            class="book-button dynamic-book"
                                            type="button"
                                            data-file="${escapeAttribute(
                                                item.file_url
                                            )}"
                                        >

                                            Read Book

                                            <i
                                                class="fa-solid fa-arrow-right"
                                            ></i>

                                        </button>

                                    `
                                    : ""
                            }

                        </div>

                    </article>

                `;

            })
            .join("");

}


/* =====================================================
   EDUCATION
===================================================== */

function renderEducation() {

    const grid =
        document.getElementById(
            "educationGrid"
        );


    if (!grid) {
        return;
    }


    const education =
        databaseContents.filter(
            item =>
                item.type ===
                "education"
        );


    if (
        education.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "No education content added yet."
            );

        return;

    }


    grid.innerHTML =
        education
            .map(item =>
                createEducationCard(item)
            )
            .join("");

}


function createEducationCard(item) {

    const posterStyle =
        item.poster_url
            ? `
                background-image:
                url("${escapeAttribute(
                    item.poster_url
                )}");
            `
            : "";


    return `

        <article
            class="movie-card"
            data-content-id="${item.id}"
        >

            <div
                class="movie-poster"
                style='${posterStyle}'
            >


                ${
                    item.genre
                        ? `

                            <span
                                class="content-badge"
                            >

                                ${escapeHTML(
                                    item.genre
                                )}

                            </span>

                        `
                        : ""
                }


                ${
                    item.video_url
                        ? `

                            <button
                                class="poster-play dynamic-play"
                                type="button"
                                data-video="${escapeAttribute(
                                    item.video_url
                                )}"
                            >

                                <i
                                    class="fa-solid fa-play"
                                ></i>

                            </button>

                        `
                        : ""
                }

            </div>


            <div class="card-info">


                <span class="card-category">
                    EDUCATION
                </span>


                <h3>

                    ${escapeHTML(
                        item.title ||
                        "Untitled"
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        item.description ||
                        ""
                    )}

                </p>


                <div class="card-meta">

                    <span>

                        ${escapeHTML(
                            item.year || ""
                        )}

                    </span>

                    <span></span>

                </div>


                ${
                    item.download_url
                        ? `

                            <button
                                class="book-button dynamic-book"
                                type="button"
                                data-file="${escapeAttribute(
                                    item.download_url
                                )}"
                                style="margin-top: 12px;"
                            >

                                Download

                                <i
                                    class="fa-solid fa-download"
                                ></i>

                            </button>

                        `
                        : ""
                }

            </div>

        </article>

    `;

}


/* =====================================================
   DYNAMIC BUTTON CLICK
===================================================== */

document.addEventListener(
    "click",
    event => {


        /* VIDEO */

        const playButton =
            event.target.closest(
                ".dynamic-play"
            );


        if (playButton) {

            event.stopPropagation();


            const videoUrl =
                playButton.dataset.video;


            if (videoUrl) {

                window.open(
                    videoUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }


            return;

        }


        /* STORY */

        const storyButton =
            event.target.closest(
                ".dynamic-story"
            );


        if (storyButton) {

            const storyId =
                Number(
                    storyButton.dataset.id
                );


            const story =
                databaseContents.find(
                    item =>
                        Number(
                            item.id
                        ) ===
                        storyId
                );


            if (story) {

                openStoryReader(
                    story
                );

            }


            return;

        }


        /* BOOK / DOWNLOAD */

        const bookButton =
            event.target.closest(
                ".dynamic-book"
            );


        if (bookButton) {

            const fileUrl =
                bookButton.dataset.file;


            if (fileUrl) {

                window.open(
                    fileUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }

        }

    }
);


/* =====================================================
   STORY MODAL
===================================================== */

function openStoryReader(story) {

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
            style="
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.88);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            "
        >


            <div
                style="
                    position: relative;
                    width: min(760px, 100%);
                    max-height: 86vh;
                    overflow-y: auto;
                    background: #101116;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 32px;
                "
            >


                <button
                    id="closeStoryReader"
                    type="button"
                    style="
                        position: absolute;
                        top: 18px;
                        right: 18px;
                        width: 38px;
                        height: 38px;
                        border: none;
                        border-radius: 50%;
                        background: #ef1024;
                        color: #ffffff;
                        cursor: pointer;
                    "
                >

                    <i
                        class="fa-solid fa-xmark"
                    ></i>

                </button>


                <h2
                    style="
                        padding-right: 50px;
                        margin-bottom: 8px;
                    "
                >

                    ${escapeHTML(
                        story.title
                    )}

                </h2>


                ${
                    story.author
                        ? `

                            <p
                                style="
                                    color: #ff1b2d;
                                    margin-bottom: 24px;
                                "
                            >

                                By ${escapeHTML(
                                    story.author
                                )}

                            </p>

                        `
                        : ""
                }


                <div
                    style="
                        white-space: pre-wrap;
                        color: rgba(255,255,255,0.78);
                        line-height: 1.9;
                        font-size: 15px;
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


    const closeButton =
        document.getElementById(
            "closeStoryReader"
        );


    closeButton.addEventListener(
        "click",
        () => {

            modal.remove();

        }
    );

}


/* =====================================================
   SEARCH OPEN
===================================================== */

function openSearch() {

    if (!searchBox) {
        return;
    }


    searchBox.classList.add(
        "active"
    );


    setTimeout(() => {

        if (searchInput) {

            searchInput.focus();

        }

    }, 100);

}


/* =====================================================
   SEARCH CLOSE
===================================================== */

function closeSearch() {

    if (!searchBox) {
        return;
    }


    searchBox.classList.remove(
        "active"
    );


    if (searchInput) {

        searchInput.value =
            "";

    }


    if (searchResults) {

        searchResults.innerHTML =
            "";

    }

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

if (searchIconButton) {

    searchIconButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                searchBox &&
                searchBox.classList.contains(
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


/* =====================================================
   SEARCH CLOSE BUTTON
===================================================== */

if (searchClose) {

    searchClose.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            closeSearch();

        }
    );

}


/* =====================================================
   PERFORM SEARCH
===================================================== */

function performSearch(keyword) {

    if (!searchResults) {
        return;
    }


    const searchText =
        keyword
            .trim()
            .toLowerCase();


    if (!searchText) {

        searchResults.innerHTML =
            "";

        return;

    }


    const results =
        databaseContents.filter(
            item => {


                const title =
                    String(
                        item.title ||
                        ""
                    )
                    .toLowerCase();


                const category =
                    formatType(
                        item.type
                    )
                    .toLowerCase();


                const genre =
                    String(
                        item.genre ||
                        ""
                    )
                    .toLowerCase();


                const author =
                    String(
                        item.author ||
                        ""
                    )
                    .toLowerCase();


                return (

                    title.includes(
                        searchText
                    )

                    ||

                    category.includes(
                        searchText
                    )

                    ||

                    genre.includes(
                        searchText
                    )

                    ||

                    author.includes(
                        searchText
                    )

                );

            }
        );


    if (
        results.length === 0
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
            .map(item => {

                return `

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

                `;

            })
            .join("");

}


/* =====================================================
   SEARCH INPUT
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        event => {

            performSearch(
                event.target.value
            );

        }
    );

}


/* =====================================================
   SEARCH RESULT CLICK
===================================================== */

if (searchResults) {

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


            const sectionId =
                getSectionFromType(
                    type
                );


            const target =
                document.getElementById(
                    sectionId
                );


            closeSearch();


            if (target) {

                target.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

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


        const clickedSearchButton =
            searchIconButton &&
            searchIconButton.contains(
                event.target
            );


        if (
            !clickedInside &&
            !clickedSearchButton
        ) {

            closeSearch();

        }

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

function closeMobileMenu() {

    if (!mobileNav) {
        return;
    }


    mobileNav.classList.remove(
        "active"
    );


    if (mobileMenuButton) {

        const icon =
            mobileMenuButton.querySelector(
                "i"
            );


        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );


            icon.classList.add(
                "fa-bars"
            );

        }

    }

}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (!mobileNav) {
                return;
            }


            mobileNav.classList.toggle(
                "active"
            );


            const icon =
                mobileMenuButton.querySelector(
                    "i"
                );


            if (!icon) {
                return;
            }


            if (
                mobileNav.classList.contains(
                    "active"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );


                icon.classList.add(
                    "fa-xmark"
                );

            }

            else {

                icon.classList.remove(
                    "fa-xmark"
                );


                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}


/* =====================================================
   MOBILE LINKS
===================================================== */

if (mobileNav) {

    mobileNav
        .querySelectorAll(
            "a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });

}


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }
        );

    });


/* =====================================================
   ACTIVE NAV
===================================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


function updateActiveNav() {

    let currentSection =
        "";


    sections.forEach(
        section => {

            const sectionTop =
                section.offsetTop -
                150;


            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                window.scrollY >=
                    sectionTop

                &&

                window.scrollY <
                    sectionBottom
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navLinks.forEach(
        link => {

            link.classList.toggle(
                "active",
                link.getAttribute(
                    "href"
                ) ===
                `#${currentSection}`
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


        if (modal) {

            modal.remove();

        }

    }
);


/* =====================================================
   ERROR UI
===================================================== */

function showDatabaseError() {

    const grids = [

        "moviesGrid",
        "natokGrid",
        "webseriesGrid",
        "upcomingGrid",
        "storiesGrid",
        "booksGrid",
        "educationGrid"

    ];


    grids.forEach(id => {

        const grid =
            document.getElementById(
                id
            );


        if (grid) {

            grid.innerHTML =
                emptyMessage(
                    "Unable to load content."
                );

        }

    });

}


/* =====================================================
   FORMAT TYPE
===================================================== */

function formatType(type) {

    const typeNames = {

        movie:
            "Movie",

        natok:
            "Natok",

        series:
            "Web Series",

        upcoming:
            "Upcoming",

        story:
            "Story",

        book:
            "Book",

        education:
            "Education"

    };


    return (
        typeNames[type] ||
        type ||
        ""
    );

}


/* =====================================================
   SECTION FROM TYPE
===================================================== */

function getSectionFromType(type) {

    const sectionsMap = {

        movie:
            "movies",

        natok:
            "natok",

        series:
            "webseries",

        upcoming:
            "upcoming",

        story:
            "stories",

        book:
            "books",

        education:
            "education"

    };


    return (
        sectionsMap[type] ||
        "home"
    );

}


/* =====================================================
   TYPE ICON
===================================================== */

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

        education:
            "fa-solid fa-graduation-cap"

    };


    return (
        icons[type] ||
        "fa-solid fa-film"
    );

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {

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

    catch (error) {

        return date;

    }

}


/* =====================================================
   EMPTY MESSAGE
===================================================== */

function emptyMessage(message) {

    return `

        <div
            style="
                grid-column: 1 / -1;
                padding: 35px 20px;
                text-align: center;
                color: rgba(255,255,255,0.42);
                background: #101116;
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 12px;
            "
        >

            ${escapeHTML(
                message
            )}

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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


/* =====================================================
   ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


/* =====================================================
   PAGE START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        updateActiveNav();


        await loadWebsiteContents();


        console.log(
            "Cinema Mella website loaded."
        );

    }
);