document.addEventListener('DOMContentLoaded', function() {

// Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cyberpunk-nav') && navLinks) {
            navLinks.classList.remove('active');
        }
    });

    // Load data from JSON file
    loadData();
    
    // Initialize carousel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    if (slides.length > 0) {
        showSlide(currentSlide);
        
        // Auto-rotate carousel
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
});

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Populate categories
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            console.error('Categories container not found');
            return;
        }
        
        categoriesContainer.innerHTML = '';
        
        data.categories.forEach((category, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.style.backgroundImage = `url(assets/${category.icon})`;
            categoryCard.innerHTML = `<div class="category-name">${category.name}</div>`;
            
            categoryCard.addEventListener('click', () => {
                // Remove active class from all cards
                document.querySelectorAll('.category-card').forEach(card => {
                    card.classList.remove('active');
                });
                
                // Add active class to clicked card
                categoryCard.classList.add('active');
                
                // Update selected category title
                const selectedCategoryElement = document.getElementById('selected-category');
                if (selectedCategoryElement) {
                    selectedCategoryElement.textContent = `${category.name} Prices`;
                }
                
                // Populate price table
                populatePriceTable(category.items);
            });
            
            // Activate first category by default
            if (index === 0) {
                categoryCard.classList.add('active');
                const selectedCategoryElement = document.getElementById('selected-category');
                if (selectedCategoryElement) {
                    selectedCategoryElement.textContent = `${category.name} Prices`;
                }
                populatePriceTable(category.items);
            }
            
            categoriesContainer.appendChild(categoryCard);
        });
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback data if JSON fails to load
        loadFallbackData();
    }
}

function loadFallbackData() {
    const fallbackData = {
        categories: [
            {
                "name": "Netflix",
                "icon": "netflix-icon.png",
                "items": [
                    {"name": "Netflix Premium 1 Month", "description": "4K UHD, 4 screens", "price": "Rp 45,000"}
                ]
            },
            {
                "name": "Viu",
                "icon": "viu-icon.png",
                "items": [
                    {"name": "Viu Premium 1 Month", "description": "No ads, HD quality", "price": "Rp 30,000"}
                ]
            }
        ]
    };
    
    // Use the same population logic with fallback data
    const categoriesContainer = document.getElementById('categories');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = '';
        
        fallbackData.categories.forEach((category, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.style.backgroundImage = `url(assets/${category.icon})`;
            categoryCard.innerHTML = `<div class="category-name">${category.name}</div>`;
            
            categoryCard.addEventListener('click', () => {
                document.querySelectorAll('.category-card').forEach(card => {
                    card.classList.remove('active');
                });
                categoryCard.classList.add('active');
                
                const selectedCategoryElement = document.getElementById('selected-category');
                if (selectedCategoryElement) {
                    selectedCategoryElement.textContent = `${category.name} Prices`;
                }
                populatePriceTable(category.items);
            });
            
            if (index === 0) {
                categoryCard.classList.add('active');
                const selectedCategoryElement = document.getElementById('selected-category');
                if (selectedCategoryElement) {
                    selectedCategoryElement.textContent = `${category.name} Prices`;
                }
                populatePriceTable(category.items);
            }
            
            categoriesContainer.appendChild(categoryCard);
        });
    }
}

function populatePriceTable(items) {
    const tableBody = document.querySelector('#price-table tbody');
    if (!tableBody) {
        console.error('Price table body not found');
        return;
    }
    
    tableBody.innerHTML = '';
    
    if (!items || items.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align: center;">No items available</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name || 'N/A'}</td>
            <td>${item.description || 'No description'}</td>
            <td>${item.price || 'Rp 0'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function showSlide(index) {
    const carouselInner = document.querySelector('.carousel-inner');
    if (carouselInner) {
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
    }
}

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-item');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const carouselInner = document.querySelector('.carousel-inner');
    if (carouselInner && carouselInner.style.transform) {
        currentSlide = parseInt(carouselInner.style.transform.split('-')[1]) / 100 || 0;
    }
    
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    
    showSlide(currentSlide);
}

function scrollCategories(direction) {
    const categories = document.querySelector('.categories');
    if (!categories) return;
    
    const scrollAmount = 200;
    categories.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
