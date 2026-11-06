(() => {
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const captchaInput = document.getElementById('login-captcha');
  const captchaText = document.getElementById('captcha-text');
  const errorBox = document.getElementById('login-error');
  const submitButton = document.getElementById('login-submit');
  const rideStage = document.getElementById('login-ride-stage');
  const toast = document.getElementById('login-toast');
  const passwordToggle = document.getElementById('password-toggle');
  let selectedRole = 'STUDENT';
  let currentCaptcha = '';
  let toastTimer;

  const demoAccounts = {
    STUDENT: { email: 'alex.chen@campuscode.co.in', password: 'Password123!' },
    ORGANIZER: { email: 'organizer@campuscode.co.in', password: 'Password123!' },
    ADMIN: { email: 'admin@campuscode.co.in', password: 'Password123!' }
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function showError(message) {
    errorBox.hidden = false;
    errorBox.querySelector('p').textContent = message;
  }

  function clearError() {
    errorBox.hidden = true;
    errorBox.querySelector('p').textContent = '';
  }

  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    currentCaptcha = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    captchaText.textContent = currentCaptcha;
    captchaInput.value = '';
  }

  document.querySelectorAll('[data-demo-role]').forEach(button => {
    button.addEventListener('click', () => {
      selectedRole = button.dataset.demoRole;
      const account = demoAccounts[selectedRole];
      emailInput.value = account.email;
      passwordInput.value = account.password;
      captchaInput.value = currentCaptcha;
      document.querySelectorAll('[data-demo-role]').forEach(item => item.classList.toggle('is-active', item === button));
      submitButton.querySelector('span').textContent = `LOGIN AS ${selectedRole}`;
      clearError();
      showToast(`Pre-filled credentials for ${selectedRole} demo`);
    });
  });

  passwordToggle.addEventListener('click', () => {
    const showing = passwordInput.type === 'text';
    passwordInput.type = showing ? 'password' : 'text';
    passwordToggle.innerHTML = showing ? '<span>○</span>SHOW' : '<span>◉</span>HIDE';
    passwordToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });

  document.getElementById('captcha-refresh').addEventListener('click', () => {
    generateCaptcha();
    clearError();
  });

  [emailInput, passwordInput, captchaInput].forEach(input => input.addEventListener('input', clearError));

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) return showError('Please enter your email and password.');
    if (captchaInput.value.trim().toUpperCase() !== currentCaptcha) {
      showError('Captcha code did not match. Please try again.');
      generateCaptcha();
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'CHECKING...';
    submitButton.querySelector('b').textContent = '↻';
    rideStage.classList.add('drive');
    rideStage.querySelector('.login-ride-status').textContent = 'RIDING…';

    setTimeout(() => {
      rideStage.classList.remove('drive');
      rideStage.classList.add('waiting');
      rideStage.querySelector('.login-ride-status').textContent = 'CONNECTING…';
    }, 800);

    setTimeout(() => {
      const names = { STUDENT: 'Alex Chen', ORGANIZER: 'Dr. Sarah Smith', ADMIN: 'Dev Team Chennai' };
      const user = { name: names[selectedRole], email, role: selectedRole, campusId: 'CC-84920' };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', selectedRole);
      localStorage.setItem('token', 'mock_jwt_token_campuscode_2026');
      showToast(`Welcome back, ${user.name}!`);
      const destination = { STUDENT: 'student.html', ORGANIZER: 'organizer.html', ADMIN: 'admin.html' }[selectedRole];
      window.location.href = destination;
    }, 1400);
  });

  generateCaptcha();
})();
