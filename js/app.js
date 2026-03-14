document.addEventListener('DOMContentLoaded', () => {

  // Intersection Observer for scroll reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  // Calendar Booking UI Logic
  const datesGrid = document.getElementById('datesGrid');
  const timeSlotsContainer = document.getElementById('timeSlots');
  let selectedDate = null;
  
  // Modal & Step Elements
  const openModalBtns = document.querySelectorAll('.openBookingBtn');
  const bookingModal = document.getElementById('bookingModal');
  const closeModal = document.getElementById('closeModal');
  const bookingForm = document.getElementById('bookingForm');
  
  const step1 = document.getElementById('bookingStep1');
  const step2 = document.getElementById('bookingStep2');
  const step3 = document.getElementById('bookingStep3');
  const stepSuccess = document.getElementById('bookingSuccess');
  
  const bookTypeInput = document.getElementById('bookType');
  const bookDateInput = document.getElementById('bookDate');
  const bookTimeInput = document.getElementById('bookTime');
  const bookingDateTimeDisplay = document.getElementById('bookingDateTime');
  const displayLocationType = document.getElementById('displayLocationType');

  const updateModalStep = (activeStep) => {
    document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
    if (activeStep) activeStep.classList.add('active');
  };

  if (openModalBtns.length > 0) {
    openModalBtns.forEach(btn => {
      btn.onclick = () => {
        if (!bookingModal) return;
        bookingModal.classList.add('active');
        if (bookingForm) bookingForm.reset();
        updateModalStep(step1);
      };
    });
  }

  if (closeModal && bookingModal) {
    closeModal.onclick = () => {
      bookingModal.classList.remove('active');
    };
  }

  // Back Navigation
  document.querySelectorAll('.modal-back').forEach(btn => {
    btn.onclick = (e) => {
      const parent = e.target.closest('.booking-step');
      if (parent.id === 'bookingStep2') updateModalStep(step1);
      if (parent.id === 'bookingStep3') updateModalStep(step2);
    };
  });

  // Step 1 -> Step 2
  document.querySelectorAll('.modal-btn-option').forEach(btn => {
    btn.onclick = (e) => {
      const type = e.currentTarget.getAttribute('data-type');
      if (bookTypeInput) bookTypeInput.value = type;
      if (displayLocationType) {
        displayLocationType.textContent = type === 'virtual' ? 'Virtual Call' : 'In-Person Meeting';
      }
      updateModalStep(step2);
    };
  });

  // Generate simple 7-day calendar window
  const generateDates = () => {
    if (!datesGrid) return;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const btn = document.createElement('button');
      btn.className = 'date-btn';
      btn.textContent = date.getDate();

      const day = date.getDay();
      if (day === 0 || day === 6) {
        btn.classList.add('disabled');
      } else {
        btn.onclick = () => selectDate(date, btn);
      }
      datesGrid.appendChild(btn);
    }
  };

  const selectDate = async (date, btnElement) => {
    document.querySelectorAll('.date-btn.active').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    selectedDate = date;

    if (timeSlotsContainer) {
      timeSlotsContainer.innerHTML = '<span class="tag">Loading slots...</span>';
      timeSlotsContainer.classList.add('show');
    }

    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await fetch(`/.netlify/functions/get-availability?date=${dateStr}`);

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      renderTimeSlots(data.slots);
    } catch (e) {
      console.warn('Netlify function failed or not running, using fallback UI');
      renderFallbackSlots();
    }
  };

  // Step 2 -> Step 3
  const renderTimeSlots = (slots) => {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';
    if (slots.length === 0) {
      timeSlotsContainer.innerHTML = '<span class="tag">No slots available today.</span>';
      return;
    }
    slots.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'time-slot';
      btn.textContent = time;
      btn.onclick = () => {
        const dateStr = selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        if (bookingDateTimeDisplay) bookingDateTimeDisplay.textContent = `${dateStr} at ${time}`;
        if (bookDateInput) bookDateInput.value = dateStr;
        if (bookTimeInput) bookTimeInput.value = time;
        updateModalStep(step3);
      };
      timeSlotsContainer.appendChild(btn);
    });
  };

  // Step 3 Form Submission -> Success
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const confirmBtn = document.getElementById('confirmBookingBtn');
      const originalText = confirmBtn.textContent;
      confirmBtn.textContent = 'Booking...';
      confirmBtn.disabled = true;

      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());

      try {
        await fetch('/.netlify/functions/book-call', {
          method: 'POST',
          body: JSON.stringify(data)
        });

        // Run Confetti
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0066cc', '#FF9B00', '#DF1D4F', '#8928CB'],
            zIndex: 10001
          });
        }

        const successEmailElement = document.getElementById('successEmail');
        if (successEmailElement) successEmailElement.textContent = data.email;
        updateModalStep(stepSuccess);

      } catch (err) {
        alert('Whoops! There was an issue making your booking. Please email me directly to schedule.');
      } finally {
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
      }
    });
  }

  // Done logic
  const finishBtn = document.getElementById('finishBookingBtn');
  if (finishBtn) {
    finishBtn.onclick = () => {
      if (bookingModal) bookingModal.classList.remove('active');
    };
  }

  const renderFallbackSlots = () => {
    // Fake 8am to 4pm
    const fallback = ["08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM"];
    renderTimeSlots(fallback);
  };

  generateDates();

  // Spotlight effect for bento items
  document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Magnetic Buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px) scale(1)`;
    });
  });
});
