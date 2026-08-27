/* =====================================================
   CINEMA MELLA ADMIN
   NO DATABASE CHANGE VERSION

   - LOGIN
   - AUTH
   - CRUD
   - STORAGE
   - DYNAMIC CATEGORY / GENRE
   - RATING FOR ALL CONTENT TYPES
   - CATEGORY SUGGESTIONS FROM EXISTING CONTENT
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =====================================================
   PAGE CHECK
===================================================== */

const currentPath =
    window.location.pathname.toLowerCase();

const isLoginPage =
    currentPath.includes("login.html");

const isDashboardPage =
    currentPath.includes("dashboard.html");


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const loginButton =
                document.getElementById(
                    "loginButton"
                );

            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";

            loginMessage.textContent = "";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {

                    throw error;

                }


                if (data.user) {

                    loginMessage.textContent =
                        "Login successful";

                    loginMessage.className =
                        "success";


                    window.location.href =
                        "dashboard.html";

                }

            }

            catch (error) {

                console.error(error);


                loginMessage.textContent =
                    error.message ||
                    "Unable to login.";

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


/* =====================================================
   LOGIN PAGE SESSION
===================================================== */

async function checkLoginPage() {

    if (!isLoginPage) {

        return;

    }


    try {

        const {
            data
        } =
            await supabaseClient.auth
                .getSession();


        if (data.session) {

            window.location.href =
                "dashboard.html";

        }

    }

    catch (error) {

        console.error(error);

    }

}


/* =====================================================
   PROTECT DASHBOARD
===================================================== */

async function protectDashboard() {

    if (!isDashboardPage) {

        return false;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
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
            document.getElementById(
                "adminEmail"
            );


        if (adminEmail) {

            adminEmail.textContent =
                data.session.user.email;

        }


        return true;

    }

    catch (error) {

        console.error(error);


        window.location.href =
            "login.html";


        return false;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await supabaseClient.auth
                .signOut();


            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   FORM ELEMENTS
===================================================== */

const contentForm =
    document.getElementById(
        "contentForm"
    );

const contentType =
    document.getElementById(
        "contentType"
    );

const contentId =
    document.getElementById(
        "contentId"
    );

const contentTitle =
    document.getElementById(
        "contentTitle"
    );

const contentDescription =
    document.getElementById(
        "contentDescription"
    );

const posterFile =
    document.getElementById(
        "posterFile"
    );

const bannerFile =
    document.getElementById(
        "bannerFile"
    );

const bookFile =
    document.getElementById(
        "bookFile"
    );

const videoUrl =
    document.getElementById(
        "videoUrl"
    );

const contentYear =
    document.getElementById(
        "contentYear"
    );

const contentRating =
    document.getElementById(
        "contentRating"
    );

const contentGenre =
    document.getElementById(
        "contentGenre"
    );

const contentSeason =
    document.getElementById(
        "contentSeason"
    );

const contentBadge =
    document.getElementById(
        "contentBadge"
    );

const contentAuthor =
    document.getElementById(
        "contentAuthor"
    );

const releaseDate =
    document.getElementById(
        "releaseDate"
    );

const contentStatus =
    document.getElementById(
        "contentStatus"
    );

const contentFeatured =
    document.getElementById(
        "contentFeatured"
    );

const fullContent =
    document.getElementById(
        "fullContent"
    );

const currentPosterUrl =
    document.getElementById(
        "currentPosterUrl"
    );

const currentBannerUrl =
    document.getElementById(
        "currentBannerUrl"
    );

const currentFileUrl =
    document.getElementById(
        "currentFileUrl"
    );

const posterPreview =
    document.getElementById(
        "posterPreview"
    );

const bannerPreview =
    document.getElementById(
        "bannerPreview"
    );

const bookFileStatus =
    document.getElementById(
        "bookFileStatus"
    );

const tutorialDownloadUrl =
    document.getElementById(
        "tutorialDownloadUrl"
    );

const saveContentButton =
    document.getElementById(
        "saveContentButton"
    );

const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );

const contentMessage =
    document.getElementById(
        "contentMessage"
    );

const contentTableBody =
    document.getElementById(
        "contentTableBody"
    );

const formTitle =
    document.getElementById(
        "formTitle"
    );


/* =====================================================
   GLOBAL DATA
===================================================== */

let allContents = [];

let currentFilter =
    "all";


/* =====================================================
   ALLOW CATEGORY + RATING FOR ALL TYPES
   NO HTML CHANGE NEEDED
===================================================== */

function expandExistingFields() {

    /*
       Current dashboard.html e genre/rating
       limited type er jonno chilo.

       JS diye existing field kei
       sob content type e enable korchi.
    */


    if (contentGenre) {

        const genreField =
            contentGenre.closest(
                ".type-field"
            );


        if (genreField) {

            genreField.dataset.types =
                "movie,natok,series,upcoming,story,book,tutorial";

        }

    }


    if (contentRating) {

        const ratingField =
            contentRating.closest(
                ".type-field"
            );


        if (ratingField) {

            ratingField.dataset.types =
                "movie,natok,series,upcoming,story,book,tutorial";

        }

    }

}


/* =====================================================
   CATEGORY / GENRE DATALIST
   NO NEW DATABASE TABLE

   Existing contents.genre theke suggestions asbe.
===================================================== */

function setupGenreSuggestions() {

    if (!contentGenre) {

        return;

    }


    let datalist =
        document.getElementById(
            "genreSuggestions"
        );


    if (!datalist) {

        datalist =
            document.createElement(
                "datalist"
            );


        datalist.id =
            "genreSuggestions";


        document.body.appendChild(
            datalist
        );

    }


    contentGenre.setAttribute(
        "list",
        "genreSuggestions"
    );


    updateGenreSuggestions();

}


/* =====================================================
   SPLIT GENRES
===================================================== */

function splitGenres(value) {

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
   UNIQUE GENRE LIST
===================================================== */

function getExistingGenres(
    type
) {

    const genres = [];


    allContents
        .filter(
            item => {

                if (!type) {

                    return true;

                }


                return item.type === type;

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
                                    existing =>
                                        existing
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
   UPDATE CATEGORY SUGGESTIONS
===================================================== */

function updateGenreSuggestions() {

    const datalist =
        document.getElementById(
            "genreSuggestions"
        );


    if (!datalist) {

        return;

    }


    const type =
        contentType
            ?.value
        ||
        "";


    const genres =
        getExistingGenres(
            type
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


/* =====================================================
   CATEGORY PLACEHOLDER
===================================================== */

function updateGenrePlaceholder(
    type
) {

    if (!contentGenre) {

        return;

    }


    const placeholders = {

        movie:
            "Action, Horror, Romance...",

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
        placeholders[type]
        ||
        "Enter category";

}


/* =====================================================
   DYNAMIC FORM
===================================================== */

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

                const dataTypes =
                    field.dataset.types
                    ||
                    "";


                const allowedTypes =
                    dataTypes
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(
                            Boolean
                        );


                if (
                    type &&
                    allowedTypes.includes(
                        type
                    )
                ) {

                    field.classList.add(
                        "show-field"
                    );

                }

                else {

                    field.classList.remove(
                        "show-field"
                    );

                }

            }
        );


    /* POSTER LABEL */

    const posterLabel =
        document.getElementById(
            "posterLabel"
        );


    if (posterLabel) {

        const labels = {

            story:
                "Story Cover Image",

            book:
                "Book Cover Image",

            tutorial:
                "Tutorial Cover Image"

        };


        posterLabel.textContent =
            labels[type]
            ||
            "Poster Image";

    }


    /* TITLE LABEL */

    const titleLabel =
        document.getElementById(
            "titleLabel"
        );


    if (titleLabel) {

        const labels = {

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


        titleLabel.textContent =
            labels[type]
            ||
            "Title *";

    }


    /* GENRE LABEL */

    const genreLabel =
        document.getElementById(
            "genreLabel"
        );


    if (genreLabel) {

        if (
            type ===
            "movie"
        ) {

            genreLabel.textContent =
                "Movie Category / Genre";

        }

        else if (
            type ===
            "natok"
        ) {

            genreLabel.textContent =
                "Natok Category / Language";

        }

        else if (
            type ===
            "series"
        ) {

            genreLabel.textContent =
                "Series Category / Genre";

        }

        else if (
            type ===
            "tutorial"
        ) {

            genreLabel.textContent =
                "Tutorial Category";

        }

        else if (
            type ===
            "story"
        ) {

            genreLabel.textContent =
                "Story Category";

        }

        else if (
            type ===
            "book"
        ) {

            genreLabel.textContent =
                "Book Category";

        }

        else {

            genreLabel.textContent =
                "Category / Genre";

        }

    }


    /* YEAR LABEL */

    const yearLabel =
        document.getElementById(
            "yearLabel"
        );


    if (yearLabel) {

        yearLabel.textContent =
            type === "book"
                ?
                "Publication Year"
                :
                "Year";

    }


    /* RELEASE DATE LABEL */

    const releaseDateLabel =
        document.getElementById(
            "releaseDateLabel"
        );


    if (releaseDateLabel) {

        releaseDateLabel.textContent =
            type === "story"
                ?
                "Publish Date"
                :
                "Release Date";

    }


    updateGenrePlaceholder(
        type
    );


    updateGenreSuggestions();

}


/* =====================================================
   CONTENT TYPE CHANGE
===================================================== */

if (contentType) {

    contentType.addEventListener(
        "change",
        updateDynamicForm
    );

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function showImagePreview(
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


            const imageUrl =
                URL.createObjectURL(
                    file
                );


            if (banner) {

                preview.classList.add(
                    "banner-preview"
                );

            }


            preview.innerHTML = `

                <img
                    src="${imageUrl}"
                    alt="Preview"
                >

            `;

        }
    );

}


showImagePreview(
    posterFile,
    posterPreview
);


showImagePreview(
    bannerFile,
    bannerPreview,
    true
);


/* =====================================================
   BOOK FILE STATUS
===================================================== */

if (bookFile) {

    bookFile.addEventListener(
        "change",
        () => {

            if (!bookFileStatus) {

                return;

            }


            const file =
                bookFile.files[0];


            if (!file) {

                bookFileStatus.textContent =
                    "";

                return;

            }


            bookFileStatus.textContent =
                `Selected: ${file.name}`;

        }
    );

}


/* =====================================================
   UPLOAD FILE
===================================================== */

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


    const randomName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extension}`;


    const filePath =
        `${folder}/${randomName}`;


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


/* =====================================================
   LOAD CONTENT
===================================================== */

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
                        ascending:
                            false
                    }
                );


        if (error) {

            throw error;

        }


        allContents =
            data || [];


        updateGenreSuggestions();

        updateStats();

        renderContents();

    }

    catch (error) {

        console.error(error);


        if (contentTableBody) {

            contentTableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        ${escapeHTML(
                            error.message
                            ||
                            "Unable to load content."
                        )}

                    </td>

                </tr>

            `;

        }

    }

}


/* =====================================================
   NORMALIZE CATEGORY
===================================================== */

function normalizeGenreInput(
    value
) {

    const genres = [];


    splitGenres(
        value
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


    return genres.join(
        ", "
    );

}


/* =====================================================
   SAVE CONTENT
===================================================== */

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


            if (
                !type ||
                !title
            ) {

                showMessage(
                    "Content type and title are required.",
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

                Uploading & Saving...

            `;


            try {

                let posterUrl =
                    currentPosterUrl.value
                    ||
                    null;


                let bannerUrl =
                    currentBannerUrl.value
                    ||
                    null;


                let pdfUrl =
                    currentFileUrl.value
                    ||
                    null;


                /* POSTER / COVER */

                if (
                    posterFile &&
                    posterFile.files.length > 0
                ) {

                    let folder =
                        "posters";


                    if (
                        [
                            "story",
                            "book",
                            "tutorial"
                        ].includes(
                            type
                        )
                    ) {

                        folder =
                            "covers";

                    }


                    posterUrl =
                        await uploadFile(
                            posterFile.files[0],
                            folder
                        );

                }


                /* BANNER */

                if (
                    bannerFile &&
                    [
                        "movie",
                        "natok",
                        "series",
                        "upcoming"
                    ].includes(
                        type
                    )
                    &&
                    bannerFile.files.length > 0
                ) {

                    bannerUrl =
                        await uploadFile(
                            bannerFile.files[0],
                            "banners"
                        );

                }


                /* BOOK PDF */

                if (
                    type === "book"
                    &&
                    bookFile
                    &&
                    bookFile.files.length > 0
                ) {

                    pdfUrl =
                        await uploadFile(
                            bookFile.files[0],
                            "books"
                        );

                }


                /* CATEGORY */

                const genreValue =
                    contentGenre
                        ?
                        normalizeGenreInput(
                            contentGenre.value
                        )
                        :
                        "";


                /* RATING */

                let ratingValue =
                    null;


                if (
                    contentRating &&
                    contentRating.value !==
                    ""
                ) {

                    const number =
                        Number(
                            contentRating.value
                        );


                    if (
                        Number.isFinite(
                            number
                        )
                    ) {

                        if (
                            number < 0 ||
                            number > 10
                        ) {

                            throw new Error(
                                "Rating must be between 0 and 10."
                            );

                        }


                        ratingValue =
                            number;

                    }

                }


                /* DATA */

                const contentData = {

                    type,

                    title,

                    description:
                        contentDescription
                            ?.value
                            .trim()
                        ||
                        null,

                    poster_url:
                        posterUrl,

                    banner_url:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming"
                        ].includes(type)
                            ?
                            bannerUrl
                            :
                            null,

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

                    year:
                        contentYear &&
                        contentYear.value
                            ?
                            Number(
                                contentYear.value
                            )
                            :
                            null,

                    /*
                       Existing rating column e
                       sob type er rating save hobe.
                       New column lagbe na.
                    */

                    rating:
                        ratingValue,

                    /*
                       Existing genre column e
                       category save hobe.
                       New table / column lagbe na.
                    */

                    genre:
                        genreValue
                            ?
                            genreValue
                            :
                            null,

                    season:
                        type === "series"
                        &&
                        contentSeason
                        &&
                        contentSeason.value
                            ?
                            Number(
                                contentSeason.value
                            )
                            :
                            null,

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

                    file_url:
                        type === "book"
                            ?
                            pdfUrl
                            :
                            null,

                    download_url:
                        type === "tutorial"
                            ?
                            (
                                tutorialDownloadUrl
                                    ?.value
                                    .trim()
                                ||
                                null
                            )
                            :
                            null,

                    featured:
                        contentFeatured
                            ?
                            contentFeatured.checked
                            :
                            false,

                    status:
                        contentStatus
                            ?.value
                        ||
                        "published"

                };


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

                console.error(error);


                showMessage(
                    error.message
                    ||
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


/* =====================================================
   RENDER CONTENT TABLE
===================================================== */

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


    if (
        data.length === 0
    ) {

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

                    const image =
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

                                    ${image}

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
                                                        style="
                                                            margin-top:5px;
                                                            font-size:11px;
                                                            color:rgba(255,255,255,.4);
                                                        "
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

                                ${formatType(
                                    item.type
                                )}

                            </td>


                            <td>

                                ${
                                    item.type === "series"
                                    &&
                                    item.season

                                        ?

                                        `S${item.season}`

                                        :

                                        (
                                            item.year
                                            ||
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
                                        item.status
                                        ||
                                        "published"
                                    )}

                                </span>

                            </td>


                            <td>

                                <div
                                    class="table-actions"
                                >

                                    <button
                                        class="edit-button"
                                        type="button"
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
                                        class="delete-button"
                                        type="button"
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


/* =====================================================
   EDIT CONTENT
===================================================== */

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


        contentId.value =
            item.id;


        contentType.value =
            item.type
            ||
            "";


        updateDynamicForm();


        contentTitle.value =
            item.title
            ||
            "";


        contentDescription.value =
            item.description
            ||
            "";


        if (videoUrl) {

            videoUrl.value =
                item.video_url
                ||
                "";

        }


        if (contentYear) {

            contentYear.value =
                item.year
                ??
                "";

        }


        if (contentRating) {

            contentRating.value =
                item.rating
                ??
                "";

        }


        if (contentGenre) {

            contentGenre.value =
                item.genre
                ||
                "";

        }


        if (contentSeason) {

            contentSeason.value =
                item.season
                ??
                "";

        }


        if (contentBadge) {

            contentBadge.value =
                item.badge
                ||
                "";

        }


        if (contentAuthor) {

            contentAuthor.value =
                item.author
                ||
                "";

        }


        if (releaseDate) {

            releaseDate.value =
                item.release_date
                ||
                "";

        }


        if (tutorialDownloadUrl) {

            tutorialDownloadUrl.value =
                item.download_url
                ||
                "";

        }


        if (contentStatus) {

            contentStatus.value =
                item.status
                ||
                "published";

        }


        if (contentFeatured) {

            contentFeatured.checked =
                Boolean(
                    item.featured
                );

        }


        if (fullContent) {

            fullContent.value =
                item.full_content
                ||
                "";

        }


        currentPosterUrl.value =
            item.poster_url
            ||
            "";


        currentBannerUrl.value =
            item.banner_url
            ||
            "";


        currentFileUrl.value =
            item.file_url
            ||
            "";


        /* POSTER */

        if (posterPreview) {

            if (item.poster_url) {

                posterPreview.innerHTML = `

                    <img
                        src="${escapeAttribute(
                            item.poster_url
                        )}"
                        alt="Poster"
                    >

                `;

            }

            else {

                posterPreview.innerHTML =
                    "";

            }

        }


        /* BANNER */

        if (bannerPreview) {

            if (item.banner_url) {

                bannerPreview.classList.add(
                    "banner-preview"
                );


                bannerPreview.innerHTML = `

                    <img
                        src="${escapeAttribute(
                            item.banner_url
                        )}"
                        alt="Banner"
                    >

                `;

            }

            else {

                bannerPreview.innerHTML =
                    "";

            }

        }


        /* BOOK PDF */

        if (bookFileStatus) {

            if (item.file_url) {

                bookFileStatus.textContent =
                    "Current PDF already uploaded.";

            }

            else {

                bookFileStatus.textContent =
                    "";

            }

        }


        if (formTitle) {

            formTitle.textContent =
                "Edit Content";

        }


        if (cancelEditButton) {

            cancelEditButton.style.display =
                "inline-flex";

        }


        document
            .querySelector(
                ".content-form-section"
            )
            ?.scrollIntoView({
                behavior:
                    "smooth"
            });

    };


/* =====================================================
   DELETE CONTENT
===================================================== */

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
               Database row delete successful hole
               tarpor storage files remove korbo.
            */

            await removeStorageFile(
                item.poster_url
            );


            await removeStorageFile(
                item.banner_url
            );


            await removeStorageFile(
                item.file_url
            );


            showMessage(
                "Content deleted successfully.",
                "success"
            );


            await loadContents();

        }

        catch (error) {

            console.error(error);


            showMessage(
                error.message
                ||
                "Unable to delete content.",
                "error"
            );

        }

    };


/* =====================================================
   REMOVE STORAGE FILE
===================================================== */

async function removeStorageFile(
    url
) {

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
                )[1]
            );


        if (!filePath) {

            return;

        }


        const {
            error
        } =
            await supabaseClient
                .storage
                .from("media")
                .remove([
                    filePath
                ]);


        if (error) {

            console.warn(
                "Storage delete warning:",
                error.message
            );

        }

    }

    catch (error) {

        console.warn(
            "Unable to delete storage file:",
            error
        );

    }

}


/* =====================================================
   RESET FORM
===================================================== */

function resetForm() {

    if (!contentForm) {

        return;

    }


    contentForm.reset();


    contentId.value =
        "";


    currentPosterUrl.value =
        "";


    currentBannerUrl.value =
        "";


    currentFileUrl.value =
        "";


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

        bookFileStatus.innerHTML =
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


    updateDynamicForm();

}


/* =====================================================
   CANCEL EDIT
===================================================== */

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        resetForm
    );

}


/* =====================================================
   ADD CONTENT BUTTON
===================================================== */

const openAddContent =
    document.getElementById(
        "openAddContent"
    );


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
                        "smooth"
                });

        }
    );

}


/* =====================================================
   STATS
===================================================== */

function setStat(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


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


/* =====================================================
   SIDEBAR FILTER
===================================================== */

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


                    const buttonText =
                        button.textContent
                            .trim();


                    currentFilter =
                        filterMap[
                            buttonText
                        ]
                        ||
                        "all";


                    renderContents();

                }
            );

        }
    );


/* =====================================================
   FORMAT TYPE
===================================================== */

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


    return names[type]
        ||
        type
        ||
        "-";

}


/* =====================================================
   MESSAGE
===================================================== */

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
        type
        ||
        "";

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

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =====================================================
   INITIALIZE DASHBOARD
===================================================== */

async function initializeDashboard() {

    if (!isDashboardPage) {

        return;

    }


    const authorized =
        await protectDashboard();


    if (!authorized) {

        return;

    }


    /*
       Existing HTML field kei expand korchi.
       Database change kora hocche na.
    */

    expandExistingFields();


    setupGenreSuggestions();


    updateDynamicForm();


    await loadContents();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLoginPage();

        initializeDashboard();

    }
);


/* =====================================================
   LOGO ANIMATION
   CINEMAMELLA <-> CINEMAHUB
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