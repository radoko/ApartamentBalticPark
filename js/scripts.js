document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja zmiennych
    let lgInstance = null;
    const galleryContainer = document.getElementById('lightgallery');

    // Funkcja inicjalizująca galerię
    function initGallery() {
        // Usuń poprzednią instancję, jeśli istnieje
        if (lgInstance) {
            lgInstance.destroy();
            lgInstance = null;
        }

        // Inicjalizuj LightGallery
        if (galleryContainer) {
            lgInstance = lightGallery(galleryContainer, {
                selector: '.gallery-item:not(.hidden-gallery)',
                plugins: [lgZoom, lgThumbnail],
                download: false,
                counter: true,
                thumbnail: true,
                // Konfiguracja miniatur
                thumbnailWidth: 100,
                thumbnailHeight: 80,
                thumbContHeight: 100,
                thumbMargin: 5,
                showThumbByDefault: true,
                // Upewnij się, że używamy odpowiednich elementów jako miniatur
                exThumbImage: 'data-thumb',  // Użyj atrybutu data-thumb dla miniatur
                hideScrollbar: true,
                mode: 'lg-fade'
            });
        }
    }

    // Przygotuj atrybuty data-thumb dla miniatur
    function prepareGalleryThumbs() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const imgElement = item.querySelector('img');
            if (imgElement && !item.hasAttribute('data-thumb')) {
                // Ustaw obraz miniatury na ten sam co główny obraz
                item.setAttribute('data-thumb', imgElement.getAttribute('src'));
            }
        });
    }

    // Przygotuj miniatury i inicjalizuj galerię
    prepareGalleryThumbs();
    initGallery();

    // Przycisk "Zobacz więcej zdjęć"
    const loadMoreBtn = document.getElementById('load-more');
    const hiddenGalleryItems = document.querySelectorAll('.hidden-gallery');

    if (loadMoreBtn && hiddenGalleryItems.length > 0) {
        loadMoreBtn.addEventListener('click', function() {
            // Pokaż ukryte zdjęcia
            hiddenGalleryItems.forEach(item => {
                item.classList.remove('hidden-gallery');
            });

            // Ukryj przycisk
            this.style.display = 'none';

            // Przygotuj miniatury dla nowo odkrytych elementów
            prepareGalleryThumbs();

            // Reinicjalizuj galerię
            if (lgInstance) {
                lgInstance.destroy();
                lgInstance = null;
            }

            // Odczekaj moment, aby ukryte elementy zostały prawidłowo pokazane w DOM
            setTimeout(function() {
                initGallery();
            }, 100);
        });
    }

    // Scrollspy dla nawigacji
    const scrollSpyEl = document.querySelector('[data-bs-spy="scroll"]');
    if (scrollSpyEl) {
        const scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 100
        });
    }

    // Animacja nawigacji przy przewijaniu
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }

        // Przycisk powrotu na górę
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 700) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Obsługa przycisku powrotu na górę
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Płynne przewijanie dla linków nawigacyjnych
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Sprawdzam, czy link nie jest częścią galerii
        if (!anchor.closest('.gallery-item')) {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Zamknij menu mobilne po kliknięciu
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                            bsCollapse.hide();
                        }
                    }
                }
            });
        }
    });

    // Walidacja formularza rezerwacji
    const bookingForm = document.querySelector('.booking-form form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Tutaj możesz dodać kod do wysyłania formularza poprzez AJAX
            // lub inny sposób przetwarzania danych

            alert('Dziękujemy za przesłanie formularza! Skontaktujemy się z Tobą wkrótce.');
            this.reset();
        });
    }

    // Animacja liczb
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.counter');

        numberElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000; // 2 sekundy na animację
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentNumber = Math.floor(progress * target);

                el.textContent = currentNumber;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    // Obserwator przecięcia dla animacji liczb
    if ('IntersectionObserver' in window) {
        const statsSection = document.querySelector('#stats');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statsSection);
        }
    }
});