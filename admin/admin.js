/* =====================================================
   CINEMA MELLA ADMIN
   LOGIN + CRUD + STORAGE
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


const isLoginPage =
    window.location.pathname.includes("login.html");

const isDashboardPage =
    window.location.pathname.includes("dashboard.html");


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const loginButton =
                document.getElementById("loginButton");

            const loginMessage =
                document.getElementById("loginMessage");


            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";

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

                loginMessage.textContent =
                    error.message;

                loginMessage.className =
                    "error";

            }

            finally {

                loginButton.disabled = false;
                loginButton.textContent = "Login";

            }

        }
    );

}


/* =====================================================
   SESSION
===================================================== */

async function checkLoginPage() {

    if (!isLoginPage) return;

    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {

        window.location.href =
            "dashboard.html";

    }

}


async function protectDashboard() {

    if (!isDashboardPage) {
        return false;
    }

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (
        error ||
        !data.session
    ) {

        window.location.href =
            "login.html";

        return false;

    }


    const adminEmail =
        document.getElementById("adminEmail");

    if (adminEmail) {

        adminEmail.textContent =
            data.session.user.email;

    }


    return true;

}


/* =====================================================
   LOGOUT
===================================================== */

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await supabaseClient.auth.signOut();

            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   ELEMENTS
===================================================== */

const contentForm =
    document.getElementById("contentForm");

const contentType =
    document.getElementById("contentType");

const contentId =
    document.getElementById("contentId");

const contentTitle =
    document.getElementById("contentTitle");

const contentDescription =
    document.getElementById("contentDescription");

const posterFile =
    document.getElementById("posterFile");

const bannerFile =
    document.getElementById("bannerFile");

const bookFile =
    document.getElementById("bookFile");

const videoUrl =
    document.getElementById("videoUrl");

const contentYear =
    document.getElementById("contentYear");

const contentRating =
    document.getElementById("contentRating");

const contentGenre =
    document.getElementById("contentGenre");

const contentSeason =
    document.getElementById("contentSeason");

const contentBadge =
    document.getElementById("contentBadge");

const contentAuthor =
    document.getElementById("contentAuthor");

const releaseDate =
    document.getElementById("releaseDate");

const contentStatus =
    document.getElementById("contentStatus");

const contentFeatured =
    document.getElementById("contentFeatured");

const fullContent =
    document.getElementById("fullContent");

const currentPosterUrl =
    document.getElementById("currentPosterUrl");

const currentBannerUrl =
    document.getElementById("currentBannerUrl");

const currentFileUrl =
    document.getElementById("currentFileUrl");

const posterPreview =
    document.getElementById("posterPreview");

const bannerPreview =
    document.getElementById("bannerPreview");

const bookFileStatus =
    document.getElementById("bookFileStatus");

const saveContentButton =
    document.getElementById("saveContentButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const contentMessage =
    document.getElementById("contentMessage");

const contentTableBody =
    document.getElementById("contentTableBody");

const formTitle =
    document.getElementById("formTitle");


let allContents = [];

let currentFilter = "all";


/* =====================================================
   DYNAMIC FORM
===================================================== */

function updateDynamicForm() {

    if (!contentType) return;


    const type =
        contentType.value;


    const fields =
        document.querySelectorAll(".type-field");


    fields.forEach(field => {

        const allowedTypes =
            field.dataset.types
                .split(",");

        if (
            type &&
            allowedTypes.includes(type)
        ) {

            field.classList.add("show-field");

        } else {

            field.classList.remove("show-field");

        }

    });


    const posterLabel =
        document.getElementById("posterLabel");

    const titleLabel =
        document.getElementById("titleLabel");

    const genreLabel =
        document.getElementById("genreLabel");

    const yearLabel =
        document.getElementById("yearLabel");

    const releaseDateLabel =
        document.getElementById("releaseDateLabel");


    if (posterLabel) {

        if (type === "story") {

            posterLabel.textContent =
                "Story Cover Image";

        }

        else if (type === "book") {

            posterLabel.textContent =
                "Book Cover Image";

        }

        else {

            posterLabel.textContent =
                "Poster Image";

        }

    }


    if (titleLabel) {

        if (type === "book") {

            titleLabel.textContent =
                "Book Name *";

        }

        else if (type === "story") {

            titleLabel.textContent =
                "Story Title *";

        }

        else if (type === "series") {

            titleLabel.textContent =
                "Series Name *";

        }

        else if (type === "education") {

    titleLabel.textContent =
        "Course Title *";

}

        else {

            titleLabel.textContent =
                "Title *";

        }

    }


    if (genreLabel) {

        genreLabel.textContent =
            type === "book"
                ? "Book Category"
                : "Genre";

    }


    if (yearLabel) {

        yearLabel.textContent =
            type === "book"
                ? "Publication Year"
                : "Year";

    }


    if (releaseDateLabel) {

        releaseDateLabel.textContent =
            type === "story"
                ? "Publish Date"
                : "Release Date";

    }

}


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
    ) return;


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];


            if (!file) {

                preview.innerHTML = "";

                return;

            }


            const imageUrl =
                URL.createObjectURL(file);


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
   UPLOAD FILE
===================================================== */

async function uploadFile(
    file,
    folder
) {

    if (!file) return null;


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
                    cacheControl: "3600",
                    upsert: false
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

    if (!isDashboardPage) return;


    contentTableBody.innerHTML = `
        <tr>
            <td colspan="5">
                Loading...
            </td>
        </tr>
    `;


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


        updateStats();

        renderContents();

    }

    catch (error) {

        console.error(error);


        contentTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

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


            if (
                !type ||
                !contentTitle.value.trim()
            ) {

                showMessage(
                    "Content type and title are required.",
                    "error"
                );

                return;

            }


            saveContentButton.disabled = true;

            saveContentButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Uploading & Saving...
            `;


            try {

                let posterUrl =
                    currentPosterUrl.value || null;

                let bannerUrl =
                    currentBannerUrl.value || null;

                let pdfUrl =
                    currentFileUrl.value || null;


                /* POSTER / COVER */

                if (
                    posterFile.files.length > 0
                ) {

                    const folder =
                        (
                            type === "story" ||
                            type === "book"
                        )
                            ? "covers"
                            : "posters";


                    posterUrl =
                        await uploadFile(
                            posterFile.files[0],
                            folder
                        );

                }


                /* BANNER */

                if (
                    ["movie", "natok", "series", "upcoming"]
                        .includes(type) &&
                    bannerFile.files.length > 0
                ) {

                    bannerUrl =
                        await uploadFile(
                            bannerFile.files[0],
                            "banners"
                        );

                }


                /* PDF */

                if (
                    type === "book" &&
                    bookFile.files.length > 0
                ) {

                    pdfUrl =
                        await uploadFile(
                            bookFile.files[0],
                            "books"
                        );

                }


                const contentData = {

                    type,

                    title:
                        contentTitle.value.trim(),

                    description:
                        contentDescription.value.trim()
                        || null,

                    poster_url:
                        posterUrl,

                    banner_url:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming"
                        ].includes(type)
                            ? bannerUrl
                            : null,

                    video_url:
                        [
                            "movie",
                            "natok",
                            "series",
                            "education"
                        ].includes(type)
                            ? (
                                videoUrl.value.trim()
                                || null
                            )
                            : null,

                    year:
                        [
                            "movie",
                            "natok",
                            "series",
                            "book"
                        ].includes(type) &&
                        contentYear.value
                            ? Number(contentYear.value)
                            : null,

                    rating:
                        [
                            "movie",
                            "natok",
                            "series"
                        ].includes(type) &&
                        contentRating.value
                            ? Number(contentRating.value)
                            : null,

                    genre:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming",
                            "book",
                            "education"
                        ].includes(type)
                            ? (
                                contentGenre.value.trim()
                                || null
                            )
                            : null,

                    season:
                        type === "series" &&
                        contentSeason.value
                            ? Number(contentSeason.value)
                            : null,

                    badge:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming"
                        ].includes(type)
                            ? (
                                contentBadge.value.trim()
                                || null
                            )
                            : null,

                    author:
                        [
                            "story",
                            "book"
                        ].includes(type)
                            ? (
                                contentAuthor.value.trim()
                                || null
                            )
                            : null,

                    full_content:
                        type === "story"
                            ? (
                                fullContent.value.trim()
                                || null
                            )
                            : null,

                    release_date:
                        [
                            "movie",
                            "natok",
                            "series",
                            "upcoming",
                            "story"
                        ].includes(type)
                            ? (
                                releaseDate.value
                                || null
                            )
                            : null,

                    file_url:
                        type === "book"
                            ? pdfUrl
                            : null,

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
                            .update(contentData)
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

                saveContentButton.innerHTML = `
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Content
                `;

            }

        }
    );

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderContents() {

    let data =
        allContents;


    if (
        currentFilter !== "all"
    ) {

        data =
            allContents.filter(
                item =>
                    item.type === currentFilter
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
        data.map(item => {

            const image =
                item.poster_url
                    ? `
                        <img
                            src="${escapeHTML(item.poster_url)}"
                            class="content-thumb"
                        >
                    `
                    : `
                        <div class="content-thumb-placeholder">
                            <i class="fa-solid fa-image"></i>
                        </div>
                    `;


            return `

                <tr>

                    <td>

                        <div class="content-title-wrap">

                            ${image}

                            <div>

                                <strong>
                                    ${escapeHTML(item.title)}
                                </strong>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${formatType(item.type)}
                    </td>


                    <td>
                        ${
                            item.type === "series" &&
                            item.season
                                ? `S${item.season}`
                                : (
                                    item.year || "-"
                                )
                        }
                    </td>


                    <td>

                        <span
                            class="
                                status-badge
                                ${
                                    item.status === "draft"
                                        ? "status-draft"
                                        : "status-published"
                                }
                            "
                        >

                            ${
                                escapeHTML(
                                    item.status ||
                                    "published"
                                )
                            }

                        </span>

                    </td>


                    <td>

                        <div class="table-actions">

                            <button
                                class="edit-button"
                                onclick="editContent(${item.id})"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                                class="delete-button"
                                onclick="deleteContent(${item.id})"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =====================================================
   EDIT
===================================================== */

window.editContent =
    function (id) {

        const item =
            allContents.find(
                content =>
                    Number(content.id) ===
                    Number(id)
            );


        if (!item) return;


        contentId.value =
            item.id;


        contentType.value =
            item.type || "";


        updateDynamicForm();


        contentTitle.value =
            item.title || "";

        contentDescription.value =
            item.description || "";

        videoUrl.value =
            item.video_url || "";

        contentYear.value =
            item.year || "";

        contentRating.value =
            item.rating || "";

        contentGenre.value =
            item.genre || "";

        contentSeason.value =
            item.season || "";

        contentBadge.value =
            item.badge || "";

        contentAuthor.value =
            item.author || "";

        releaseDate.value =
            item.release_date || "";

        contentStatus.value =
            item.status || "published";

        contentFeatured.checked =
            Boolean(item.featured);

        fullContent.value =
            item.full_content || "";


        currentPosterUrl.value =
            item.poster_url || "";

        currentBannerUrl.value =
            item.banner_url || "";

        currentFileUrl.value =
            item.file_url || "";


        if (item.poster_url) {

            posterPreview.innerHTML = `
                <img
                    src="${item.poster_url}"
                    alt="Poster"
                >
            `;

        }


        if (item.banner_url) {

            bannerPreview.classList.add(
                "banner-preview"
            );

            bannerPreview.innerHTML = `
                <img
                    src="${item.banner_url}"
                    alt="Banner"
                >
            `;

        }


        if (
            item.file_url &&
            bookFileStatus
        ) {

            bookFileStatus.innerHTML =
                "Current PDF already uploaded.";

        }


        formTitle.textContent =
            "Edit Content";


        cancelEditButton.style.display =
            "inline-flex";


        document
            .querySelector(
                ".content-form-section"
            )
            .scrollIntoView({
                behavior: "smooth"
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
                    Number(content.id) ===
                    Number(id)
            );


        if (!item) return;


        const confirmed =
            confirm(
                `Delete "${item.title}"?`
            );


        if (!confirmed) return;


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

            showMessage(
                error.message,
                "error"
            );

        }

    };


/* =====================================================
   DELETE STORAGE FILE
===================================================== */

async function removeStorageFile(url) {

    if (!url) return;


    const marker =
        "/storage/v1/object/public/media/";


    if (
        !url.includes(marker)
    ) return;


    const filePath =
        decodeURIComponent(
            url.split(marker)[1]
        );


    if (!filePath) return;


    await supabaseClient
        .storage
        .from("media")
        .remove([
            filePath
        ]);

}


/* =====================================================
   RESET FORM
===================================================== */

function resetForm() {

    if (!contentForm) return;


    contentForm.reset();


    contentId.value = "";

    currentPosterUrl.value = "";

    currentBannerUrl.value = "";

    currentFileUrl.value = "";


    posterPreview.innerHTML = "";

    bannerPreview.innerHTML = "";

    bookFileStatus.innerHTML = "";


    formTitle.textContent =
        "Add New Content";


    cancelEditButton.style.display =
        "none";


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
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =====================================================
   STATS
===================================================== */

function updateStats() {

    document.getElementById(
        "totalContent"
    ).textContent =
        allContents.length;


    document.getElementById(
        "totalMovies"
    ).textContent =
        allContents.filter(
            item =>
                item.type === "movie"
        ).length;


    document.getElementById(
        "totalNatok"
    ).textContent =
        allContents.filter(
            item =>
                item.type === "natok"
        ).length;


    document.getElementById(
        "totalSeries"
    ).textContent =
        allContents.filter(
            item =>
                item.type === "series"
        ).length;

}


/* =====================================================
   SIDEBAR FILTER
===================================================== */

const filterMap = {

    "Dashboard":
        "all",

    "Movies":
        "movie",

    "Natok":
        "natok",

    "Web Series":
        "series",

    "Upcoming":
        "upcoming",

    "Stories":
        "story",

    "Books":
        "book"

};


document
    .querySelectorAll(
        ".admin-menu-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".admin-menu-item"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    filterMap[
                        button.textContent.trim()
                    ] || "all";


                renderContents();

            }
        );

    });


/* =====================================================
   HELPERS
===================================================== */

function formatType(type) {

    const names = {

        movie: "Movie",

        natok: "Natok",

        series: "Web Series",

        upcoming: "Upcoming",

        story: "Story",

        book: "Book",

        education: "education"

    };


    return names[type] ||
        type ||
        "-";

}


function showMessage(
    message,
    type
) {

    if (!contentMessage) return;


    contentMessage.textContent =
        message;

    contentMessage.className =
        type || "";

}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) return "";


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
   INITIALIZE
===================================================== */

async function initializeDashboard() {

    if (!isDashboardPage) return;


    const authorized =
        await protectDashboard();


    if (!authorized) return;


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
===================================================== */

const logoWords = [
    "MELLA",
    "HUB"
    
];


let logoIndex = 0;


const changingLogo =
    document.querySelectorAll(".logo-changing");


setInterval(() => {

    logoIndex++;

    if (logoIndex >= logoWords.length) {
        logoIndex = 0;
    }


    changingLogo.forEach(logo => {

        logo.style.opacity = "0";


        setTimeout(() => {

            logo.textContent =
                logoWords[logoIndex];


            logo.style.opacity = "1";

        }, 300);

    });


}, 2500);





/* ===============================
   LOAD VIDEOS
================================ */


async function loadEducationVideos(){


const table =
document.getElementById(
"educationVideoTableBody"
);



if(!table)
return;



const {

data,

error

}

=
await supabaseClient

.from(
"education_videos"
)

.select(
`
*,
education_categories(
category_name
)
`
)

.order(
"created_at",
{
ascending:false
}
);



if(error){

console.error(error);

return;

}



table.innerHTML="";



data.forEach(video=>{


table.innerHTML +=

`

<tr>


<td>

${video.title}

</td>


<td>

${

video.education_categories?.category_name

|| ""

}

</td>


<td>

<a href="${video.video_url}"
target="_blank">

Watch

</a>

</td>


<td>

<a href="${video.download_url}"
target="_blank">

Download

</a>

</td>


<td>

<button
class="delete-button"
onclick="deleteEducationVideo(${video.id})"
>

Delete

</button>

</td>


</tr>

`;

});


}



/* ===============================
 DELETE VIDEO
================================ */


async function deleteEducationVideo(id){


const confirmDelete =
confirm(
"Delete this video?"
);



if(!confirmDelete)
return;



const {

error

}

=
await supabaseClient

.from(
"education_videos"
)

.delete()

.eq(
"id",
id
);



if(error){

alert(error.message);

return;

}



loadEducationVideos();


}




/* ===============================
 START EDUCATION
================================ */


document.addEventListener(
"DOMContentLoaded",
()=>{


loadEducationCategories();

loadEducationVideos();


});