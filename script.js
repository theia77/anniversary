// Starting date: 9th December 2024
const startDate = new Date('2024-12-09T00:00:00');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const messageEl = document.getElementById('message');

function updateCountdown() {
  const now = new Date();
  let diff = now - startDate; // time since startDate in ms

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

// Welcome Screen & Music
const welcome = document.getElementById('welcome');
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');

startBtn.addEventListener('click', () => {
  welcome.style.opacity = '0';
  setTimeout(() => welcome.style.display = 'none', 500);
  bgMusic.play();
});

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Floating hearts effect
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '❤️';
  
  // Random horizontal position
  heart.style.left = Math.random() * window.innerWidth + 'px';
  // Random size
  heart.style.fontSize = (10 + Math.random() * 20) + 'px';
  // Random animation duration
  heart.style.animationDuration = (4 + Math.random() * 3) + 's';
  
  document.body.appendChild(heart);
  
  // Remove after animation
  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// Generate hearts continuously
setInterval(createHeart, 300);
