// Database nama anggota yang diizinkan
const allowedMembers = [
    "Azka",
    "Abdurrahman Mu'adz", 
    "Azzam",
    "Dzulqornain",
    "Fahri",
    "Ikrimah",
    "Husain",
    "Kholil",
    "Muhammad.P"
];

// Data anggota lengkap dengan status
const membersData = [
    { name: "Azka", status: "On Track 🚀" },
    { name: "Abdurrahman Mu'adz", status: "Sedang Berjuang 💪" },
    { name: "Azzam", status: "Almost There ✨" },
    { name: "Dzulqornain", status: "On Track 🚀" },
    { name: "Fahri", status: "Sedang Berjuang 💪" },
    { name: "Ikrimah", status: "Almost There ✨" },
    { name: "Husain", status: "On Track 🚀" },
    { name: "Kholil", status: "Sedang Berjuang 💪" },
    { name: "Muhammad.P", status: "Almost There ✨" }
];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const namaInput = document.getElementById('namaInput');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const welcomeMessage = document.getElementById('welcomeMessage');
const countdownDays = document.getElementById('countdownDays');
const membersGrid = document.getElementById('membersGrid');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const uploadMagangBtn = document.getElementById('uploadMagangBtn');
const uploadWallBtn = document.getElementById('uploadWallBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
const uploadForm = document.getElementById('uploadForm');
const modalTitle = document.getElementById('modalTitle');
const uploadImage = document.getElementById('uploadImage');
const imagePreview = document.getElementById('imagePreview');
const magangGallery = document.getElementById('magangGallery');
const wallContainer = document.getElementById('wallContainer');

// State variables
let currentUser = '';
let currentSection = ''; // 'magang' or 'wall'
let magangPosts = JSON.parse(localStorage.getItem('magangPosts')) || [];
let wallPosts = JSON.parse(localStorage.getItem('wallPosts')) || [];

// Target kelulusan: 25 Oktober 2026
const targetDate = new Date('2026-10-25');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    loadPostsFromStorage();
    
    // Coba autoplay music dengan user interaction
    document.body.addEventListener('click', initAudio, { once: true });
});

// Audio initialization
function initAudio() {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
}

// Fungsi login
loginBtn.addEventListener('click', handleLogin);
namaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

function handleLogin() {
    const inputNama = namaInput.value.trim();
    
    if (allowedMembers.includes(inputNama)) {
        // Show loading
        const loader = loginBtn.querySelector('.btn-loader');
        const btnText = loginBtn.querySelector('span');
        btnText.style.opacity = '0.5';
        loader.style.display = 'block';
        
        setTimeout(() => {
            // Login berhasil
            currentUser = inputNama;
            loginPage.style.display = 'none';
            mainPage.style.display = 'block';
            welcomeMessage.textContent = `Selamat datang, ${inputNama}! ✨`;
            
            // Update countdown
            updateCountdown();
            
            // Tampilkan data anggota
            displayMembers();
            
            // Tampilkan posts
            displayMagangPosts();
            displayWallPosts();
            
            // Reset loader
            btnText.style.opacity = '1';
            loader.style.display = 'none';
        }, 1000);
        
    } else {
        // Login gagal
        errorMsg.style.display = 'block';
        namaInput.style.borderColor = '#ef4444';
        namaInput.value = '';
        namaInput.focus();
        
        setTimeout(() => {
            errorMsg.style.display = 'none';
            namaInput.style.borderColor = '';
        }, 3000);
    }
}

// Music toggle
musicToggle.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🔊';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
    }
});

// Fungsi countdown
function updateCountdown() {
    const today = new Date();
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    countdownDays.textContent = daysDiff > 0 ? daysDiff : 0;
}

// Fungsi tampilkan anggota
function displayMembers() {
    membersGrid.innerHTML = '';
    
    membersData.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.style.animation = 'fadeIn 0.6s ease-out';
        memberCard.innerHTML = `
            <h4>${member.name}</h4>
            <p>${member.status}</p>
        `;
        membersGrid.appendChild(memberCard);
    });
}

// Upload functionality
uploadMagangBtn.addEventListener('click', () => openUploadModal('magang'));
uploadWallBtn.addEventListener('click', () => openUploadModal('wall'));

function openUploadModal(section) {
    currentSection = section;
    modalTitle.textContent = section === 'magang' ? 'Upload Pengalaman Magang' : 'Post Motivasi/Curhat';
    uploadModal.style.display = 'block';
    uploadForm.reset();
    imagePreview.style.display = 'none';
    imagePreview.innerHTML = '';
}

closeModal.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

// Image preview
uploadImage.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Form submission
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('uploadName').value || 'Anonymous';
    const text = document.getElementById('uploadText').value;
    const imageFile = uploadImage.files[0];
    
    if (!text.trim()) {
        alert('Silakan isi keterangan terlebih dahulu!');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        author: name,
        content: text,
        date: new Date().toLocaleDateString('id-ID'),
        timestamp: new Date().getTime()
    };
    
    // Handle image
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            savePost(newPost);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePost(newPost);
    }
});

function savePost(post) {
    if (currentSection === 'magang') {
        magangPosts.unshift(post);
        localStorage.setItem('magangPosts', JSON.stringify(magangPosts));
        displayMagangPosts();
    } else {
        wallPosts.unshift(post);
        localStorage.setItem('wallPosts', JSON.stringify(wallPosts));
        displayWallPosts();
    }
    
    uploadModal.style.display = 'none';
    showNotification('Postingan berhasil diupload!');
}

function displayMagangPosts() {
    if (magangPosts.length === 0) {
        magangGallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h3>Belum Ada Cerita Magang Nih...</h3>
                <p>Jadi yang pertama share pengalaman magangmu!</p>
            </div>
        `;
        return;
    }
    
    magangGallery.innerHTML = magangPosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-content">${post.content}</div>
            ${post.image ? `
                <div class="post-image">
                    <img src="${post.image}" alt="Gallery image">
                </div>
            ` : ''}
        </div>
    `).join('');
}

function displayWallPosts() {
    if (wallPosts.length === 0) {
        wallContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h3>Wall Masih Sepi...</h3>
                <p>Bagikan kata-kata motivasi atau curhat kolektifmu!</p>
            </div>
        `;
        return;
    }
    
    wallContainer.innerHTML = wallPosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-content">${post.content}</div>
            ${post.image ? `
                <div class="post-image">
                    <img src="${post.image}" alt="Wall image">
                </div>
            ` : ''}
        </div>
    `).join('');
}

function loadPostsFromStorage() {
    magangPosts = JSON.parse(localStorage.getItem('magangPosts')) || [];
    wallPosts = JSON.parse(localStorage.getItem('wallPosts')) || [];
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === uploadModal) {
        uploadModal.style.display = 'none';
    }
});

// Update countdown every minute
setInterval(updateCountdown, 60000);