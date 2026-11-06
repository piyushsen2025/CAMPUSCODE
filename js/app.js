
function showToast(message, type = 'info') {
  const toast = document.getElementById('campusToast');
        if (!toast) return;
       toast.textContent = message;
           toast.dataset.type = type;
  toast.classList.add('show');
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
                             }

        function navigateTo(route) {
  const routes = {
            login: 'pages/login.html',
          register: 'pages/register.html',
         student: 'pages/student.html',
           organizer: 'pages/organizer.html',
              admin: 'pages/admin.html'
                              };
       if (route.startsWith('verify/')) {
         window.location.href = `pages/verify.html?certificate=${encodeURIComponent(route.split('/')[1])}`;
    return;
        }
         window.location.href = routes[route] || 'index.html';
           }
