/* =========================================================
   CINEMA MELLA ADMIN
   FINAL VERSION
   NO DATABASE CHANGE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   PAGE DETECTION
========================================================= */

const currentPath =
    window.location.pathname
        .toLowerCase();


const isLoginPage =
    currentPath.includes(
        "login.html"
    );


const isDashboardPage =
    currentPath.includes(
        "dashboard.html"
    );


/* =========================================================
   SHORT DOM HELPER
========================================================= */

function $(id) {

    return document.getElementById(
        id
    );

}


/* =========================================================
   LOGIN ELEMENTS
========================================================= */

const loginForm =
    $("loginForm");


/* =========================================================
   DASHBOARD ELEMENTS
========================================================= */

const logoutButton =
    $("logoutButton");


const contentForm =
    $("contentForm");


const contentType =
    $("contentType");


const contentId =
    $("contentId");


const contentTitle =
    $("contentTitle");


const contentDescription =
    $("contentDescription");


const posterFile =
    $("posterFile");


const bannerFile =
    $("bannerFile");


const bookFile =
    $("bookFile");


const videoUrl =
    $("videoUrl");


/*
   IMPORTANT:
   Movie/Natok/Series/Tutorial
   Download URL
*/

const contentDownloadUrl =
    $("contentDownloadUrl");


const contentYear =
    $("contentYear");


const contentRating =
    $("contentRating");


const contentGenre =
    $("contentGenre");


const contentSeason =
    $("contentSeason");


const contentBadge =
    $("contentBadge");


const contentAuthor =
    $("contentAuthor");


const releaseDate =
    $("releaseDate");


const contentStatus =
    $("contentStatus");


const contentFeatured =
    $("contentFeatured");


const fullContent =
    $("fullContent");


const currentPosterUrl =
    $("currentPosterUrl");


const currentBannerUrl =
    $("currentBannerUrl");


const currentFileUrl =
    $("currentFileUrl");


const posterPreview =
    $("posterPreview");


const bannerPreview =
    $("bannerPreview");


const bookFileStatus =
    $("bookFileStatus");


const saveContentButton =
    $("saveContentButton");


const cancelEditButton =
    $("cancelEditButton");


const contentMessage =
    $("contentMessage");


const contentTableBody =
    $("contentTableBody");


const formTitle =
    $("formTitle");


/* =========================================================
   GLOBAL DATA
========================================================= */

let allContents = [];


let currentFilter =
    "all";


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                $("email")
                    .value
                    .trim();


            const password =
                $("password")
                    .value;


            const loginButton =
                $("loginButton");


            const loginMessage =
                $("loginMessage");


            if (
                !email ||
                !password
            ) {

                loginMessage.textContent =
                    "Enter email and password.";


                loginMessage.className =
                    "error";


                return;

            }


            loginButton.disabled =
                true;


            loginButton.textContent =
                "Logging in...";


            loginMessage.textContent =
                "";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {

                    throw error;

                }


                if (data.user) {

                    loginMessage.textContent =
                        "Login successful.";


                    loginMessage.className =
                        "success";


                    window.location.href =
                        "dashboard.html";

                }

            }

            catch (error) {

                console.error(
                    error
                );


                loginMessage.textContent =
                    error.message ||
                    "Login failed.";


                loginMessage.className =
                    "error";

            }

            finally {

                loginButton.disabled =
                    false;


                loginButton.textContent =
                    "Login";

            }

        }
    );

}


/* =========================================================
   CHECK LOGIN PAGE SESSION
========================================================= */

async function checkLoginPage() {

    if (!isLoginPage) {

        return;

    }


    try {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (data.session) {

            window.location.href =
                "dashboard.html";

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   PROTECT DASHBOARD
========================================================= */

async function protectDashboard() {

    if (!isDashboardPage) {

        return false;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            error ||
            !data.session
        ) {

            window.location.href =
                "login.html";


            return false;

        }


        const adminEmail =
            $("adminEmail");


        if (adminEmail) {

            adminEmail.textContent =
                data.session.user.email;

        }


        return true;

    }

    catch (error) {

        console.error(
            error
        );


        window.location.href =
            "login.html";


        return false;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await supabaseClient
                .auth
                .signOut();


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   DYNAMIC FORM
========================================================= */

function updateDynamicForm() {

    if (!contentType) {

        return;

    }


    const type =
        contentType.value;


    document
        .querySelectorAll(
            ".type-field"
        )
        .forEach(
            field => {

                const allowedTypes =
                    (
                        field.dataset.types ||
                        ""
                    )
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean);


                const shouldShow =
                    Boolean(
                        type &&
                        allowedTypes.includes(
                            type
                        )
                    );


                field.classList.toggle(
                    "show-field",
                    shouldShow
                );

            }
        );


    updateLabels(
        type
    );


    updateGenrePlaceholder(
        type
    );


    refreshGenreSuggestions();

}


/* =========================================================
   DYNAMIC LABELS
========================================================= */

function updateLabels(type) {

    const titleLabel =
        $("titleLabel");


    const posterLabel =
        $("posterLabel");


    const genreLabel =
        $("genreLabel");


    const yearLabel =
        $("yearLabel");


    const releaseDateLabel =
        $("releaseDateLabel");


    /* TITLE */

    const titleMap = {

        movie:
            "Movie Title *",

        natok:
            "Natok Title *",

        series:
            "Series Name *",

        upcoming:
            "Upcoming Title *",

        story:
            "Story Title *",

        book:
            "Book Name *",

        tutorial:
            "Course / Tutorial Title *"

    };


    if (titleLabel) {

        titleLabel.textContent =
            titleMap[type] ||
            "Title *";

    }


    /* POSTER */

    const posterMap = {

        movie:
            "Poster Image",

        natok:
            "Poster Image",

        series:
            "Poster Image",

        upcoming:
            "Poster Image",

        story:
            "Story Cover Image",

        book:
            "Book Cover Image",

        tutorial:
            "Tutorial Cover Image"

    };


    if (posterLabel) {

        posterLabel.textContent =
            posterMap[type] ||
            "Poster Image";

    }


    /* CATEGORY */

    const genreMap = {

        movie:
            "Movie Category / Genre",

        natok:
            "Natok Category / Language",

        series:
            "Series Category / Genre",

        upcoming:
            "Upcoming Category",

        story:
            "Story Category",

        book:
            "Book Category",

        tutorial:
            "Tutorial Category"

    };


    if (genreLabel) {

        genreLabel.textContent =
            genreMap[type] ||
            "Category / Genre";

    }


    /* YEAR */

    if (yearLabel) {

        yearLabel.textContent =
            type === "book"
                ?
                "Publication Year"
                :
                "Year";

    }


    /* DATE */

    if (releaseDateLabel) {

        releaseDateLabel.textContent =
            type === "story"
                ?
                "Publish Date"
                :
                "Release Date";

    }

}


/* =========================================================
   CATEGORY PLACEHOLDER
========================================================= */

function updateGenrePlaceholder(type) {

    if (!contentGenre) {

        return;

    }


    const placeholders = {

        movie:
            "Action, Horror, Comedy...",

        natok:
            "Bangla, Hindi, Comedy...",

        series:
            "Bangla, Hindi, English, Thriller...",

        upcoming:
            "Movie, Natok, Series...",

        story:
            "Horror, Romance, Mystery...",

        book:
            "Novel, Story, Programming...",

        tutorial:
            "SEO, Coding, Web Design..."

    };


    contentGenre.placeholder =
        placeholders[type] ||
        "Type category";

}


/* =========================================================
   CONTENT TYPE CHANGE
========================================================= */

if (contentType) {

    contentType.addEventListener(
        "change",
        updateDynamicForm
    );

}


/* =========================================================
   CATEGORY HELPERS
========================================================= */

function splitGenres(value) {

    return String(
        value || ""
    )
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}


/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeGenres(value) {

    const result = [];


    splitGenres(value)
        .forEach(
            genre => {

                const alreadyExists =
                    result.some(
                        existing =>
                            existing
                                .toLowerCase()
                            ===
                            genre
                                .toLowerCase()
                    );


                if (!alreadyExists) {

                    result.push(
                        genre
                    );

                }

            }
        );


    return result.join(
        ", "
    );

}


/* =========================================================
   CATEGORY SUGGESTIONS
   EXISTING CONTENT ONLY
========================================================= */

function refreshGenreSuggestions() {

    const datalist =
        $("genreSuggestions");


    if (!datalist) {

        return;

    }


    const selectedType =
        contentType
            ?.value ||
        "";


    const genres = [];


    allContents
        .filter(
            item => {

                if (!selectedType) {

                    return true;

                }


                return item.type ===
                    selectedType;

            }
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


    genres.sort(
        (
            a,
            b
        ) =>
            a.localeCompare(
                b
            )
    );


    datalist.innerHTML =
        genres
            .map(
                genre => `

                    <option
                        value="${escapeAttribute(
                            genre
                        )}"
                    ></option>

                `
            )
            .join("");

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function bindImagePreview(
    input,
    preview,
    banner = false
) {

    if (
        !input ||
        !preview
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];


            if (!file) {

                preview.innerHTML =
                    "";


                return;

            }


            if (banner) {

                preview.classList.add(
                    "banner-preview"
                );

            }


            const previewUrl =
                URL.createObjectURL(
                    file
                );


            preview.innerHTML = `

                <img
                    src="${previewUrl}"
                    alt="Preview"
                >

            `;

        }
    );

}


bindImagePreview(
    posterFile,
    posterPreview
);


bindImagePreview(
    bannerFile,
    bannerPreview,
    true
);


/* =========================================================
   BOOK PDF STATUS
========================================================= */

if (bookFile) {

    bookFile.addEventListener(
        "change",
        () => {

            if (!bookFileStatus) {

                return;

            }


            const file =
                bookFile.files[0];


            if (file) {

                bookFileStatus.textContent =
                    `Selected: ${file.name}`;

            }

            else {

                bookFileStatus.textContent =
                    "";

            }

        }
    );

}


/* =========================================================
   STORAGE UPLOAD
========================================================= */

async function uploadFile(
    file,
    folder
) {

    if (!file) {

        return null;

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const randomId =
        Math.random()
            .toString(36)
            .slice(
                2,
                10
            );


    const filePath =
        `${folder}/${Date.now()}-${randomId}.${extension}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from("media")
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (error) {

        throw error;

    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from("media")
            .getPublicUrl(
                filePath
            );


    return data.publicUrl;

}


/* =========================================================
   STORAGE DELETE
========================================================= */

async function removeStorageFile(url) {

    if (!url) {

        return;

    }


    const marker =
        "/storage/v1/object/public/media/";


    if (
        !url.includes(
            marker
        )
    ) {

        return;

    }


    try {

        const filePath =
            decodeURIComponent(
                url.split(
                    marker
                )[1] ||
                ""
            );


        if (!filePath) {

            return;

        }


        await supabaseClient
            .storage
            .from("media")
            .remove([
                filePath
            ]);

    }

    catch (error) {

        console.warn(
            "Storage delete failed:",
            error
        );

    }

}


/* =========================================================
   LOAD ALL CONTENT
========================================================= */

async function loadContents() {

    if (!isDashboardPage) {

        return;

    }


    if (contentTableBody) {

        contentTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    Loading...
                </td>

            </tr>

        `;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("contents")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        allContents =
            data || [];


        refreshGenreSuggestions();


        updateStats();


        renderContents();

    }

    catch (error) {

        console.error(
            error
        );


        if (contentTableBody) {

            contentTableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        ${escapeHTML(
                            error.message ||
                            "Unable to load content."
                        )}

                    </td>

                </tr>

            `;

        }

    }

}


/* =========================================================
   SAVE / UPDATE CONTENT
========================================================= */

if (contentForm) {

    contentForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const type =
                contentType.value;


            const title =
                contentTitle
                    .value
                    .trim();


            if (!type) {

                showMessage(
                    "Please select a content type.",
                    "error"
                );


                return;

            }


            if (!title) {

                showMessage(
                    "Title is required.",
                    "error"
                );


                return;

            }


            saveContentButton.disabled =
                true;


            saveContentButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                ></i>

                Saving...

            `;


            try {

                /* =========================================
                   EXISTING URLS
                ========================================= */

                let posterUrl =
                    currentPosterUrl.value ||
                    null;


                let bannerUrl =
                    currentBannerUrl.value ||
                    null;


                let bookPdfUrl =
                    currentFileUrl.value ||
                    null;


                /* =========================================
                   POSTER
                ========================================= */

                if (
                    posterFile &&
                    posterFile.files.length
                ) {

                    const folder =
                        [
                            "story",
                            "book",
                            "tutorial"
                        ].includes(type)
                            ?
                            "covers"
                            :
                            "posters";


                    posterUrl =
                        await uploadFile(
                            posterFile.files[0],
                            folder
                        );

                }


                /* =========================================
                   BANNER

                   ALL CONTENT TYPES
                   HERO USES THIS
                ========================================= */

                if (
                    bannerFile &&
                    bannerFile.files.length
                ) {

                    bannerUrl =
                        await uploadFile(
                            bannerFile.files[0],
                            "banners"
                        );

                }


                /* =========================================
                   BOOK PDF
                ========================================= */

                if (
                    type === "book" &&
                    bookFile &&
                    bookFile.files.length
                ) {

                    bookPdfUrl =
                        await uploadFile(
                            bookFile.files[0],
                            "books"
                        );

                }


                /* =========================================
                   RATING
                ========================================= */

                let rating =
                    null;


                if (
                    contentRating.value !==
                    ""
                ) {

                    rating =
                        Number(
                            contentRating.value
                        );


                    if (
                        !Number.isFinite(
                            rating
                        )
                        ||
                        rating < 0
                        ||
                        rating > 10
                    ) {

                        throw new Error(
                            "Rating must be between 0 and 10."
                        );

                    }

                }


                /* =========================================
                   DOWNLOAD URL

                   MOVIE
                   NATOK
                   SERIES
                   TUTORIAL
                ========================================= */

                let downloadUrl =
                    null;


                if (
                    [
                        "movie",
                        "natok",
                        "series",
                        "tutorial"
                    ].includes(type)
                ) {

                    downloadUrl =
                        contentDownloadUrl
                            ?.value
                            .trim()
                        ||
                        null;

                }


                /* =========================================
                   CREATE DATA OBJECT
                ========================================= */

                const contentData = {

                    type,

                    title,

                    description:
                        contentDescription
                            ?.value
                            .trim()
                        ||
                        null,


                    /* POSTER */

                    poster_url:
                        posterUrl,


                    /* BANNER - ALL TYPES */

                    banner_url:
                        bannerUrl,


                    /* VIDEO */

                    video_url:
                        [
                            "movie",
                            "natok",
                            "series",
                            "tutorial"
                        ].includes(type)
                            ?
                            (
                                videoUrl
                                    ?.value
                                    .trim()
                                ||
                                null
                            )
                            :
                            null,


                    /* DOWNLOAD */

                    download_url:
                        downloadUrl,


                    /* YEAR */

                    year:
                        [
                            "movie",
                            "natok",
                            "series",
                            "book",
                            "tutorial"
                        ].includes(type)
                        &&
                        contentYear.value
                            ?
                            Number(
                                contentYear.value
                            )
                            :
                            null,


                    /* RATING - ALL TYPES */

                    rating:
                        rating,


                    /* CATEGORY - EXISTING GENRE FIELD */

                    genre:
                        normalizeGenres(
                            contentGenre
                                ?.value
                        )
                        ||
                        null,


                    /* SEASON */

                    season:
                        type === "series"
                        &&
                        contentSeason.value
                            ?
                            Number(
                                contentSeason.value
                            )
                            :
                            null,


                    /* BADGE */

                    badge:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming"
                        ].includes(type)
                            ?
                            (
                                contentBadge
                                    ?.value
                                    .trim()
                                ||
                                null
                            )
                            :
                            null,


                    /* AUTHOR */

                    author:
                        [
                            "story",
                            "book"
                        ].includes(type)
                            ?
                            (
                                contentAuthor
                                    ?.value
                                    .trim()
                                ||
                                null
                            )
                            :
                            null,


                    /* FULL STORY */

                    full_content:
                        type === "story"
                            ?
                            (
                                fullContent
                                    ?.value
                                    .trim()
                                ||
                                null
                            )
                            :
                            null,


                    /* DATE */

                    release_date:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming",
                            "story"
                        ].includes(type)
                            ?
                            (
                                releaseDate
                                    ?.value
                                ||
                                null
                            )
                            :
                            null,


                    /* BOOK PDF */

                    file_url:
                        type === "book"
                            ?
                            bookPdfUrl
                            :
                            null,


                    /* FEATURED */

                    featured:
                        Boolean(
                            contentFeatured
                                ?.checked
                        ),


                    /* STATUS */

                    status:
                        contentStatus
                            ?.value
                        ||
                        "published"

                };


                /* =========================================
                   UPDATE EXISTING CONTENT
                ========================================= */

                const editingId =
                    contentId.value;


                if (editingId) {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("contents")
                            .update(
                                contentData
                            )
                            .eq(
                                "id",
                                editingId
                            );


                    if (error) {

                        throw error;

                    }


                    showMessage(
                        "Content updated successfully.",
                        "success"
                    );

                }


                /* =========================================
                   INSERT NEW CONTENT
                ========================================= */

                else {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("contents")
                            .insert([
                                contentData
                            ]);


                    if (error) {

                        throw error;

                    }


                    showMessage(
                        "Content added successfully.",
                        "success"
                    );

                }


                resetForm();


                await loadContents();

            }

            catch (error) {

                console.error(
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to save content.",
                    "error"
                );

            }

            finally {

                saveContentButton.disabled =
                    false;


                saveContentButton.innerHTML = `

                    <i
                        class="fa-solid fa-floppy-disk"
                    ></i>

                    Save Content

                `;

            }

        }
    );

}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderContents() {

    if (!contentTableBody) {

        return;

    }


    let data =
        allContents;


    if (
        currentFilter !== "all"
    ) {

        data =
            allContents.filter(
                item =>
                    item.type ===
                    currentFilter
            );

    }


    if (!data.length) {

        contentTableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    No content found.

                </td>

            </tr>

        `;


        return;

    }


    contentTableBody.innerHTML =
        data
            .map(
                item => {

                    const thumbnail =
                        item.poster_url
                            ?
                            `

                                <img
                                    src="${escapeAttribute(
                                        item.poster_url
                                    )}"
                                    class="content-thumb"
                                    alt=""
                                >

                            `
                            :
                            `

                                <div
                                    class="content-thumb-placeholder"
                                >

                                    <i
                                        class="fa-solid fa-image"
                                    ></i>

                                </div>

                            `;


                    return `

                        <tr>


                            <td>

                                <div
                                    class="content-title-wrap"
                                >

                                    ${thumbnail}


                                    <div>

                                        <strong>

                                            ${escapeHTML(
                                                item.title
                                            )}

                                        </strong>


                                        ${
                                            item.genre
                                                ?
                                                `

                                                    <div
                                                        class="table-subtext"
                                                    >

                                                        ${escapeHTML(
                                                            item.genre
                                                        )}

                                                    </div>

                                                `
                                                :
                                                ""
                                        }

                                    </div>

                                </div>

                            </td>


                            <td>

                                ${escapeHTML(
                                    formatType(
                                        item.type
                                    )
                                )}

                            </td>


                            <td>

                                ${
                                    item.type ===
                                    "series"
                                    &&
                                    item.season
                                        ?
                                        `S${item.season}`
                                        :
                                        (
                                            item.year ||
                                            "-"
                                        )
                                }

                            </td>


                            <td>

                                <span
                                    class="
                                        status-badge
                                        ${
                                            item.status ===
                                            "draft"
                                                ?
                                                "status-draft"
                                                :
                                                "status-published"
                                        }
                                    "
                                >

                                    ${escapeHTML(
                                        item.status ||
                                        "published"
                                    )}

                                </span>

                            </td>


                            <td>

                                <div
                                    class="table-actions"
                                >

                                    <button
                                        type="button"
                                        class="edit-button"
                                        onclick="editContent(${Number(
                                            item.id
                                        )})"
                                        title="Edit"
                                    >

                                        <i
                                            class="fa-solid fa-pen"
                                        ></i>

                                    </button>


                                    <button
                                        type="button"
                                        class="delete-button"
                                        onclick="deleteContent(${Number(
                                            item.id
                                        )})"
                                        title="Delete"
                                    >

                                        <i
                                            class="fa-solid fa-trash"
                                        ></i>

                                    </button>

                                </div>

                            </td>


                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   EDIT CONTENT
========================================================= */

window.editContent =
    function (id) {

        const item =
            allContents.find(
                content =>
                    Number(
                        content.id
                    )
                    ===
                    Number(
                        id
                    )
            );


        if (!item) {

            return;

        }


        /* ID */

        contentId.value =
            item.id;


        /* TYPE */

        contentType.value =
            item.type ||
            "";


        updateDynamicForm();


        /* TITLE */

        contentTitle.value =
            item.title ||
            "";


        /* DESCRIPTION */

        contentDescription.value =
            item.description ||
            "";


        /* VIDEO */

        if (videoUrl) {

            videoUrl.value =
                item.video_url ||
                "";

        }


        /* =========================================
           DOWNLOAD URL

           VERY IMPORTANT:
           Movie download link returns here
        ========================================= */

        if (contentDownloadUrl) {

            contentDownloadUrl.value =
                item.download_url ||
                "";

        }


        /* YEAR */

        if (contentYear) {

            contentYear.value =
                item.year ??
                "";

        }


        /* RATING */

        if (contentRating) {

            contentRating.value =
                item.rating ??
                "";

        }


        /* GENRE */

        if (contentGenre) {

            contentGenre.value =
                item.genre ||
                "";

        }


        /* SEASON */

        if (contentSeason) {

            contentSeason.value =
                item.season ??
                "";

        }


        /* BADGE */

        if (contentBadge) {

            contentBadge.value =
                item.badge ||
                "";

        }


        /* AUTHOR */

        if (contentAuthor) {

            contentAuthor.value =
                item.author ||
                "";

        }


        /* RELEASE DATE */

        if (releaseDate) {

            releaseDate.value =
                item.release_date ||
                "";

        }


        /* STATUS */

        if (contentStatus) {

            contentStatus.value =
                item.status ||
                "published";

        }


        /* FEATURED */

        if (contentFeatured) {

            contentFeatured.checked =
                Boolean(
                    item.featured
                );

        }


        /* FULL STORY */

        if (fullContent) {

            fullContent.value =
                item.full_content ||
                "";

        }


        /* EXISTING URLS */

        currentPosterUrl.value =
            item.poster_url ||
            "";


        currentBannerUrl.value =
            item.banner_url ||
            "";


        currentFileUrl.value =
            item.file_url ||
            "";


        /* =========================================
           POSTER PREVIEW
        ========================================= */

        if (posterPreview) {

            posterPreview.innerHTML =
                item.poster_url
                    ?
                    `

                        <img
                            src="${escapeAttribute(
                                item.poster_url
                            )}"
                            alt="Poster"
                        >

                    `
                    :
                    "";

        }


        /* =========================================
           BANNER PREVIEW
        ========================================= */

        if (bannerPreview) {

            bannerPreview.classList.add(
                "banner-preview"
            );


            bannerPreview.innerHTML =
                item.banner_url
                    ?
                    `

                        <img
                            src="${escapeAttribute(
                                item.banner_url
                            )}"
                            alt="Banner"
                        >

                    `
                    :
                    "";

        }


        /* BOOK PDF */

        if (bookFileStatus) {

            bookFileStatus.textContent =
                item.file_url
                    ?
                    "Current PDF already uploaded."
                    :
                    "";

        }


        /* FORM TITLE */

        if (formTitle) {

            formTitle.textContent =
                "Edit Content";

        }


        /* CANCEL BUTTON */

        if (cancelEditButton) {

            cancelEditButton.style.display =
                "inline-flex";

        }


        /* SCROLL TO FORM */

        document
            .querySelector(
                ".content-form-section"
            )
            ?.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });

    };


/* =========================================================
   DELETE CONTENT
========================================================= */

window.deleteContent =
    async function (id) {

        const item =
            allContents.find(
                content =>
                    Number(
                        content.id
                    )
                    ===
                    Number(
                        id
                    )
            );


        if (!item) {

            return;

        }


        const confirmed =
            confirm(
                `Delete "${item.title}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const {
                error
            } =
                await supabaseClient
                    .from("contents")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


            if (error) {

                throw error;

            }


            /*
               Delete uploaded storage files
            */

            await Promise.allSettled([

                removeStorageFile(
                    item.poster_url
                ),

                removeStorageFile(
                    item.banner_url
                ),

                removeStorageFile(
                    item.file_url
                )

            ]);


            showMessage(
                "Content deleted successfully.",
                "success"
            );


            await loadContents();

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                error.message ||
                "Unable to delete content.",
                "error"
            );

        }

    };


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    if (!contentForm) {

        return;

    }


    contentForm.reset();


    if (contentId) {

        contentId.value =
            "";

    }


    if (currentPosterUrl) {

        currentPosterUrl.value =
            "";

    }


    if (currentBannerUrl) {

        currentBannerUrl.value =
            "";

    }


    if (currentFileUrl) {

        currentFileUrl.value =
            "";

    }


    if (posterPreview) {

        posterPreview.innerHTML =
            "";

    }


    if (bannerPreview) {

        bannerPreview.innerHTML =
            "";


        bannerPreview.classList.remove(
            "banner-preview"
        );

    }


    if (bookFileStatus) {

        bookFileStatus.textContent =
            "";

    }


    if (formTitle) {

        formTitle.textContent =
            "Add New Content";

    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }


    if (contentMessage) {

        contentMessage.textContent =
            "";

    }


    updateDynamicForm();

}


/* =========================================================
   CANCEL EDIT
========================================================= */

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        resetForm
    );

}


/* =========================================================
   ADD CONTENT TOP BUTTON
========================================================= */

const openAddContent =
    $("openAddContent");


if (openAddContent) {

    openAddContent.addEventListener(
        "click",
        () => {

            resetForm();


            document
                .querySelector(
                    ".content-form-section"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"
                });

        }
    );

}


/* =========================================================
   STATS
========================================================= */

function setStat(
    id,
    value
) {

    const element =
        $(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    setStat(
        "totalContent",
        allContents.length
    );


    setStat(
        "totalMovies",
        allContents.filter(
            item =>
                item.type ===
                "movie"
        ).length
    );


    setStat(
        "totalNatok",
        allContents.filter(
            item =>
                item.type ===
                "natok"
        ).length
    );


    setStat(
        "totalSeries",
        allContents.filter(
            item =>
                item.type ===
                "series"
        ).length
    );


    setStat(
        "totalUpcoming",
        allContents.filter(
            item =>
                item.type ===
                "upcoming"
        ).length
    );


    setStat(
        "totalStories",
        allContents.filter(
            item =>
                item.type ===
                "story"
        ).length
    );


    setStat(
        "totalBooks",
        allContents.filter(
            item =>
                item.type ===
                "book"
        ).length
    );


    setStat(
        "totalTutorial",
        allContents.filter(
            item =>
                item.type ===
                "tutorial"
        ).length
    );

}


/* =========================================================
   SIDEBAR FILTER
========================================================= */

const filterMap = {

    Dashboard:
        "all",

    Movies:
        "movie",

    Natok:
        "natok",

    "Web Series":
        "series",

    Upcoming:
        "upcoming",

    Stories:
        "story",

    Books:
        "book",

    Tutorial:
        "tutorial"

};


/* =========================================================
   SIDEBAR CLICK
========================================================= */

document
    .querySelectorAll(
        ".admin-menu-item"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-menu-item"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    const menuName =
                        button.textContent
                            .trim();


                    currentFilter =
                        filterMap[
                            menuName
                        ]
                        ||
                        "all";


                    renderContents();

                }
            );

        }
    );


/* =========================================================
   FORMAT TYPE
========================================================= */

function formatType(type) {

    const names = {

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

        tutorial:
            "Tutorial"

    };


    return (
        names[type]
        ||
        type
        ||
        "-"
    );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type
) {

    if (!contentMessage) {

        return;

    }


    contentMessage.textContent =
        message;


    contentMessage.className =
        type ||
        "";

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


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   ADMIN LOGO ANIMATION
========================================================= */

const adminLogoWords = [
    "MELLA",
    "HUB"
];


let adminLogoIndex =
    0;


setInterval(
    () => {

        adminLogoIndex =
            (
                adminLogoIndex + 1
            )
            %
            adminLogoWords.length;


        document
            .querySelectorAll(
                ".admin-brand .logo-changing"
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
                                adminLogoWords[
                                    adminLogoIndex
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


/* =========================================================
   INITIALIZE DASHBOARD
========================================================= */

async function initializeDashboard() {

    if (!isDashboardPage) {

        return;

    }


    const authorized =
        await protectDashboard();


    if (!authorized) {

        return;

    }


    updateDynamicForm();


    await loadContents();

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLoginPage();


        initializeDashboard();

    }
);