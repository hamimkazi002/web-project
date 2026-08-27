/* =========================================================
   CINEMA MELLA / HUB
   FINAL PUBLIC SCRIPT.JS

   HERO = 4 SECONDS
   DESKTOP FEATURED = 4 CARDS
   TABLET = 3
   MOBILE = 2

   NO DATABASE CHANGE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   GLOBAL
========================================================= */

let contents = [];

let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;
let heroZoomAnimation = null;

let featuredItems = [];
let featuredIndex = 0;
let featuredTimer = null;


/* =========================================================
   TYPE SETTINGS
========================================================= */

const TYPE_LABEL = {
    movie: "Movie",
    natok: "Natok",
    series: "Web Series",
    upcoming: "Upcoming",
    story: "Story",
    book: "Book",
    tutorial: "Tutorial"
};

const TYPE_SECTION = {
    movie: "movies",
    natok: "natok",
    series: "webseries",
    upcoming: "upcoming",
    story: "stories",
    book: "books",
    tutorial: "tutorial"
};

const TYPE_GRID = {
    movie: "moviesGrid",
    natok: "natokGrid",
    series: "webseriesGrid",
    upcoming: "upcomingGrid",
    story: "storiesGrid",
    book: "booksGrid",
    tutorial: "tutorialGrid"
};

const HERO_ORDER = [
    "movie",
    "natok",
    "series",
    "upcoming",
    "story",
    "book",
    "tutorial"
];

const selectedGenre = {
    movie: "all",
    natok: "all",
    series: "all",
    upcoming: "all",
    story: "all",
    book: "all",
    tutorial: "all"
};


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   HEADER LOGO
========================================================= */

function setupHeaderLogo() {

    const logo = $("logoChangingText");

    if (!logo) return;

    const words = [
        "MELLA",
        "HUB"
    ];

    let index = 0;

    setInterval(() => {

        index =
            (index + 1) %
            words.length;

        logo.style.opacity = "0";

        logo.style.transform =
            "translateY(5px)";

        setTimeout(() => {

            logo.textContent =
                words[index];

            logo.style.opacity = "1";

            logo.style.transform =
                "translateY(0)";

        }, 250);

    }, 2500);
}


/* =========================================================
   LOAD CONTENT
========================================================= */

async function loadContents() {

    try {

        const {
            data,
            error
        } = await db
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

        contents =
            data || [];

        createDropdowns();

        renderDropdownCategories();

        renderAllSections();

        createFeaturedSection();

        setupFeatured();

        setupHero();

        updateActiveNav();

    } catch (error) {

        console.error(
            "Content load error:",
            error
        );

        showLoadError();
    }
}


/* =========================================================
   GENRE
========================================================= */

function splitGenres(value) {

    return String(value || "")
        .split(",")
        .map(
            item => item.trim()
        )
        .filter(Boolean);
}


function getGenres(type) {

    const result = [];

    contents
        .filter(
            item =>
                item.type === type
        )
        .forEach(item => {

            splitGenres(
                item.genre
            )
                .forEach(genre => {

                    const exists =
                        result.some(
                            old =>
                                old.toLowerCase()
                                ===
                                genre.toLowerCase()
                        );

                    if (!exists) {

                        result.push(
                            genre
                        );
                    }
                });
        });

    return result.sort(
        (a, b) =>
            a.localeCompare(b)
    );
}


/* =========================================================
   NAVBAR DROPDOWNS
========================================================= */

function createDropdowns() {

    const nav =
        document.querySelector(
            ".nav-menu"
        );

    if (!nav) return;

    const map = {
        "#movies": "movie",
        "#natok": "natok",
        "#webseries": "series",
        "#upcoming": "upcoming",
        "#stories": "story",
        "#books": "book",
        "#tutorial": "tutorial"
    };

    Object
        .entries(map)
        .forEach(
            ([href, type]) => {

                const link =
                    nav.querySelector(
                        `a.nav-link[href="${href}"]`
                    );

                if (!link) return;

                if (
                    link.parentElement
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

                wrapper.dataset.type =
                    type;

                const menu =
                    document.createElement(
                        "div"
                    );

                menu.className =
                    "genre-dropdown-menu";

                menu.innerHTML = `

                    <div class="genre-dropdown-head">
                        ${escapeHTML(
                            TYPE_LABEL[type]
                        )}
                    </div>

                    <div
                        class="genre-menu-dynamic"
                    ></div>

                `;

                link.parentNode.insertBefore(
                    wrapper,
                    link
                );

                wrapper.appendChild(
                    link
                );

                wrapper.appendChild(
                    menu
                );
            }
        );
}


/* =========================================================
   CATEGORY MENU
========================================================= */

function renderDropdownCategories() {

    document
        .querySelectorAll(
            ".nav-category-dropdown"
        )
        .forEach(wrapper => {

            const type =
                wrapper.dataset.type;

            const box =
                wrapper.querySelector(
                    ".genre-menu-dynamic"
                );

            if (!type || !box) {
                return;
            }

            let html = `

                <button
                    type="button"
                    class="genre-menu-item active"
                    data-type="${type}"
                    data-genre="all"
                >

                    All ${escapeHTML(
                        TYPE_LABEL[type]
                    )}

                </button>

            `;

            getGenres(type)
                .forEach(genre => {

                    html += `

                        <button
                            type="button"
                            class="genre-menu-item"
                            data-type="${type}"
                            data-genre="${escapeAttribute(
                                genre
                            )}"
                        >

                            ${escapeHTML(
                                genre
                            )}

                        </button>

                    `;
                });

            box.innerHTML =
                html;
        });
}


/* =========================================================
   CATEGORY CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".genre-menu-item"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const type =
            button.dataset.type;

        const genre =
            button.dataset.genre ||
            "all";

        if (!type) return;

        selectedGenre[type] =
            genre;

        const wrapper =
            button.closest(
                ".nav-category-dropdown"
            );

        wrapper
            ?.querySelectorAll(
                ".genre-menu-item"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );
            });

        button.classList.add(
            "active"
        );

        renderType(type);

        $(
            TYPE_SECTION[type]
        )
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
);


/* =========================================================
   FILTER
========================================================= */

function getItems(type) {

    const genre =
        selectedGenre[type] ||
        "all";

    return contents
        .filter(
            item =>
                item.type === type
        )
        .filter(item => {

            if (
                genre === "all"
            ) {
                return true;
            }

            return splitGenres(
                item.genre
            )
                .some(
                    current =>
                        current.toLowerCase()
                        ===
                        genre.toLowerCase()
                );
        });
}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAllSections() {

    HERO_ORDER.forEach(
        type => {
            renderType(type);
        }
    );
}


/* =========================================================
   RENDER ONE SECTION
========================================================= */

function renderType(type) {

    const grid =
        $(
            TYPE_GRID[type]
        );

    if (!grid) return;

    grid.classList.add(
        "uniform-content-grid"
    );

    const items =
        getItems(type);

    if (!items.length) {

        grid.innerHTML = `

            <div class="database-loading">

                No ${escapeHTML(
                    TYPE_LABEL[type]
                )} content found.

            </div>

        `;

        return;
    }

    grid.innerHTML =
        items
            .map(
                createStandardCard
            )
            .join("");
}


/* =========================================================
   SAME CARD FOR ALL SECTIONS
========================================================= */

function createStandardCard(item) {

    const poster =
        item.poster_url ||
        "";

    const typeName =
        TYPE_LABEL[item.type] ||
        item.type;

    return `

        <article
            class="movie-card uniform-content-card"
            data-content-id="${item.id}"
        >

            <div
                class="movie-poster uniform-card-poster"
                style="${
                    poster
                        ?
                        `background-image:url('${escapeCssUrl(
                            poster
                        )}')`
                        :
                        ""
                }"
            >

                ${
                    item.badge
                        ?
                        `

                            <span class="content-badge">

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
                class="card-info uniform-card-info"
            >

                <span class="card-category">

                    ${escapeHTML(
                        typeName.toUpperCase()
                    )}

                </span>


                <h3>

                    ${escapeHTML(
                        item.title ||
                        "Untitled"
                    )}

                </h3>


                <div class="card-meta">

                    <span>

                        ${escapeHTML(
                            getCardMeta(
                                item
                            )
                        )}

                    </span>


                    <span>

                        ${
                            hasRating(item)
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


                <div class="card-actions">

                    ${getCardButtons(
                        item
                    )}

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   CARD META
========================================================= */

function getCardMeta(item) {

    if (
        item.type === "series"
        &&
        item.season
    ) {

        return `Season ${item.season}`;
    }

    if (
        item.type === "upcoming"
        &&
        item.release_date
    ) {

        return formatDate(
            item.release_date
        );
    }

    if (
        (
            item.type === "story"
            ||
            item.type === "book"
        )
        &&
        item.author
    ) {

        return item.author;
    }

    return String(
        item.year
        ||
        item.genre
        ||
        ""
    );
}


/* =========================================================
   CARD BUTTONS
========================================================= */

function getCardButtons(item) {

    /* MOVIE / NATOK / SERIES / TUTORIAL */

    if (
        [
            "movie",
            "natok",
            "series",
            "tutorial"
        ].includes(
            item.type
        )
    ) {

        return `

            <button
                type="button"
                class="content-download-button ${
                    !item.download_url
                        ?
                        "is-disabled"
                        :
                        ""
                }"
                data-content-id="${item.id}"
            >

                <i
                    class="fa-solid fa-download"
                ></i>

                Download

            </button>

        `;
    }


    /* STORY */

    if (
        item.type === "story"
    ) {

        return `

            <button
                type="button"
                class="story-button content-story-button"
                data-content-id="${item.id}"
            >

                <i
                    class="fa-solid fa-book-open"
                ></i>

                Read

            </button>


            <button
                type="button"
                class="content-download-button story-pdf-download"
                data-content-id="${item.id}"
            >

                <i
                    class="fa-solid fa-file-pdf"
                ></i>

                Download PDF

            </button>

        `;
    }


    /* BOOK */

    if (
        item.type === "book"
    ) {

        return `

            <button
                type="button"
                class="book-button content-book-button ${
                    !item.file_url
                        ?
                        "is-disabled"
                        :
                        ""
                }"
                data-content-id="${item.id}"
            >

                <i
                    class="fa-solid fa-book-open"
                ></i>

                Read Book

            </button>


            <button
                type="button"
                class="content-download-button book-pdf-download ${
                    !item.file_url
                        ?
                        "is-disabled"
                        :
                        ""
                }"
                data-content-id="${item.id}"
            >

                <i
                    class="fa-solid fa-file-pdf"
                ></i>

                Download PDF

            </button>

        `;
    }

    return "";
}


/* =========================================================
   HOVER DESCRIPTION
========================================================= */

function createHoverOverlay(item) {

    return `

        <div class="card-hover-overlay">

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

            <span class="card-hover-action">

                ${escapeHTML(
                    getHoverText(
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


function getHoverText(item) {

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
        item.type === "upcoming"
    ) {
        return "Coming Soon";
    }

    if (
        item.video_url
    ) {
        return "Watch Now";
    }

    return "View";
}


/* =========================================================
   FIND ITEM
========================================================= */

function findItem(id) {

    return contents.find(
        item =>
            String(item.id)
            ===
            String(id)
    );
}


/* =========================================================
   NORMAL DOWNLOAD
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-download-button"
            );

        if (!button) return;

        if (
            button.classList.contains(
                "story-pdf-download"
            )
            ||
            button.classList.contains(
                "book-pdf-download"
            )
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const item =
            findItem(
                button.dataset.contentId
            );

        if (!item) return;

        if (
            !item.download_url
        ) {

            alert(
                "Download link has not been added yet."
            );

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
   VIDEO
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-video-button"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const item =
            findItem(
                button.dataset.contentId
            );

        if (
            item?.video_url
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
   STORY READ
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-story-button"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const story =
            findItem(
                button.dataset.contentId
            );

        if (story) {

            openStoryReader(
                story
            );
        }
    }
);


/* =========================================================
   BOOK READ
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".content-book-button"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const book =
            findItem(
                button.dataset.contentId
            );

        if (
            !book ||
            !book.file_url
        ) {

            alert(
                "Book PDF has not been uploaded yet."
            );

            return;
        }

        openBookReader(
            book
        );
    }
);


/* =========================================================
   BOOK READER
========================================================= */

function openBookReader(book) {

    closeBookReader();

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "bookReaderModal";

    modal.innerHTML = `

        <div class="book-reader-overlay">

            <div class="book-reader-box">

                <div class="book-reader-header">

                    <div class="book-reader-title">

                        <h2>

                            ${escapeHTML(
                                book.title ||
                                "Book"
                            )}

                        </h2>

                        ${
                            book.author
                                ?
                                `

                                    <p>

                                        By ${escapeHTML(
                                            book.author
                                        )}

                                    </p>

                                `
                                :
                                ""
                        }

                    </div>


                    <div class="book-reader-actions">

                        <button
                            type="button"
                            class="book-reader-download-button"
                            id="readerBookDownload"
                        >

                            <i
                                class="fa-solid fa-download"
                            ></i>

                            Download

                        </button>


                        <button
                            type="button"
                            class="book-reader-close-button"
                            id="closeBookReader"
                        >

                            <i
                                class="fa-solid fa-xmark"
                            ></i>

                        </button>

                    </div>

                </div>


                <div class="book-reader-content">

                    <iframe
                        src="${escapeAttribute(
                            book.file_url
                        )}"
                        title="${escapeAttribute(
                            book.title ||
                            "Book PDF"
                        )}"
                    ></iframe>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(
        modal
    );

    document.body.style.overflow =
        "hidden";


    $("closeBookReader")
        ?.addEventListener(
            "click",
            closeBookReader
        );


    modal
        .querySelector(
            ".book-reader-overlay"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.classList
                        .contains(
                            "book-reader-overlay"
                        )
                ) {

                    closeBookReader();
                }
            }
        );


    $("readerBookDownload")
        ?.addEventListener(
            "click",
            async event => {

                const button =
                    event.currentTarget;

                const oldHTML =
                    button.innerHTML;

                button.disabled =
                    true;

                button.innerHTML = `

                    <i
                        class="fa-solid fa-spinner fa-spin"
                    ></i>

                    Downloading...

                `;

                try {

                    await forceFileDownload(
                        book.file_url,
                        `${safeFileName(
                            book.title ||
                            "book"
                        )}.pdf`
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                    window.open(
                        book.file_url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                } finally {

                    button.disabled =
                        false;

                    button.innerHTML =
                        oldHTML;
                }
            }
        );
}


function closeBookReader() {

    $("bookReaderModal")
        ?.remove();

    if (
        !$("storyReaderModal")
    ) {

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   BOOK PDF DOWNLOAD
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".book-pdf-download"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const book =
            findItem(
                button.dataset.contentId
            );

        if (
            !book ||
            !book.file_url
        ) {

            alert(
                "Book PDF has not been uploaded yet."
            );

            return;
        }

        const oldHTML =
            button.innerHTML;

        button.disabled =
            true;

        button.innerHTML = `

            <i
                class="fa-solid fa-spinner fa-spin"
            ></i>

            Downloading...

        `;

        try {

            await forceFileDownload(
                book.file_url,
                `${safeFileName(
                    book.title ||
                    "book"
                )}.pdf`
            );

        } catch (error) {

            console.error(
                error
            );

            window.open(
                book.file_url,
                "_blank",
                "noopener,noreferrer"
            );

        } finally {

            button.disabled =
                false;

            button.innerHTML =
                oldHTML;
        }
    }
);


/* =========================================================
   STORY PDF DOWNLOAD
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".story-pdf-download"
            );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const story =
            findItem(
                button.dataset.contentId
            );

        if (!story) return;

        if (
            !story.full_content
        ) {

            alert(
                "Story content has not been added yet."
            );

            return;
        }

        const oldHTML =
            button.innerHTML;

        button.disabled =
            true;

        button.innerHTML = `

            <i
                class="fa-solid fa-spinner fa-spin"
            ></i>

            Creating PDF...

        `;

        try {

            await downloadStoryAsPDF(
                story
            );

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Unable to create PDF."
            );

        } finally {

            button.disabled =
                false;

            button.innerHTML =
                oldHTML;
        }
    }
);


/* =========================================================
   LOAD PDF LIBRARY
========================================================= */

function loadExternalScript(
    src,
    check
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (check()) {

                resolve();

                return;
            }

            const existing =
                document.querySelector(
                    `script[src="${src}"]`
                );

            if (existing) {

                existing.addEventListener(
                    "load",
                    resolve,
                    {
                        once: true
                    }
                );

                existing.addEventListener(
                    "error",
                    reject,
                    {
                        once: true
                    }
                );

                return;
            }

            const script =
                document.createElement(
                    "script"
                );

            script.src =
                src;

            script.onload =
                resolve;

            script.onerror =
                reject;

            document.head.appendChild(
                script
            );
        }
    );
}


async function loadPDFLibraries() {

    await loadExternalScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
        () =>
            Boolean(
                window.html2canvas
            )
    );

    await loadExternalScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        () =>
            Boolean(
                window.jspdf
            )
    );
}


/* =========================================================
   STORY -> PDF
========================================================= */

async function downloadStoryAsPDF(
    story
) {

    await loadPDFLibraries();

    const pdfArea =
        document.createElement(
            "div"
        );

    pdfArea.style.cssText = `

        position:fixed;
        left:-12000px;
        top:0;
        width:794px;
        padding:60px;

        background:#ffffff;
        color:#111111;

        font-family:
            Arial,
            "Noto Sans Bengali",
            sans-serif;

        font-size:18px;
        line-height:1.85;

        z-index:-9999;

    `;

    pdfArea.innerHTML = `

        <h1
            style="
                margin:0 0 10px;
                font-size:32px;
                color:#111;
            "
        >

            ${escapeHTML(
                story.title ||
                "Story"
            )}

        </h1>


        ${
            story.author
                ?
                `

                    <p
                        style="
                            margin:0 0 28px;
                            color:#666;
                            font-size:16px;
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
                overflow-wrap:anywhere;
            "
        >

            ${escapeHTML(
                story.full_content
            )}

        </div>


        <div
            style="
                margin-top:50px;
                padding-top:15px;
                border-top:1px solid #ddd;
                color:#888;
                font-size:12px;
            "
        >

            Cinema Mella & Hub

        </div>

    `;

    document.body.appendChild(
        pdfArea
    );

    if (
        document.fonts?.ready
    ) {

        await document.fonts.ready;
    }

    const canvas =
        await window.html2canvas(
            pdfArea,
            {
                scale: 2,
                backgroundColor:
                    "#ffffff",
                useCORS: true,
                logging: false
            }
        );

    pdfArea.remove();

    const {
        jsPDF
    } =
        window.jspdf;

    const pdf =
        new jsPDF({
            orientation:
                "portrait",
            unit:
                "mm",
            format:
                "a4",
            compress:
                true
        });

    const imageData =
        canvas.toDataURL(
            "image/jpeg",
            0.92
        );

    const pageWidth =
        210;

    const pageHeight =
        297;

    const margin =
        10;

    const usableWidth =
        pageWidth -
        margin * 2;

    const usableHeight =
        pageHeight -
        margin * 2;

    const imageHeight =
        canvas.height *
        usableWidth /
        canvas.width;

    let heightLeft =
        imageHeight;

    let position =
        margin;

    pdf.addImage(
        imageData,
        "JPEG",
        margin,
        position,
        usableWidth,
        imageHeight
    );

    heightLeft -=
        usableHeight;

    while (
        heightLeft > 0
    ) {

        position =
            margin -
            (
                imageHeight -
                heightLeft
            );

        pdf.addPage();

        pdf.addImage(
            imageData,
            "JPEG",
            margin,
            position,
            usableWidth,
            imageHeight
        );

        heightLeft -=
            usableHeight;
    }

    pdf.save(
        `${safeFileName(
            story.title ||
            "story"
        )}.pdf`
    );
}


/* =========================================================
   FILE DOWNLOAD
========================================================= */

async function forceFileDownload(
    url,
    fileName
) {

    const response =
        await fetch(url);

    if (
        !response.ok
    ) {

        throw new Error(
            "Download failed."
        );
    }

    const blob =
        await response.blob();

    const blobUrl =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        blobUrl;

    link.download =
        fileName;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    setTimeout(
        () => {

            URL.revokeObjectURL(
                blobUrl
            );

        },
        1500
    );
}


/* =========================================================
   STORY READER
========================================================= */

function openStoryReader(story) {

    closeStoryReader();

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "storyReaderModal";

    modal.innerHTML = `

        <div class="story-reader-overlay">

            <div class="story-reader-box">

                <div class="story-reader-header">

                    <div>

                        <h2>

                            ${escapeHTML(
                                story.title ||
                                "Story"
                            )}

                        </h2>

                        ${
                            story.author
                                ?
                                `

                                    <p>

                                        By ${escapeHTML(
                                            story.author
                                        )}

                                    </p>

                                `
                                :
                                ""
                        }

                    </div>


                    <button
                        type="button"
                        id="closeStoryReader"
                        class="story-reader-close"
                    >

                        <i
                            class="fa-solid fa-xmark"
                        ></i>

                    </button>

                </div>


                <div class="story-reader-body">

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

    document.body.style.overflow =
        "hidden";

    $("closeStoryReader")
        ?.addEventListener(
            "click",
            closeStoryReader
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

                    closeStoryReader();
                }
            }
        );
}


function closeStoryReader() {

    $("storyReaderModal")
        ?.remove();

    if (
        !$("bookReaderModal")
    ) {

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   CARD CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "button"
            )
        ) {
            return;
        }

        const card =
            event.target.closest(
                ".uniform-content-card, .featured-card"
            );

        if (!card) return;

        const item =
            findItem(
                card.dataset.contentId
            );

        if (!item) return;

        openContent(item);
    }
);


/* =========================================================
   OPEN CONTENT
========================================================= */

function openContent(item) {

    if (
        item.type === "story"
    ) {

        openStoryReader(item);

        return;
    }

    if (
        item.type === "book"
    ) {

        if (
            item.file_url
        ) {

            openBookReader(item);

        } else {

            alert(
                "Book PDF has not been uploaded yet."
            );
        }

        return;
    }

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
   HERO SLIDES

   USES ALL BANNERS
========================================================= */

function buildHeroSlides() {

    const groups = {};

    HERO_ORDER.forEach(
        type => {

            groups[type] =
                contents.filter(
                    item =>
                        item.type === type
                        &&
                        Boolean(
                            item.banner_url
                        )
                );
        }
    );

    const maxLength =
        Math.max(
            0,
            ...HERO_ORDER.map(
                type =>
                    groups[type].length
            )
        );

    const slides = [];

    for (
        let i = 0;
        i < maxLength;
        i++
    ) {

        HERO_ORDER.forEach(
            type => {

                if (
                    groups[type][i]
                ) {

                    slides.push(
                        groups[type][i]
                    );
                }
            }
        );
    }

    return slides;
}


/* =========================================================
   HERO SETUP
========================================================= */

function setupHero() {

    const hero =
        $("heroBackground");

    if (!hero) return;

    hero.style.transition =
        "opacity 450ms ease";

    heroSlides =
        buildHeroSlides();

    if (
        !heroSlides.length
    ) {

        hero.style.backgroundImage =
            "linear-gradient(120deg,#11001f,#2a075c,#4d0c79)";

        return;
    }

    heroIndex = 0;

    renderHeroDots();

    showHeroSlide(
        0,
        false
    );

    restartHeroTimer();
}


/* =========================================================
   HERO SHOW
   4 SEC TOTAL

   ZOOM STARTS FROM 1.04
   SO RESET IS LESS VISIBLE
========================================================= */

function showHeroSlide(
    index,
    fade = true
) {

    const hero =
        $("heroBackground");

    const item =
        heroSlides[index];

    if (
        !hero ||
        !item ||
        !item.banner_url
    ) {
        return;
    }

    heroIndex =
        index;


    const applySlide =
        () => {

            /*
               cancel previous zoom only
               while image is hidden
            */

            if (
                heroZoomAnimation
            ) {

                heroZoomAnimation.cancel();

                heroZoomAnimation =
                    null;
            }


            hero.style.backgroundImage =
                `url("${escapeCssUrl(
                    item.banner_url
                )}")`;

            hero.style.backgroundSize =
                "cover";

            hero.style.backgroundPosition =
                "center";

            hero.style.opacity =
                "1";


            /*
               SLOW SMOOTH ZOOM
               NO OBVIOUS ZOOM-OUT
            */

            heroZoomAnimation =
                hero.animate(
                    [
                        {
                            transform:
                                "scale(1.04)"
                        },
                        {
                            transform:
                                "scale(1.10)"
                        }
                    ],
                    {
                        duration:
                            3400,
                        easing:
                            "linear",
                        fill:
                            "forwards"
                    }
                );

            updateHeroDots();
        };


    /*
       FIRST IMAGE
    */

    if (!fade) {

        applySlide();

        return;
    }


    /*
       Fade old image first.
       Zoom reset happens while invisible.
    */

    hero.style.opacity =
        "0";


    setTimeout(
        applySlide,
        450
    );
}


/* =========================================================
   HERO TIMER

   EXACTLY 4 SECONDS
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
            4000
        );
}


/* =========================================================
   HERO DOTS
========================================================= */

function renderHeroDots() {

    const dots =
        $("heroDots");

    if (!dots) return;

    dots.innerHTML =
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
                        data-index="${index}"
                    ></button>

                `
            )
            .join("");


    dots
        .querySelectorAll(
            ".hero-dot"
        )
        .forEach(dot => {

            dot.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            dot.dataset.index
                        );

                    showHeroSlide(
                        index,
                        true
                    );

                    restartHeroTimer();
                }
            );
        });
}


function updateHeroDots() {

    $("heroDots")
        ?.querySelectorAll(
            ".hero-dot"
        )
        .forEach(
            (
                dot,
                index
            ) => {

                dot.classList.toggle(
                    "active",
                    index === heroIndex
                );
            }
        );
}


/* =========================================================
   CREATE FEATURED
========================================================= */

function createFeaturedSection() {

    if (
        $("featured")
    ) {
        return;
    }

    const movieSection =
        $("movies");

    if (!movieSection) return;

    const section =
        document.createElement(
            "section"
        );

    section.id =
        "featured";

    section.className =
        "featured-section";

    section.innerHTML = `

        <div class="section-heading">

            <div class="heading-left">

                <span
                    class="heading-line"
                ></span>

                <div>

                    <h2>
                        Featured
                    </h2>

                    <p>
                        Rating 8.0 or higher
                    </p>

                </div>

            </div>


            <div class="featured-controls">

                <button
                    type="button"
                    id="featuredPrev"
                >

                    <i
                        class="fa-solid fa-chevron-left"
                    ></i>

                </button>

                <button
                    type="button"
                    id="featuredNext"
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

    movieSection.parentNode
        .insertBefore(
            section,
            movieSection
        );
}


/* =========================================================
   FEATURED
========================================================= */

function setupFeatured() {

    const track =
        $("featuredTrack");

    if (!track) return;

    featuredItems =
        contents
            .filter(
                item =>
                    Number(
                        item.rating
                    )
                    >= 8
                    &&
                    item.poster_url
            )
            .sort(
                (a, b) =>
                    Number(
                        b.rating
                    )
                    -
                    Number(
                        a.rating
                    )
            );

    if (
        !featuredItems.length
    ) {

        track.innerHTML = `

            <div class="database-loading">
                No rating 8+ content yet.
            </div>

        `;

        return;
    }

    track.innerHTML =
        featuredItems
            .map(item => `

                <article
                    class="featured-card"
                    data-content-id="${item.id}"
                >

                    <div
                        class="featured-card-poster"
                        style="background-image:url('${escapeCssUrl(
                            item.poster_url
                        )}')"
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
                                TYPE_LABEL[
                                    item.type
                                ]
                                ||
                                item.type
                            )}

                        </span>

                        <h3>

                            ${escapeHTML(
                                item.title ||
                                "Untitled"
                            )}

                        </h3>

                    </div>

                </article>

            `)
            .join("");


    featuredIndex = 0;

    updateFeatured();


    $("featuredNext")
        ?.addEventListener(
            "click",
            () => {

                featuredNext();

                startFeaturedTimer();
            }
        );


    $("featuredPrev")
        ?.addEventListener(
            "click",
            () => {

                featuredPrev();

                startFeaturedTimer();
            }
        );


    $("featuredViewport")
        ?.addEventListener(
            "mouseenter",
            stopFeaturedTimer
        );


    $("featuredViewport")
        ?.addEventListener(
            "mouseleave",
            startFeaturedTimer
        );


    startFeaturedTimer();
}


/* =========================================================
   FEATURED COUNT

   DESKTOP = 4
   TABLET = 3
   PHONE = 2
========================================================= */

function featuredVisibleCount() {

    if (
        window.innerWidth <= 760
    ) {
        return 2;
    }

    if (
        window.innerWidth <= 850
    ) {
        return 3;
    }

    return 4;
}


function featuredMaxIndex() {

    return Math.max(
        0,
        featuredItems.length
        -
        featuredVisibleCount()
    );
}


function updateFeatured() {

    const track =
        $("featuredTrack");

    const card =
        track?.querySelector(
            ".featured-card"
        );

    if (
        !track ||
        !card
    ) {
        return;
    }

    const gap =
        parseFloat(
            getComputedStyle(
                track
            ).gap
        )
        ||
        0;

    const width =
        card
            .getBoundingClientRect()
            .width;

    const max =
        featuredMaxIndex();

    if (
        featuredIndex > max
    ) {

        featuredIndex =
            max;
    }

    track.style.transform =
        `translateX(-${
            featuredIndex *
            (
                width +
                gap
            )
        }px)`;
}


function featuredNext() {

    const max =
        featuredMaxIndex();

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

    updateFeatured();
}


function featuredPrev() {

    const max =
        featuredMaxIndex();

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

    updateFeatured();
}


function startFeaturedTimer() {

    stopFeaturedTimer();

    if (
        featuredMaxIndex() <= 0
    ) {
        return;
    }

    featuredTimer =
        setInterval(
            featuredNext,
            4000
        );
}


function stopFeaturedTimer() {

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
    updateFeatured
);


/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    $("searchBox")
        ?.classList
        .add(
            "active"
        );

    setTimeout(
        () => {

            $("searchInput")
                ?.focus();

        },
        100
    );
}


function closeSearch() {

    $("searchBox")
        ?.classList
        .remove(
            "active"
        );

    if (
        $("searchInput")
    ) {

        $("searchInput").value =
            "";
    }

    if (
        $("searchResults")
    ) {

        $("searchResults").innerHTML =
            "";
    }
}


$("searchToggle")
    ?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (
                $("searchBox")
                    ?.classList
                    .contains(
                        "active"
                    )
            ) {

                closeSearch();

            } else {

                openSearch();
            }
        }
    );


$("searchClose")
    ?.addEventListener(
        "click",
        closeSearch
    );


$("searchInput")
    ?.addEventListener(
        "input",
        event => {

            performSearch(
                event.target.value
            );
        }
    );


function performSearch(keyword) {

    const box =
        $("searchResults");

    if (!box) return;

    const text =
        String(
            keyword || ""
        )
            .trim()
            .toLowerCase();

    if (!text) {

        box.innerHTML =
            "";

        return;
    }

    const results =
        contents
            .filter(item => {

                const searchable = [
                    item.title,
                    item.genre,
                    item.author,
                    TYPE_LABEL[
                        item.type
                    ]
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchable
                    .includes(
                        text
                    );
            })
            .slice(
                0,
                8
            );

    if (
        !results.length
    ) {

        box.innerHTML = `

            <div class="search-result-item">

                No result found

            </div>

        `;

        return;
    }

    box.innerHTML =
        results
            .map(item => `

                <div
                    class="search-result-item"
                    data-search-id="${item.id}"
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
                                TYPE_LABEL[
                                    item.type
                                ]
                            )}

                        </p>

                    </div>

                </div>

            `)
            .join("");
}


$("searchResults")
    ?.addEventListener(
        "click",
        event => {

            const result =
                event.target.closest(
                    "[data-search-id]"
                );

            if (!result) return;

            const item =
                findItem(
                    result.dataset.searchId
                );

            if (!item) return;

            closeSearch();

            $(
                TYPE_SECTION[
                    item.type
                ]
            )
                ?.scrollIntoView({
                    behavior:
                        "smooth",
                    block:
                        "start"
                });
        }
    );


/* =========================================================
   MOBILE MENU
========================================================= */

$("mobileMenuButton")
    ?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            $("mobileNav")
                ?.classList
                .toggle(
                    "active"
                );

            const icon =
                $("mobileMenuButton")
                    ?.querySelector(
                        "i"
                    );

            if (!icon) return;

            const isOpen =
                $("mobileNav")
                    ?.classList
                    .contains(
                        "active"
                    );

            icon.classList.toggle(
                "fa-bars",
                !isOpen
            );

            icon.classList.toggle(
                "fa-xmark",
                Boolean(
                    isOpen
                )
            );
        }
    );


$("mobileNav")
    ?.querySelectorAll(
        "a"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                $("mobileNav")
                    ?.classList
                    .remove(
                        "active"
                    );
            }
        );
    });


/* =========================================================
   ACTIVE NAV
========================================================= */

function updateActiveNav() {

    let current =
        "home";

    document
        .querySelectorAll(
            "section[id]"
        )
        .forEach(section => {

            if (
                section.id ===
                "featured"
            ) {
                return;
            }

            const top =
                section.offsetTop -
                150;

            const bottom =
                top +
                section.offsetHeight;

            if (
                window.scrollY >= top
                &&
                window.scrollY < bottom
            ) {

                current =
                    section.id;
            }
        });

    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute(
                    "href"
                )
                ===
                `#${current}`
            );
        });
}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =========================================================
   ESC
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

        $("mobileNav")
            ?.classList
            .remove(
                "active"
            );

        closeStoryReader();

        closeBookReader();
    }
);


/* =========================================================
   HELPERS
========================================================= */

function showLoadError() {

    Object
        .values(
            TYPE_GRID
        )
        .forEach(id => {

            const grid =
                $(id);

            if (!grid) return;

            grid.innerHTML = `

                <div class="database-loading">

                    Unable to load content.

                </div>

            `;
        });
}


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
        icons[type]
        ||
        "fa-solid fa-film"
    );
}


function hasRating(item) {

    return (
        item
        &&
        item.rating !== null
        &&
        item.rating !== undefined
        &&
        item.rating !== ""
    );
}


function formatDate(value) {

    if (!value) {
        return "";
    }

    try {

        return new Date(
            `${value}T00:00:00`
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

    } catch {

        return value;
    }
}


function safeFileName(value) {

    return String(
        value ||
        "download"
    )
        .replace(
            /[\\/:*?"<>|]+/g,
            "-"
        )
        .trim()
        ||
        "download";
}


function escapeHTML(value) {

    return String(
        value ?? ""
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


function escapeAttribute(value) {

    return escapeHTML(
        value
    );
}


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
            "'",
            "\\'"
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
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const hero =
            $("heroBackground");

        if (hero) {

            hero.style.backgroundImage =
                "linear-gradient(120deg,#11001f,#2a075c,#4d0c79)";

            hero.style.opacity =
                "1";
        }

        setupHeaderLogo();

        await loadContents();
    }
);
