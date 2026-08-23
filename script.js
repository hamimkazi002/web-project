/* =====================================================
   CINEMA MELLA / CINEMA HUB
===================================================== */


/* =====================================================
   LOGO CHANGER
===================================================== */

const logoChanging =
    document.getElementById("logoChanging");

const footerLogoChanging =
    document.getElementById("footerLogoChanging");


const logoNames = [
    "MELLA",
    "HUB"
];


let logoIndex = 0;


function changeLogo() {

    logoChanging.classList.add("change");

    if (footerLogoChanging) {
        footerLogoChanging.classList.add("change");
    }


    setTimeout(() => {

        logoIndex++;

        if (logoIndex >= logoNames.length) {
            logoIndex = 0;
        }


        logoChanging.textContent =
            logoNames[logoIndex];


        if (footerLogoChanging) {

            footerLogoChanging.textContent =
                logoNames[logoIndex];

        }


        logoChanging.classList.remove("change");


        if (footerLogoChanging) {
            footerLogoChanging.classList.remove("change");
        }

    }, 350);

}


/* Every 3.5 seconds */

setInterval(changeLogo, 3500);



/* =====================================================
   HERO SLIDER DATA
===================================================== */

const heroSlides = [

    {
        image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1800&q=90",

        title:
            "Shadow Force",

        year:
            "2026",

        genre:
            "Action",

        duration:
            "2h 05m",

        description:
            "A powerful action story filled with danger, mystery and unexpected moments. Discover a new journey and experience the story in cinematic quality."
    },


    {
        image:
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=90",

        title:
            "Dark Horizon",

        year:
            "2026",

        genre:
            "Thriller",

        duration:
            "1h 55m",

        description:
            "A mysterious world hides secrets that nobody expected. Follow the journey and uncover what is waiting beyond the darkness."
    },


    {
        image:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=90",

        title:
            "The Last Mission",

        year:
            "2026",

        genre:
            "Adventure",

        duration:
            "2h 12m",

        description:
            "One final mission. One impossible decision. Experience a thrilling story full of action, adventure and unforgettable moments."
    },


    {
        image:
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1800&q=90",

        title:
            "শেষ বিকেলের গল্প",

        year:
            "2026",

        genre:
            "Romance",

        duration:
            "1h 48m",

        description:
            "A beautiful Bangla romantic story about memories, relationships and the moments that remain with us forever."
    },


    {
        image:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=90",

        title:
            "Night Warrior",

        year:
            "2025",

        genre:
            "Action",

        duration:
            "2h 08m",

        description:
            "A fearless warrior enters a dangerous world where every decision changes the future. Watch the story unfold."
    }

];



/* =====================================================
   HERO ELEMENTS
===================================================== */

const heroBackground =
    document.getElementById("heroBackground");

const heroTitle =
    document.getElementById("heroTitle");

const heroYear =
    document.getElementById("heroYear");

const heroGenre =
    document.getElementById("heroGenre");

const heroDuration =
    document.getElementById("heroDuration");

const heroDescription =
    document.getElementById("heroDescription");

const sliderDots =
    document.getElementById("sliderDots");

const heroPrev =
    document.getElementById("heroPrev");

const heroNext =
    document.getElementById("heroNext");



let currentSlide = 0;

let slideTimer;



/* =====================================================
   CREATE DOTS
===================================================== */

heroSlides.forEach((slide, index) => {

    const dot =
        document.createElement("button");


    dot.className =
        "slider-dot";


    dot.type =
        "button";


    dot.setAttribute(
        "aria-label",
        `Go to slide ${index + 1}`
    );


    dot.addEventListener(
        "click",
        () => {

            currentSlide = index;

            showSlide(currentSlide);

            restartSlider();

        }
    );


    sliderDots.appendChild(dot);

});



/* =====================================================
   SHOW HERO SLIDE
===================================================== */

function showSlide(index) {

    const slide =
        heroSlides[index];


    /* Fade out */

    heroBackground.style.opacity = "0";


    setTimeout(() => {

        /* Change image */

        heroBackground.style.backgroundImage =
            `url("${slide.image}")`;


        /* Reset zoom */

        heroBackground.classList.remove("zoom");


        /* Change text */

        heroTitle.textContent =
            slide.title;

        heroYear.textContent =
            slide.year;

        heroGenre.textContent =
            slide.genre;

        heroDuration.textContent =
            slide.duration;

        heroDescription.textContent =
            slide.description;


        /* Fade in */

        heroBackground.style.opacity =
            "1";


        /* Start slow zoom */

        setTimeout(() => {

            heroBackground.classList.add(
                "zoom"
            );

        }, 100);


    }, 450);


    /* Update dots */

    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );


    dots.forEach((dot, dotIndex) => {

        dot.classList.toggle(
            "active",
            dotIndex === index
        );

    });

}



/* =====================================================
   NEXT SLIDE
===================================================== */

function nextSlide() {

    currentSlide++;

    if (currentSlide >= heroSlides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}



/* =====================================================
   PREVIOUS SLIDE
===================================================== */

function previousSlide() {

    currentSlide--;

    if (currentSlide < 0) {

        currentSlide =
            heroSlides.length - 1;

    }

    showSlide(currentSlide);

}



/* =====================================================
   HERO ARROWS
===================================================== */

heroNext.addEventListener(
    "click",
    () => {

        nextSlide();

        restartSlider();

    }
);


heroPrev.addEventListener(
    "click",
    () => {

        previousSlide();

        restartSlider();

    }
);



/* =====================================================
   AUTO SLIDER
===================================================== */

function startSlider() {

    slideTimer =
        setInterval(
            nextSlide,
            4000
        );

}


function restartSlider() {

    clearInterval(slideTimer);

    startSlider();

}



/* =====================================================
   INITIAL HERO
===================================================== */

heroBackground.style.backgroundImage =
    `url("${heroSlides[0].image}")`;

showSlide(0);

startSlider();



/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


menuButton.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle(
            "show"
        );


        const icon =
            menuButton.querySelector("i");


        if (
            mobileMenu.classList.contains("show")
        ) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );

        } else {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }

    }
);



/* =====================================================
   MOBILE MENU LINK TAP
===================================================== */

const mobileLinks =
    document.querySelectorAll(
        ".mobile-menu a"
    );


mobileLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            mobileMenu.classList.remove(
                "show"
            );


            const icon =
                menuButton.querySelector("i");


            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }
    );

});



/* =====================================================
   SEARCH
===================================================== */

const searchBox =
    document.querySelector(
        ".search-box"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchClear =
    document.getElementById(
        "searchClear"
    );



/* Mobile search open */

searchBox.addEventListener(
    "click",
    (event) => {

        if (
            window.innerWidth <= 600 &&
            !searchBox.classList.contains(
                "search-open"
            )
        ) {

            event.preventDefault();

            searchBox.classList.add(
                "search-open"
            );

            searchInput.focus();

        }

    }
);



/* Search */

searchInput.addEventListener(
    "input",
    () => {

        const value =
            searchInput.value
                .toLowerCase()
                .trim();


        searchClear.classList.toggle(
            "show",
            value.length > 0
        );


        filterMovies(value);

    }
);



/* Clear search */

searchClear.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        searchInput.value = "";

        searchClear.classList.remove(
            "show"
        );

        filterMovies("");

    }
);



/* =====================================================
   MOVIE SEARCH
===================================================== */

function filterMovies(value) {

    const cards =
        document.querySelectorAll(
            ".movie-card"
        );


    cards.forEach((card) => {

        const title =
            card
                .getAttribute(
                    "data-title"
                )
                .toLowerCase();


        const categories =
            card
                .getAttribute(
                    "data-category"
                )
                .toLowerCase();


        if (
            value === "" ||
            title.includes(value) ||
            categories.includes(value)
        ) {

            card.style.display =
                "";

        } else {

            card.style.display =
                "none";

        }

    });

}



/* =====================================================
   CATEGORY FILTER
===================================================== */

const categoryButtons =
    document.querySelectorAll(
        ".category-button"
    );


categoryButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.getAttribute(
                        "data-category"
                    );


                const cards =
                    document.querySelectorAll(
                        ".movie-card"
                    );


                cards.forEach((card) => {

                    const categories =
                        card.getAttribute(
                            "data-category"
                        );


                    if (
                        category === "all" ||
                        categories.includes(
                            category
                        )
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                });

            }
        );

    }
);



/* =====================================================
   MOVIE CARD TAP
===================================================== */

const movieCards =
    document.querySelectorAll(
        ".movie-card"
    );


movieCards.forEach((card) => {

    card.addEventListener(
        "click",
        (event) => {

            const title =
                card.getAttribute(
                    "data-title"
                );


            if (
                event.target.closest(
                    ".card-play"
                )
            ) {

                showToast(
                    `Opening ${title}...`
                );

                return;

            }


            showToast(
                `${title} selected`
            );

        }
    );

});



/* =====================================================
   WATCH BUTTONS
===================================================== */

const watchButtons =
    document.querySelectorAll(
        ".watch-button, .small-watch"
    );


watchButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "Video player will be connected in the next step 🎬"
                );

            }
        );

    }
);



/* =====================================================
   MORE INFO
===================================================== */

const heroInfoButton =
    document.getElementById(
        "heroInfoButton"
    );


heroInfoButton.addEventListener(
    "click",
    () => {

        showToast(
            `${heroTitle.textContent} selected`
        );

    }
);



/* =====================================================
   NOTIFICATION
===================================================== */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


notificationBtn.addEventListener(
    "click",
    () => {

        showToast(
            "No new notifications"
        );

    }
);



/* =====================================================
   REMIND ME
===================================================== */

const remindButtons =
    document.querySelectorAll(
        ".remind-button"
    );


remindButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "Reminder added successfully 🔔"
                );

            }
        );

    }
);



/* =====================================================
   HERO WATCH
===================================================== */

const heroWatchButton =
    document.getElementById(
        "heroWatchButton"
    );


heroWatchButton.addEventListener(
    "click",
    () => {

        showToast(
            `${heroTitle.textContent} player will open in the next step 🎬`
        );

    }
);



/* =====================================================
   TOAST
===================================================== */

const toast =
    document.getElementById(
        "toast"
    );


let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}



/* =====================================================
   TOUCH FRIENDLY HERO SWIPE
===================================================== */

let touchStartX = 0;

let touchEndX = 0;


const hero =
    document.querySelector(
        ".hero"
    );


hero.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    {
        passive: true
    }
);


hero.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;


        handleSwipe();

    },
    {
        passive: true
    }
);


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;


    if (
        Math.abs(distance) < 50
    ) {

        return;

    }


    if (distance < 0) {

        nextSlide();

    } else {

        previousSlide();

    }


    restartSlider();

}