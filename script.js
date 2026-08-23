/* =====================================================
   CINEMA MELLA / CINEMA HUB
   MAIN SCRIPT
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const changingLogo = document.querySelector(".logo-changing");

const heroBackground = document.querySelector(".hero-background");

const heroDots = document.querySelectorAll(".hero-dot");

const searchIconButton =
    document.querySelector(".search-icon-button");

const searchBox =
    document.querySelector(".search-box");

const searchInput =
    document.querySelector(".search-box input");

const searchClose =
    document.querySelector(".search-input-wrapper button");

const searchResults =
    document.querySelector(".search-results");

const mobileMenuButton =
    document.querySelector(".mobile-menu-button");

const mobileNav =
    document.querySelector(".mobile-nav");


/* =====================================================
   LOGO TEXT
   Cinema → Mella → Hub
===================================================== */

const logoWords = [
    "Mella",
    "Hub"
];

let logoIndex = 0;


function changeLogoText() {

    if (!changingLogo) return;

    changingLogo.style.opacity = "0";
    changingLogo.style.transform =
        "translateY(-5px)";

    setTimeout(() => {

        changingLogo.textContent =
            logoWords[logoIndex];

        changingLogo.style.opacity = "1";
        changingLogo.style.transform =
            "translateY(0)";

        logoIndex++;

        if (logoIndex >= logoWords.length) {
            logoIndex = 0;
        }

    }, 250);
}


/*
   Logo change every 2.5 seconds
*/

setInterval(changeLogoText, 2500);


/* =====================================================
   HERO BACKGROUND SLIDER
===================================================== */

const heroImages = [

    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=90",

    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2000&q=90",

    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=90",

    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2000&q=90"
];


let currentHeroIndex = 0;


/* =====================================================
   PRELOAD HERO IMAGES
===================================================== */

heroImages.forEach((imageURL) => {

    const image = new Image();

    image.src = imageURL;

});


/* =====================================================
   SHOW HERO IMAGE
===================================================== */

function showHeroImage(index) {

    if (!heroBackground) return;

    /*
       Fade out
    */

    heroBackground.style.opacity = "0";


    setTimeout(() => {

        /*
           Change image
        */

        heroBackground.style.backgroundImage =
            `url("${heroImages[index]}")`;


        /*
           Reset zoom
        */

        heroBackground.classList.remove("zoom");


        /*
           Fade in
        */

        heroBackground.style.opacity = "1";


        /*
           Start soft zoom
        */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                heroBackground.classList.add("zoom");

            });

        });


        /*
           Update dots
        */

        updateHeroDots(index);

    }, 450);
}


/* =====================================================
   HERO DOTS
===================================================== */

function updateHeroDots(index) {

    heroDots.forEach((dot, dotIndex) => {

        if (dotIndex === index) {

            dot.classList.add("active");

        } else {

            dot.classList.remove("active");

        }

    });
}


/* =====================================================
   INITIAL HERO IMAGE
===================================================== */

if (heroBackground) {

    heroBackground.style.backgroundImage =
        `url("${heroImages[0]}")`;

    heroBackground.style.opacity = "1";

    /*
       Start first zoom
    */

    setTimeout(() => {

        heroBackground.classList.add("zoom");

    }, 300);
}


/* =====================================================
   AUTO HERO SLIDER
===================================================== */

/*
   Change image every 4 seconds
*/

let heroTimer =
    setInterval(() => {

        currentHeroIndex++;

        if (
            currentHeroIndex >=
            heroImages.length
        ) {

            currentHeroIndex = 0;

        }

        showHeroImage(currentHeroIndex);

    }, 4000);


/* =====================================================
   DOT CLICK
===================================================== */

heroDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentHeroIndex = index;

        showHeroImage(currentHeroIndex);


        /*
           Restart timer
        */

        clearInterval(heroTimer);

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

    });

});


/* =====================================================
   SEARCH OPEN / CLOSE
===================================================== */

function openSearch() {

    if (!searchBox) return;

    searchBox.classList.add("active");

    setTimeout(() => {

        if (searchInput) {

            searchInput.focus();

        }

    }, 150);

}


function closeSearch() {

    if (!searchBox) return;

    searchBox.classList.remove("active");

    if (searchInput) {

        searchInput.value = "";

    }

    if (searchResults) {

        searchResults.innerHTML = "";

    }

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

if (searchIconButton) {

    searchIconButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (
                searchBox &&
                searchBox.classList.contains("active")
            ) {

                closeSearch();

            } else {

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
        (event) => {

            event.stopPropagation();

            closeSearch();

        }
    );

}


/* =====================================================
   MOVIE DATABASE FOR SEARCH
===================================================== */

const searchableItems = [

    {
        title: "The Last Horizon",
        category: "Movie",
        section: "movies"
    },

    {
        title: "Midnight Story",
        category: "Movie",
        section: "movies"
    },

    {
        title: "Lost City",
        category: "Movie",
        section: "movies"
    },

    {
        title: "Shadow Night",
        category: "Movie",
        section: "movies"
    },

    {
        title: "Moner Golpo",
        category: "Natok",
        section: "natok"
    },

    {
        title: "Eka Manush",
        category: "Natok",
        section: "natok"
    },

    {
        title: "Shesh Chithi",
        category: "Natok",
        section: "natok"
    },

    {
        title: "Tomar Jonno",
        category: "Natok",
        section: "natok"
    },

    {
        title: "Dark Dimension",
        category: "Web Series",
        section: "series"
    },

    {
        title: "The Unknown",
        category: "Web Series",
        section: "series"
    },

    {
        title: "Cyber City",
        category: "Web Series",
        section: "series"
    },

    {
        title: "Hidden Truth",
        category: "Web Series",
        section: "series"
    },

    {
        title: "A Story of Life",
        category: "Story",
        section: "stories"
    },

    {
        title: "The Last Letter",
        category: "Story",
        section: "stories"
    },

    {
        title: "Winter Night",
        category: "Story",
        section: "stories"
    },

    {
        title: "Unknown Journey",
        category: "Story",
        section: "stories"
    },

    {
        title: "The Silent Book",
        category: "Book",
        section: "books"
    },

    {
        title: "History of Cinema",
        category: "Book",
        section: "books"
    },

    {
        title: "Modern Stories",
        category: "Book",
        section: "books"
    },

    {
        title: "The Great Journey",
        category: "Book",
        section: "books"
    }

];


/* =====================================================
   SEARCH FUNCTION
===================================================== */

function performSearch(keyword) {

    if (!searchResults) return;

    const searchText =
        keyword.trim().toLowerCase();


    /*
       Empty search
    */

    if (!searchText) {

        searchResults.innerHTML = "";

        return;

    }


    /*
       Find matching items
    */

    const results =
        searchableItems.filter((item) => {

            return (

                item.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                item.category
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /*
       No result
    */

    if (results.length === 0) {

        searchResults.innerHTML = `

            <div class="search-result-item">

                <div class="search-result-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <div>

                    <h4>No result found</h4>

                    <p>
                        Try another movie, natok or series name
                    </p>

                </div>

            </div>

        `;

        return;

    }


    /*
       Show results
    */

    searchResults.innerHTML =
        results
            .slice(0, 8)
            .map((item) => {

                return `

                    <div
                        class="search-result-item"
                        data-section="${item.section}"
                    >

                        <div class="search-result-icon">

                            <i class="fa-solid fa-film"></i>

                        </div>

                        <div>

                            <h4>
                                ${item.title}
                            </h4>

                            <p>
                                ${item.category}
                            </p>

                        </div>

                    </div>

                `;

            })
            .join("");


    /*
       Add click to results
    */

    const resultItems =
        searchResults.querySelectorAll(
            ".search-result-item"
        );


    resultItems.forEach((item) => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;


            /*
               Try to find section
            */

            const target =
                document.getElementById(
                    section
                );


            if (target) {

                closeSearch();

                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        });

    });

}


/* =====================================================
   SEARCH INPUT
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        (event) => {

            performSearch(
                event.target.value
            );

        }
    );

}


/* =====================================================
   CLICK OUTSIDE SEARCH
===================================================== */

document.addEventListener(
    "click",
    (event) => {

        if (!searchBox) return;

        const clickedInsideSearch =
            searchBox.contains(event.target);

        const clickedSearchButton =
            searchIconButton &&
            searchIconButton.contains(event.target);


        if (
            !clickedInsideSearch &&
            !clickedSearchButton
        ) {

            closeSearch();

        }

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMobileMenu() {

    if (!mobileNav) return;

    mobileNav.classList.toggle("active");


    /*
       Change icon
    */

    if (mobileMenuButton) {

        const icon =
            mobileMenuButton.querySelector("i");

        if (icon) {

            const isOpen =
                mobileNav.classList.contains(
                    "active"
                );


            if (isOpen) {

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

    }

}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            toggleMobileMenu();

        }
    );

}


/* =====================================================
   MOBILE NAV CLICK
===================================================== */

if (mobileNav) {

    const mobileLinks =
        mobileNav.querySelectorAll("a");


    mobileLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "active"
                );


                /*
                   Reset icon
                */

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
        );

    });

}


/* =====================================================
   SMOOTH SCROLL FOR ALL NAV LINKS
===================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetID =
                    link.getAttribute("href");


                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetID
                    );


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            }
        );

    });


/* =====================================================
   PLAY BUTTON
===================================================== */

const playButtons =
    document.querySelectorAll(
        ".poster-play"
    );


playButtons.forEach((button) => {

    button.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const card =
                button.closest(
                    ".movie-card"
                );


            let title =
                "Movie";


            if (card) {

                const titleElement =
                    card.querySelector(
                        "h3"
                    );

                if (titleElement) {

                    title =
                        titleElement.textContent;

                }

            }


            /*
               Temporary action
               
               Later we will replace this
               with actual video player.
            */

            alert(
                `"${title}" video player will open here.`
            );

        }
    );

});


/* =====================================================
   STORY BUTTONS
===================================================== */

const storyButtons =
    document.querySelectorAll(
        ".story-button"
    );


storyButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const card =
                button.closest(
                    ".story-card"
                );


            const titleElement =
                card &&
                card.querySelector(
                    "h3"
                );


            const title =
                titleElement
                    ? titleElement.textContent
                    : "Story";


            alert(
                `"${title}" story will open here.`
            );

        }
    );

});


/* =====================================================
   BOOK BUTTONS
===================================================== */

const bookButtons =
    document.querySelectorAll(
        ".book-button"
    );


bookButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const card =
                button.closest(
                    ".book-card"
                );


            const titleElement =
                card &&
                card.querySelector(
                    "h3"
                );


            const title =
                titleElement
                    ? titleElement.textContent
                    : "Book";


            alert(
                `"${title}" will open here.`
            );

        }
    );

});


/* =====================================================
   VIEW ALL BUTTONS
===================================================== */

const viewAllButtons =
    document.querySelectorAll(
        ".view-all-button"
    );


viewAllButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            alert(
                "More content will be loaded here."
            );

        }
    );

});


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeSearch();


            if (mobileNav) {

                mobileNav.classList.remove(
                    "active"
                );

            }


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

    }
);


/* =====================================================
   ACTIVE NAV LINK ON SCROLL
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


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove(
            "active"
        );


        const href =
            link.getAttribute("href");


        if (
            href ===
            `#${currentSection}`
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =====================================================
   MOBILE TOUCH EFFECT
===================================================== */

const touchCards =
    document.querySelectorAll(
        ".movie-card, .story-card, .book-card, .upcoming-card"
    );


touchCards.forEach((card) => {

    card.addEventListener(
        "touchstart",
        () => {

            card.style.transform =
                "scale(0.985)";

        },
        {
            passive: true
        }
    );


    card.addEventListener(
        "touchend",
        () => {

            card.style.transform = "";

        },
        {
            passive: true
        }
    );

});


/* =====================================================
   PAGE LOADED
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateActiveNav();

        console.log(
            "Cinema Mella / Cinema Hub loaded successfully."
        );

    }
);