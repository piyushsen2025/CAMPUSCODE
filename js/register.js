const detailsForm = document.getElementById('details-form');
const otpForm = document.getElementById('otp-form');
const cardDescription = document.getElementById('card-description');
const captchaText = document.getElementById('captcha-text');
const captchaInput = document.getElementById('captcha-input');
const passwordInput = document.getElementById('reg-password');
const confirmInput = document.getElementById('reg-confirm');
const passwordToggle = document.getElementById('password-toggle');
const strengthBox = document.getElementById('password-strength');
const formError = document.getElementById('form-error');
const otpError = document.getElementById('otp-error');
const feedback = document.getElementById('register-feedback');
const otpInput = document.getElementById('reg-otp');
const otpTime = document.getElementById('otp-time');

let code = '';
let otp = '849201';
let secondsLeft = 300;
let timer = null;
let formData = {};

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function clearError(element) {
  element.textContent = '';
  element.hidden = true;
}

function showFeedback(message) {
  feedback.textContent = message;
  feedback.hidden = false;
  window.setTimeout(() => {
    feedback.hidden = true;
  }, 2800);
}

function makeCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  code = '';

  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  captchaText.textContent = code;
  captchaInput.value = '';
}

function getStrength(value) {
  let score = 0;

  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  return score;
}

function updateStrength() {
  const value = passwordInput.value;
  const score = getStrength(value);
  const bars = strengthBox.querySelectorAll('span');

  strengthBox.hidden = !value;

  bars.forEach((bar, index) => {
    if (index < score) {
      bar.style.background = score >= 3 ? '#82b91a' : '#f59e0b';
    } else {
      bar.style.background = '#e5e5e0';
    }
  });
}

function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  otpTime.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  clearInterval(timer);
  secondsLeft = 300;
  updateTimer();

  timer = setInterval(() => {
    if (secondsLeft > 0) {
      secondsLeft--;
      updateTimer();
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

function showOtpStep() {
  detailsForm.hidden = true;
  otpForm.hidden = false;
  cardDescription.textContent = 'Verify your email code.';
  document.getElementById('otp-email').textContent = formData.email;
  otpInput.value = '';
  clearError(otpError);
  startTimer();
  otpInput.focus();
}

function showDetailsStep() {
  clearInterval(timer);
  otpForm.hidden = true;
  detailsForm.hidden = false;
  cardDescription.textContent = 'Create your CampusCode account.';
  clearError(formError);
}

passwordToggle.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  confirmInput.type = show ? 'text' : 'password';
  passwordToggle.textContent = show ? 'HIDE' : 'SHOW';
});

passwordInput.addEventListener('input', updateStrength);

document.getElementById('new-captcha').addEventListener('click', makeCaptcha);

detailsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError(formError);

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const ageConfirmed = document.getElementById('reg-age').checked;

  if (!name || !email || !password || !confirmPassword) {
    showError(formError, 'Please fill in all required fields.');
    return;
  }

  if (password.length < 8) {
    showError(formError, 'Password must be at least 8 characters long.');
    return;
  }

  if (password !== confirmPassword) {
    showError(formError, 'Passwords do not match.');
    return;
  }

  if (!ageConfirmed) {
    showError(formError, 'Please confirm the age requirement to continue.');
    return;
  }

  if (captchaInput.value.trim().toUpperCase() !== code) {
    showError(formError, 'Verification code did not match.');
    makeCaptcha();
    return;
  }

  formData = { name, email };
  const button = document.getElementById('continue-button');
  button.disabled = true;
  button.querySelector('span').textContent = 'PREPARING...';

  setTimeout(() => {
    button.disabled = false;
    button.querySelector('span').textContent = 'CONTINUE TO VERIFY';
    showOtpStep();
    showFeedback('A demo verification code is ready.');
  }, 500);
});

document.getElementById('resend-code').addEventListener('click', () => {
  otp = '849201';
  startTimer();
  clearError(otpError);
  showFeedback('A new demo code is ready.');
});

document.getElementById('back-button').addEventListener('click', showDetailsStep);

otpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError(otpError);

  if (secondsLeft <= 0) {
    showError(otpError, 'The code has expired. Please request a new code.');
    return;
  }

  if (otpInput.value.trim() !== otp && otpInput.value.trim() !== '123456') {
    showError(otpError, 'Code did not match. Enter 849201 to test.');
    return;
  }

  const button = document.getElementById('finish-button');
  button.disabled = true;
  button.querySelector('span').textContent = 'VERIFYING...';

  setTimeout(() => {
    const user = {
      name: formData.name,
      email: formData.email,
      role: 'STUDENT',
      campusId: `CC-${Math.floor(10000 + Math.random() * 90000)}`
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', 'STUDENT');
    localStorage.setItem('token', 'mock_jwt_token_campuscode_2026');

    clearInterval(timer);
    showFeedback(`Identity verified! Welcome to CampusCode, ${user.name}!`);
    window.location.href = 'student.html';
  }, 700);
});

makeCaptcha();
