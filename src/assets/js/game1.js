// Swal
import Swal from 'sweetalert2/dist/sweetalert2.js';

const matchRow = document.querySelector('.match-row');
const scoreText = document.getElementById('score');
const xIcon = document.getElementById('x-icon');
const petunjuk = document.getElementById('petunjuk');

const clickSound = document.getElementById('click-sound');
const successSound = document.getElementById('success-sound');
const failSound = document.getElementById('fail-sound');
const doneSound = document.getElementById('done-sound');

const words = [
  {
    arab: 'رَأْسٌ',
    latin: 'hidung',
    answer: 'kepala',
  },
  {
    arab: 'أَنْفٌ',
    latin: 'telinga',
    answer: 'hidung',
  },
  {
    arab: 'أُذُنٌ',
    latin: 'mata',
    answer: 'telinga',
  },
  {
    arab: 'عَيْنٌ',
    latin: 'mulut',
    answer: 'mata',
  },
  {
    arab: 'فَمٌّ',
    latin: 'kepala',
    answer: 'mulut',
  },
];

let score = 0;
let clicked = 0;
let selectedArab;
let selectedLatin;
const MAX_QUESTIONS = 10;
const CORRECT_BONUS = 10;

const shuffled = [...words].sort(() => Math.random() - 0.5);

const appendArab = () => {
  for (const word of shuffled) {
    matchRow.innerHTML += `
    <div class="col-12 d-flex justify-content-between mb-5">
      <div className="card card-body">
        <div class="card arab-card bg-secondary" data-latin="${word.answer}">
          <div class="card-body">
            <p class="font-uthmanic" style="font-size: 2rem;">${word.arab}</p>
          </div>
        </div>
      </div>
      <div className="card card-body">
        <div class="card latin-card bg-secondary" data-latin="${word.latin}">
          <div class="card-body">
            <img src="${word.latin}.png" alt="${word.latin}" width="100" data-latin="${word.latin}" />
            <p class="card-text text-center mt-3">${word.latin}</p>
          </div>
        </div>
      </div>
    </div>
    `;
  }
};

const gameOver = () => {
  setTimeout(() => {
    doneSound.play();
    doneSound.volume = 0.5;

    Swal.fire({
      title: 'Selesai!',
      text: 'Permainan sudah selesai!',
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      imageUrl: 'true.gif',
      imageWidth: 150,
      imageAlt: 'Custom image',
    }).then(() => {
      localStorage.setItem('game1Score', score);
      return window.location.assign('score.html');
    });
  }, 1000);
};

const handleClickImage = () => {
  const arabCards = document.querySelectorAll('.arab-card');
  const latinCards = document.querySelectorAll('.latin-card');

  arabCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      clickSound.play();

      const audio = new Audio(`tubuh_arab/${card.dataset['latin']}.aac`);
      audio.play();

      selectedArab = card.dataset['latin'];

      arabCards.forEach((card2) => card2.classList.remove('card-active'));

      card.classList.add('card-active');
    });
  });

  latinCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const audio = new Audio(`tubuh_indo/${card.dataset['latin']}.aac`);
      audio.play();

      if (selectedArab) {
        if (clicked === MAX_QUESTIONS - 1) {
          gameOver();
        }

        clicked++;

        selectedLatin = card.dataset['latin'];

        if (selectedArab === selectedLatin) {
          incrementScore(CORRECT_BONUS);

          successSound.play();
          successSound.volume = 0.5;

          Swal.fire({
            title: 'Benar!',
            text: 'Jawaban kamu benar!',
            icon: 'success',
            imageUrl: 'true.gif',
            imageWidth: 150,
            imageAlt: 'Custom image',
          });
        } else {
          failSound.play();
          failSound.volume = 0.5;

          Swal.fire({
            title: 'Kurang Tepat!',
            text: 'Jawaban kamu kurang tepat!',
            icon: 'error',
            imageUrl: 'false.gif',
            imageWidth: 150,
            imageAlt: 'Custom image',
          });
        }

        const elArab = document.querySelector(`.arab-card[data-latin="${selectedArab}"]`);
        const elLatin = card;

        elArab.style.display = 'none';
        elArab.classList.remove('card-active');

        elLatin.style.display = 'none';
        elLatin.classList.remove('card-active');

        selectedArab = undefined;
        selectedLatin = undefined;

        latinCards.forEach((card2) => {
          card2.classList.remove('card-active');
        });
      }
    });
  });
};

const showScore = () => {
  scoreText.innerText = `${score}/${MAX_QUESTIONS * CORRECT_BONUS}`;
};

const incrementScore = (num) => {
  score += num;
  showScore();
};

const startGame = () => {
  showScore();
  appendArab();
  handleClickImage();
};

startGame();

xIcon.addEventListener('click', () => {
  clickSound.play();
  Swal.fire({
    title: 'Keluar?',
    text: 'Kamu yakin ingin keluar dari permainan?',
    reverseButtons: true,
    showCancelButton: true,
    cancelButtonText: 'Batal',
    confirmButtonText: 'Keluar',
    imageUrl: 'petunjuk.gif',
    imageWidth: 150,
    imageAlt: 'Custom image',
  }).then((result) => {
    if (result.isConfirmed) {
      return window.location.assign('permainan.html');
    }
  });
});

petunjuk.addEventListener('click', () => clickSound.play());
