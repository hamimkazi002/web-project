const SUPABASE_URL =
    "https://vuvstnlalyikvlanxxwy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ed-PGIvnw8yN2OwI2264IA_f1FOdWrp";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


const path =
    window.location.pathname.toLowerCase();

const isLoginPage =
    path.includes("login.html");

const isDashboardPage =
    path.includes("dashboard.html");


const $ =
    id =>
        document.getElementById(id);


const loginForm =
    $("loginForm");

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


let allContents =
    [];

let currentFilter =
    "all";


/* =====================================================
   LOGIN
===================================================== */

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
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {

                    throw error;

                }


                if (data.user) {

                    window.location.href =
                        "dashboard.html";

                }

            }

            catch (error) {

                loginMessage.textContent =
                    error.message ||
                    "Login failed";


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
   LOGIN SESSION
===================================================== */

async function checkLoginPage() {

    if (!isLoginPage) {

        return;

    }


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


/* =====================================================
   DASHBOARD AUTH
===================================================== */

async function protectDashboard() {

    if (!isDashboardPage) {

        return false;

    }


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


    if ($("adminEmail")) {

        $("adminEmail").textContent =
            data.session.user.email;

    }


    return true;

}


/* =====================================================
   LOGOUT
===================================================== */

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

                const types =
                    (
                        field.dataset.types ||
                        ""
                    )
                        .split(",")
                        .map(
                            value =>
                                value.trim()
                        );


                field.classList.toggle(
                    "show-field",

                    Boolean(
                        type &&
                        types.includes(type)
                    )
                );

            }
        );


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


    const posterMap = {

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


    if (yearLabel) {

        yearLabel.textContent =
            type === "book"
                ?
                "Publication Year"
                :
                "Year";

    }


    if (releaseDateLabel) {

        releaseDateLabel.textContent =
            type === "story"
                ?
                "Publish Date"
                :
                "Release Date";

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


    if (contentGenre) {

        contentGenre.placeholder =
            placeholders[type] ||
            "Type category";

    }


    refreshGenreSuggestions();

}


if (contentType) {

    contentType.addEventListener(
        "change",
        updateDynamicForm
    );

}


/* =====================================================
   CATEGORY
===================================================== */

function splitGenres(value) {

    return String(
        value || ""
    )
        .split(",")
        .map(
            value =>
                value.trim()
        )
        .filter(Boolean);

}


function normalizeGenres(value) {

    const genres =
        [];


    splitGenres(value)
        .forEach(
            genre => {

                const exists =
                    genres.some(
                        item =>
                            item.toLowerCase() ===
                            genre.toLowerCase()
                    );


                if (!exists) {

                    genres.push(genre);

                }

            }
        );


    return genres.join(", ");

}


function refreshGenreSuggestions() {

    const list =
        $("genreSuggestions");


    if (!list) {

        return;

    }


    const type =
        contentType?.value ||
        "";


    const genres =
        [];


    allContents
        .filter(
            item =>
                !type ||
                item.type === type
        )
        .forEach(
            item => {

                splitGenres(item.genre)
                    .forEach(
                        genre => {

                            const exists =
                                genres.some(
                                    current =>
                                        current.toLowerCase() ===
                                        genre.toLowerCase()
                                );


                            if (!exists) {

                                genres.push(genre);

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


    list.innerHTML =
        genres
            .map(
                genre =>
                    `<option value="${escapeAttribute(
                        genre
                    )}"></option>`
            )
            .join("");

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function bindPreview(
    input,
    preview,
    isBanner = false
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


            if (isBanner) {

                preview.classList.add(
                    "banner-preview"
                );

            }


            preview.innerHTML = `

                <img
                    src="${URL.createObjectURL(file)}"
                    alt="Preview"
                >

            `;

        }
    );

}


bindPreview(
    posterFile,
    posterPreview
);


bindPreview(
    bannerFile,
    bannerPreview,
    true
);


if (bookFile) {

    bookFile.addEventListener(
        "change",
        () => {

            if (bookFileStatus) {

                bookFileStatus.textContent =
                    bookFile.files[0]
                        ?
                        `Selected: ${bookFile.files[0].name}`
                        :
                        "";

            }

        }
    );

}


/* =====================================================
   UPLOAD
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


    const filePath =
        `${folder}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}.${extension}`;


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


    return supabaseClient
        .storage
        .from("media")
        .getPublicUrl(
            filePath
        )
        .data
        .publicUrl;

}


/* =====================================================
   REMOVE STORAGE
===================================================== */

async function removeStorageFile(url) {

    if (!url) {

        return;

    }


    const marker =
        "/storage/v1/object/public/media/";


    if (!url.includes(marker)) {

        return;

    }


    const filePath =
        decodeURIComponent(
            url.split(marker)[1] ||
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


/* =====================================================
   LOAD CONTENT
===================================================== */

async function loadContents() {

    if (!isDashboardPage) {

        return;

    }


    if (contentTableBody) {

        contentTableBody.innerHTML =
            `<tr><td colspan="5">Loading...</td></tr>`;

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


        refreshGenreSuggestions();

        updateStats();

        renderContents();

    }

    catch (error) {

        if (contentTableBody) {

            contentTableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        ${escapeHTML(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }

    }

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

                return showMessage(
                    "Content type and title are required.",
                    "error"
                );

            }


            saveContentButton.disabled =
                true;


            saveContentButton.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;


            try {

                let posterUrl =
                    currentPosterUrl.value ||
                    null;


                let bannerUrl =
                    currentBannerUrl.value ||
                    null;


                let pdfUrl =
                    currentFileUrl.value ||
                    null;


                if (
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


                if (
                    bannerFile.files.length
                ) {

                    bannerUrl =
                        await uploadFile(
                            bannerFile.files[0],
                            "banners"
                        );

                }


                if (
                    type === "book" &&
                    bookFile.files.length
                ) {

                    pdfUrl =
                        await uploadFile(
                            bookFile.files[0],
                            "books"
                        );

                }


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
                        !Number.isFinite(rating) ||
                        rating < 0 ||
                        rating > 10
                    ) {

                        throw new Error(
                            "Rating must be between 0 and 10."
                        );

                    }

                }


                const contentData = {

                    type,

                    title,

                    description:
                        contentDescription
                            .value
                            .trim() ||
                        null,

                    poster_url:
                        posterUrl,

                    banner_url:
                        bannerUrl,

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
                                    .value
                                    .trim() ||
                                null
                            )
                            :
                            null,

                    download_url:
                        [
                            "movie",
                            "natok",
                            "series",
                            "tutorial"
                        ].includes(type)
                            ?
                            (
                                contentDownloadUrl
                                    .value
                                    .trim() ||
                                null
                            )
                            :
                            null,

                    year:
                        [
                            "movie",
                            "natok",
                            "series",
                            "book",
                            "tutorial"
                        ].includes(type) &&
                        contentYear.value
                            ?
                            Number(
                                contentYear.value
                            )
                            :
                            null,

                    rating,

                    genre:
                        normalizeGenres(
                            contentGenre.value
                        ) ||
                        null,

                    season:
                        type === "series" &&
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
                                    .value
                                    .trim() ||
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
                                    .value
                                    .trim() ||
                                null
                            )
                            :
                            null,

                    full_content:
                        type === "story"
                            ?
                            (
                                fullContent
                                    .value
                                    .trim() ||
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
                                releaseDate.value ||
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

                    featured:
                        contentFeatured.checked,

                    status:
                        contentStatus.value

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
                    error.message ||
                    "Unable to save content.",
                    "error"
                );

            }

            finally {

                saveContentButton.disabled =
                    false;


                saveContentButton.innerHTML =
                    `<i class="fa-solid fa-floppy-disk"></i> Save Content`;

            }

        }
    );

}


/* =====================================================
   TABLE
===================================================== */

function renderContents() {

    if (!contentTableBody) {

        return;

    }


    let data =
        currentFilter === "all"
            ?
            allContents
            :
            allContents.filter(
                item =>
                    item.type ===
                    currentFilter
            );


    if (!data.length) {

        contentTableBody.innerHTML =
            `<tr><td colspan="5">No content found.</td></tr>`;


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

                                <div class="content-title-wrap">

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

                                                    <div class="table-subtext">

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
                                    item.type ===
                                    "series" &&
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

                                <div class="table-actions">

                                    <button
                                        class="edit-button"
                                        onclick="editContent(${Number(
                                            item.id
                                        )})"
                                    >

                                        <i class="fa-solid fa-pen"></i>

                                    </button>


                                    <button
                                        class="delete-button"
                                        onclick="deleteContent(${Number(
                                            item.id
                                        )})"
                                    >

                                        <i class="fa-solid fa-trash"></i>

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
   EDIT
===================================================== */

window.editContent =
    function (id) {

        const item =
            allContents.find(
                content =>
                    Number(
                        content.id
                    ) ===
                    Number(id)
            );


        if (!item) {

            return;

        }


        contentId.value =
            item.id;


        contentType.value =
            item.type ||
            "";


        updateDynamicForm();


        contentTitle.value =
            item.title ||
            "";


        contentDescription.value =
            item.description ||
            "";


        videoUrl.value =
            item.video_url ||
            "";


        contentDownloadUrl.value =
            item.download_url ||
            "";


        contentYear.value =
            item.year ??
            "";


        contentRating.value =
            item.rating ??
            "";


        contentGenre.value =
            item.genre ||
            "";


        contentSeason.value =
            item.season ??
            "";


        contentBadge.value =
            item.badge ||
            "";


        contentAuthor.value =
            item.author ||
            "";


        releaseDate.value =
            item.release_date ||
            "";


        contentStatus.value =
            item.status ||
            "published";


        contentFeatured.checked =
            Boolean(
                item.featured
            );


        fullContent.value =
            item.full_content ||
            "";


        currentPosterUrl.value =
            item.poster_url ||
            "";


        currentBannerUrl.value =
            item.banner_url ||
            "";


        currentFileUrl.value =
            item.file_url ||
            "";


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


        bookFileStatus.textContent =
            item.file_url
                ?
                "Current PDF already uploaded."
                :
                "";


        formTitle.textContent =
            "Edit Content";


        cancelEditButton.style.display =
            "inline-flex";


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
   DELETE
===================================================== */

window.deleteContent =
    async function (id) {

        const item =
            allContents.find(
                content =>
                    Number(
                        content.id
                    ) ===
                    Number(id)
            );


        if (
            !item ||
            !confirm(
                `Delete "${item.title}"?`
            )
        ) {

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

            showMessage(
                error.message ||
                "Unable to delete content.",
                "error"
            );

        }

    };


/* =====================================================
   RESET
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


    posterPreview.innerHTML =
        "";


    bannerPreview.innerHTML =
        "";


    bannerPreview.classList.remove(
        "banner-preview"
    );


    bookFileStatus.textContent =
        "";


    formTitle.textContent =
        "Add New Content";


    cancelEditButton.style.display =
        "none";


    updateDynamicForm();

}


if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        resetForm
    );

}


if ($("openAddContent")) {

    $("openAddContent")
        .addEventListener(
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

    if ($(id)) {

        $(id).textContent =
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
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        filterMap[
                            button.textContent
                                .trim()
                        ] ||
                        "all";


                    renderContents();

                }
            );

        }
    );


/* =====================================================
   HELPERS
===================================================== */

function formatType(type) {

    return {

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

    }[type] ||
    type ||
    "-";

}


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


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =====================================================
   INIT
===================================================== */

async function initializeDashboard() {

    if (!isDashboardPage) {

        return;

    }


    if (
        !await protectDashboard()
    ) {

        return;

    }


    updateDynamicForm();


    await loadContents();

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLoginPage();

        initializeDashboard();

    }
);


/* =====================================================
   LOGO
===================================================== */

const logoWords = [
    "MELLA",
    "HUB"
];


let logoIndex =
    0;


setInterval(
    () => {

        logoIndex =
            (
                logoIndex + 1
            ) %
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