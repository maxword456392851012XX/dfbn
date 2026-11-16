document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. БУРГЕР-МЕНЮ (Мобильная навигация)
  // ==========================================
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
    });

    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 2. АНИМАЦИЯ ПРИ СКРОЛЛЕ
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 3. ОТПРАВКА ФОРМЫ В TELEGRAM
  // ==========================================
  const form = document.getElementById('booking-form');
  const successMsg = document.getElementById('form-success');

  const TELEGRAM_TOKEN = '9034542069:AAGZTS-Ar3r28hKMarGPRbMeplnG1HDzLF8'; 
  const CHAT_ID = '7594452183';

  if (form && successMsg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = 'Отправка...';
      submitBtn.disabled = true;

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const car = document.getElementById('car').value;
      
      const serviceSelect = document.getElementById('service');
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      
      const date = document.getElementById('date').value;
      const message = document.getElementById('message').value;

      const text = `
🔥 <b>Новая заявка с сайта!</b>
👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
🚘 <b>Авто:</b> ${car}
🛠 <b>Услуга:</b> ${serviceSelect.value ? serviceText : 'Не выбрана'}
📅 <b>Дата:</b> ${date || 'Не указана'}
💬 <b>Комментарий:</b> ${message || 'Нет комментариев'}
      `;

      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML'
          })
        });

        if (response.ok) {
          successMsg.hidden = false;
          form.reset();
          setTimeout(() => { successMsg.hidden = true; }, 5000);
        } else {
          alert('Ошибка при отправке. Пожалуйста, напишите нам в мессенджер.');
        }
      } catch (error) {
        alert('Ошибка сети. Проверьте интернет-соединение.');
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});