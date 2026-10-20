
document.addEventListener("DOMContentLoaded", function () {

if (window.lucide) {
    lucide.createIcons();
}

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    const contactToggle = document.querySelector(".floating-contact-toggle");
    const contactPanel = document.querySelector(".floating-contact-panel");
    const minimizePanelButton = document.querySelector(".minimize-panel-button");

    const backToTop = document.querySelector(".back-to-top");
    const appointmentForm = document.querySelector(".appointment-form");
    const appointmentDate = document.querySelector(
        '.appointment-form input[type="date"]'
    );

    const header = document.querySelector(".site-header");

    function setMenuState(isOpen) {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = menuToggle.querySelector("i, svg");
        if (icon && icon.tagName.toLowerCase() === "i") {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.contains("active");
            setMenuState(!isOpen);
        });

        navItems.forEach(function (link) {
            link.addEventListener("click", function () {
                setMenuState(false);
            });
        });

        document.addEventListener("click", function (event) {
            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenuState(false);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                setMenuState(false);
            }
        });
    }

    function setContactPanelState(isOpen) {
        if (!contactPanel || !contactToggle) return;

        contactPanel.classList.toggle("active", isOpen);
        contactToggle.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            contactPanel.setAttribute("aria-hidden", "false");
        } else {
            contactPanel.setAttribute("aria-hidden", "true");
        }
    }

    if (contactToggle && contactPanel) {
        contactToggle.setAttribute("aria-expanded", "false");
        contactPanel.setAttribute("aria-hidden", "true");

        contactToggle.addEventListener("click", function () {
            const isOpen = contactPanel.classList.contains("active");
            setContactPanelState(!isOpen);
        });

        if (minimizePanelButton) {
            minimizePanelButton.addEventListener("click", function () {
                setContactPanelState(false);
            });
        }

        document.addEventListener("click", function (event) {
            if (
                contactPanel.classList.contains("active") &&
                !contactPanel.contains(event.target) &&
                !contactToggle.contains(event.target)
            ) {
                setContactPanelState(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                setContactPanelState(false);
            }
        });
    }

    function updateBackToTop() {
        if (!backToTop) return;

        backToTop.classList.toggle("visible", window.scrollY > 350);
    }

    if (backToTop) {
        updateBackToTop();

        window.addEventListener("scroll", updateBackToTop, {
            passive: true
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                const headerHeight = header
                    ? header.getBoundingClientRect().height
                    : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    12;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: "smooth"
                });

                if (navLinks && navLinks.classList.contains("active")) {
                    setMenuState(false);
                }
            }
        });
    });

    document.querySelectorAll(".faq-container").forEach(function (faq) {
        const questions = faq.querySelectorAll("details");

        questions.forEach(function (question) {
            question.addEventListener("toggle", function () {
                if (!question.open) return;

                questions.forEach(function (otherQuestion) {
                    if (otherQuestion !== question) {
                        otherQuestion.open = false;
                    }
                });
            });
        });
    });

    if (appointmentDate) {
        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        appointmentDate.min = localToday;
    }

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!appointmentForm.checkValidity()) {
                appointmentForm.reportValidity();
                return;
            }

            const formData = new FormData(appointmentForm);
            const patientName =
                formData.get("name") ||
                formData.get("fullName") ||
                "";

            const statusMessage =
                appointmentForm.querySelector(".form-message") ||
                document.createElement("p");

            statusMessage.className = "form-message";
            statusMessage.setAttribute("role", "status");
            statusMessage.setAttribute("aria-live", "polite");

            if (!statusMessage.parentElement) {
                appointmentForm.appendChild(statusMessage);
            }

            statusMessage.textContent =
                "Thank you" +
                (patientName ? ", " + patientName : "") +
                ". Your form has been checked, but no appointment has been booked yet. Please contact the clinic to confirm your appointment.";
        });
    }

    document.querySelectorAll("[data-current-year]").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    const revealElements = document.querySelectorAll(
        ".service-card, .doctor-card, .stat-card, .testimonial-card"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            element.classList.add("reveal-on-scroll");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }
});

