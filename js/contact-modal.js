/**
 * Jeremy Pringle Portfolio - Contact Modal Component
 * Injects and manages the premium booking/contact experience.
 */

const contactModalHTML = `
<div id="bookingModal" class="modal-overlay">
  <div class="modal-content">
    <button id="closeModal" class="modal-close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    
    <!-- Step 1: Selection -->
    <div id="bookingStep1" class="booking-step active">
      <div class="modal-header">
        <div class="modal-tag">Collaborate</div>
        <h3 class="modal-title">Got an idea?<br>Let's build it.</h3>
        <p class="modal-desc">I take on a limited number of projects each month. Select how you'd like to connect to get started.</p>
      </div>
      <div class="booking-options">
        <button class="modal-btn-option" data-type="virtual">
          <div class="opt-icon">💻</div>
          <div class="opt-text">
            <strong>Virtual Call</strong>
            <span>15-min Google Meet</span>
          </div>
        </button>
        <button class="modal-btn-option" data-type="in-person">
          <div class="opt-icon">☕</div>
          <div class="opt-text">
            <strong>In Person</strong>
            <span>Coffee in Rochester, MN</span>
          </div>
        </button>
        <button class="modal-btn-option" data-type="message">
          <div class="opt-icon">✉️</div>
          <div class="opt-text">
            <strong>Send a Message</strong>
            <span>Direct inquiry</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Step 2: Date/Time Selection -->
    <div id="bookingStep2" class="booking-step">
      <button class="modal-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button>
      <div class="modal-header">
        <h3 class="modal-title">Select a time</h3>
        <p class="modal-desc">When are you free for our <span id="displayLocationType"></span>?</p>
      </div>
      <div class="calendar-wrap">
        <div class="days-grid">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div class="dates-grid" id="datesGrid"></div>
      </div>
      <div class="time-slots" id="timeSlots"></div>
    </div>

    <!-- Step 3: Details (Booking) -->
    <div id="bookingStep3" class="booking-step">
      <button class="modal-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button>
      <div class="modal-header">
        <h3 class="modal-title">Almost there</h3>
        <p class="modal-desc">Confirming for <span id="bookingDateTime" style="font-weight: 600; color: var(--text);"></span></p>
      </div>
      <form id="bookingForm" class="booking-form">
        <input type="hidden" id="bookType" name="location">
        <input type="hidden" id="bookDate" name="date">
        <input type="hidden" id="bookTime" name="time">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" required placeholder="John Doe">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label>Phone (Optional)</label>
            <input type="tel" name="phone" placeholder="(507) 000-0000">
          </div>
        </div>
        <div class="form-group">
          <label>Briefly, what are we building?</label>
          <textarea name="message" placeholder="A new SaaS platform, a portfolio redesign, etc." rows="3"></textarea>
        </div>
        <button type="submit" class="btn-p" style="width: 100%; border: none; justify-content: center; margin-top: 10px;" id="confirmBookingBtn">Book now</button>
      </form>
    </div>

    <!-- Step 4: Simple Message Form -->
    <div id="messageStep" class="booking-step">
      <button class="modal-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back</button>
      <div class="modal-header">
        <h3 class="modal-title">Send a message</h3>
        <p class="modal-desc">Have a question or a quick inquiry? Drop it below and I'll get back to you within 24 hours.</p>
      </div>
      <form id="messageForm" class="booking-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" required placeholder="John Doe">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label>Phone (Optional)</label>
            <input type="tel" name="phone" placeholder="(507) 000-0000">
          </div>
        </div>
        <div class="form-group">
          <label>Your Message</label>
          <textarea name="message" required placeholder="Tell me a bit about what you're thinking..." rows="5"></textarea>
        </div>
        <button type="submit" class="btn-p" style="width: 100%; border: none; justify-content: center; margin-top: 10px;" id="confirmMessageBtn">Send message</button>
      </form>
    </div>

    <!-- Success State -->
    <div id="bookingSuccess" class="booking-step">
       <div class="success-wrap">
          <div class="success-icon">🎉</div>
          <h2 class="modal-title" id="successTitle">You're booked!</h2>
          <p class="modal-desc" id="successDesc">I've sent a calendar invite to <span id="successEmail" style="font-weight: 600;"></span>. Talk soon!</p>
          <button class="btn-g" id="finishBookingBtn" style="margin-top: 32px; width: 100%; justify-content: center;">Done</button>
       </div>
    </div>
  </div>
</div>
`;

const injectModal = () => {
  if (document.getElementById('bookingModal')) return;
  const container = document.createElement('div');
  container.innerHTML = contactModalHTML;
  document.body.appendChild(container.firstElementChild);
  
  initModalLogic();
};

const initModalLogic = () => {
  const modal = document.getElementById('bookingModal');
  const close = document.getElementById('closeModal');
  const steps = document.querySelectorAll('.booking-step');
  const form = document.getElementById('bookingForm');
  
  const showStep = (stepId) => {
    steps.forEach(s => s.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
  };

  // Open triggers
  document.querySelectorAll('.openBookingBtn, .nav-cta, .openMessageBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      if (btn.classList.contains('openMessageBtn')) {
        showStep('messageStep');
      } else {
        showStep('bookingStep1');
      }
    });
  });

  close.onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Step 1 -> 2 or 4
  document.querySelectorAll('.modal-btn-option').forEach(btn => {
    btn.onclick = () => {
      const type = btn.getAttribute('data-type');
      if (type === 'message') {
        showStep('messageStep');
      } else {
        document.getElementById('bookType').value = type;
        document.getElementById('displayLocationType').textContent = type === 'virtual' ? 'Virtual Call' : 'In Person Meeting';
        showStep('bookingStep2');
        generateDates();
      }
    };
  });

  // Back buttons
  document.querySelectorAll('.modal-back').forEach(btn => {
    btn.onclick = () => {
      const current = btn.closest('.booking-step').id;
      if (current === 'bookingStep2' || current === 'messageStep') showStep('bookingStep1');
      if (current === 'bookingStep3') showStep('bookingStep2');
    };
  });

  // Calendar logic
  let selectedDate = null;
  const generateDates = () => {
    const grid = document.getElementById('datesGrid');
    const today = new Date();
    grid.innerHTML = '';
    
    // Header for Month/Year
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const header = document.createElement('div');
    header.style.cssText = 'grid-column: 1 / -1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); margin-bottom: 12px; text-align: left;';
    header.textContent = monthYear;
    grid.appendChild(header);

    // Get first day of month and total days
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Fill blanks for days of week before the 1st
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      grid.appendChild(blank);
    }

    // Generate month days
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        const isPast = d < new Date(today.setHours(0,0,0,0));
        const day = d.getDay();
        const isWeekend = (day === 0 || day === 6);
        
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        if (isPast || isWeekend) {
            btn.disabled = true;
            btn.style.opacity = '0.2';
            btn.style.cursor = 'default';
        }
        
        btn.innerHTML = `<strong>${i}</strong>`;
        btn.onclick = () => {
          document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedDate = d;
          renderTimes();
        };
        grid.appendChild(btn);
    }
  };

  const renderTimes = () => {
    const slots = document.getElementById('timeSlots');
    slots.innerHTML = '';
    slots.classList.add('active');
    ['9:00 AM', '11:30 AM', '1:00 PM', '3:30 PM'].forEach(t => {
      const b = document.createElement('button');
      b.className = 'time-slot';
      b.textContent = t;
      b.onclick = () => {
        const fullDate = selectedDate.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'});
        document.getElementById('bookingDateTime').textContent = `${fullDate} at ${t}`;
        document.getElementById('bookDate').value = fullDate;
        document.getElementById('bookTime').value = t;
        showStep('bookingStep3');
      };
      slots.appendChild(b);
    });
  };

  // Shared submit helper
  const handleSubmission = async (formElement, endpoint, successTitle, successDesc) => {
    const btn = formElement.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    const data = Object.fromEntries(new FormData(formElement).entries());
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 20000 });
      }
      
      document.getElementById('successTitle').textContent = successTitle;
      document.getElementById('successDesc').innerHTML = successDesc.replace('{email}', data.email);
      showStep('bookingSuccess');
    } catch (err) {
      alert('Action failed. Please email me directly at hey@jeremypringle.com');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  };

  // Booking Form Submission
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      handleSubmission(
        form, 
        '/.netlify/functions/book-call', 
        "You're booked!", 
        "I've sent a calendar invite to <strong>{email}</strong>. Talk soon!"
      );
    };
  }

  // Message Form Submission
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    messageForm.onsubmit = (e) => {
      e.preventDefault();
      handleSubmission(
        messageForm, 
        '/.netlify/functions/send-message', 
        "Message sent!", 
        "Thanks for reaching out! I'll get back to you at <strong>{email}</strong> shortly."
      );
    };
  }

  document.getElementById('finishBookingBtn').onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
};

document.addEventListener('DOMContentLoaded', injectModal);
window.openContactModal = () => {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};
