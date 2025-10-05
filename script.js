// Set your special date (the day you met or anniversary)
const startDate = new Date('2023-05-26T00:00:00'); // replace with your date

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const messageEl = document.getElementById('message');

function updateCountdown() {
  const now = new Date();
  let diff = now - startDate; // milliseconds since startDate

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

  // Optional message after 1+ year or special milestone
  if(days > 0) {
    messageEl.textContent = "Forever with you ❤️";
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
