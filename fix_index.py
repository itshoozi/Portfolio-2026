import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove inline styles
html = re.sub(r'<style>.*?</style>', '<link rel=\"stylesheet\" href=\"css/style.css\">', html, flags=re.DOTALL)

# Add scripts at the end of body
scripts = '''
<!-- Stepped Booking Modal -->
<div id=\"bookingModal\" class=\"modal-overlay\">
  <div class=\"modal-content\">
    <button id=\"closeModal\" class=\"modal-close\">&times;</button>
    <div id=\"bookingStep1\" class=\"booking-step active\">
      <h3 style=\"margin-bottom: 8px;\">Let\\'s get together</h3>
      <p style=\"color: var(--text-light); font-size: 0.9rem; margin-bottom: 24px;\">How would you like to connect?</p>
      <div class=\"booking-options\">
        <button class=\"modal-btn-option\" data-type=\"virtual\">
          <span style=\"font-size: 1.5rem; display: block; margin-bottom: 12px;\">💻</span>
          Virtual Call
        </button>
        <button class=\"modal-btn-option\" data-type=\"in-person\">
          <span style=\"font-size: 1.5rem; display: block; margin-bottom: 12px;\">☕</span>
          In Person
          <span style=\"display: block; font-size: 0.75rem; color: var(--text-light); margin-top: 4px; font-weight: 400;\">Coffee / Office</span>
        </button>
      </div>
    </div>
    <div id=\"bookingStep2\" class=\"booking-step\">
      <button class=\"modal-back\">&larr; Back</button>
      <h3 style=\"margin-bottom: 8px;\">Select a time</h3>
      <p style=\"color: var(--text-light); font-size: 0.9rem; margin-bottom: 24px;\">When are you free for our <span id=\"displayLocationType\"></span>?</p>
      <div class=\"days-grid\">
        <span class=\"day-name\">Sun</span><span class=\"day-name\">Mon</span><span class=\"day-name\">Tue</span>
        <span class=\"day-name\">Wed</span><span class=\"day-name\">Thu</span><span class=\"day-name\">Fri</span><span class=\"day-name\">Sat</span>
      </div>
      <div class=\"dates-grid\" id=\"datesGrid\"></div>
      <div class=\"time-slots\" id=\"timeSlots\"></div>
    </div>
    <div id=\"bookingStep3\" class=\"booking-step\">
      <button class=\"modal-back\">&larr; Back</button>
      <h3 style=\"margin-bottom: 8px;\">Your Details</h3>
      <p style=\"color: var(--text-light); font-size: 0.9rem; margin-bottom: 24px;\">Confirming for <span id=\"bookingDateTime\" style=\"font-weight: 600; color: var(--text);\"></span></p>
      <form id=\"bookingForm\" class=\"booking-form\">
        <input type=\"hidden\" id=\"bookType\" name=\"location\">
        <input type=\"hidden\" id=\"bookDate\" name=\"date\">
        <input type=\"hidden\" id=\"bookTime\" name=\"time\">
        <div class=\"form-group\">
          <label for=\"bName\">Name</label>
          <input type=\"text\" id=\"bName\" name=\"name\" required placeholder=\"John Doe\">
        </div>
        <div class=\"form-row\">
          <div class=\"form-group\">
            <label for=\"bEmail\">Email</label>
            <input type=\"email\" id=\"bEmail\" name=\"email\" required placeholder=\"john@example.com\">
          </div>
          <div class=\"form-group\">
            <label for=\"bPhone\">Phone Number</label>
            <input type=\"tel\" id=\"bPhone\" name=\"phone\" required placeholder=\"(555) 123-4567\">
          </div>
        </div>
        <button type=\"submit\" class=\"btn-p\" style=\"width: 100%; margin-top: 16px; border: none; text-align: center; justify-content: center;\" id=\"confirmBookingBtn\">Confirm Booking</button>
      </form>
    </div>
    <div id=\"bookingSuccess\" class=\"booking-step\">
       <div style=\"text-align: center; padding: 40px 0;\">
          <h2 style=\"margin-bottom: 16px;\">You\\'re booked! 🎉</h2>
          <p style=\"color: var(--text-light);\">I sent a confirmation email to <span id=\"successEmail\" style=\"color: var(--text); font-weight: 500;\"></span>.</p>
          <p style=\"color: var(--text-light); margin-top: 8px;\">Talk to you soon!</p>
          <button class=\"btn-g\" id=\"finishBookingBtn\" style=\"margin-top: 32px;\">Done</button>
       </div>
    </div>
  </div>
</div>
<script src=\"https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js\"></script>
<script src=\"js/app.js\"></script>
</body>
'''
html = html.replace('</body>', scripts)

# Direct exact string replacements for links
old_arcade = '<div class=\"wcard feat reveal d1\" style=\"--cc:#30d158\">\n        <div><div class=\"wcard-top\"><div class=\"wcard-ico\">🕹️</div><span class=\"wcard-arr\">↗</span></div><div class=\"wcard-title\">Old School Arcade</div><div class=\"wcard-body\">Not just a website — I run this place. As GM I grew revenue +$55k (+22%) in under a year, cut ad spend 65%, rebuilt the site from scratch, and navigated city planning to secure a liquor license the city had previously denied.</div><div class=\"wtags\"><span class=\"wtag\">GM & Ops</span><span class=\"wtag\">Web Dev</span><span class=\"wtag\">Growth</span><span class=\"wtag\">Ads</span></div></div>\n        <div class=\"feat-metric\"><div><div class=\"feat-num\">+22%</div><div class=\"feat-lbl\">Revenue in &lt;12 months</div></div></div>\n      </div>'
new_arcade = old_arcade.replace('<div class=\"wcard', '<a href=\"old-school-arcade.html\" class=\"wcard').replace('\n      </div>', '\n      </a>')
html = html.replace(old_arcade, new_arcade)

old_science = '<div class=\"wcard reveal d2\" style=\"--cc:#4f9eff\"><div class=\"wcard-top\"><div class=\"wcard-ico\">🧬</div><span class=\"wcard-arr\">↗</span></div><div class=\"wcard-title\">Science Geek Games</div><div class=\"wcard-body\">Website launch with an interactive card game demo. Consulted on Amazon seller compliance to significantly reduce platform fees.</div><div class=\"wtags\"><span class=\"wtag\">Web</span><span class=\"wtag\">Strategy</span><span class=\"wtag\">SEO</span></div></div>'
new_science = old_science.replace('<div class=\"wcard', '<a href=\"science-geek-games.html\" class=\"wcard').replace('</div></div></div>', '</div></div></a>')
# careful about ending div replacement
new_science = '<a href="science-geek-games.html" class="wcard reveal d2" style="--cc:#4f9eff"><div class="wcard-top"><div class="wcard-ico">🧬</div><span class="wcard-arr">↗</span></div><div class="wcard-title">Science Geek Games</div><div class="wcard-body">Website launch with an interactive card game demo. Consulted on Amazon seller compliance to significantly reduce platform fees.</div><div class="wtags"><span class="wtag">Web</span><span class="wtag">Strategy</span><span class="wtag">SEO</span></div></a>'
html = html.replace(old_science, new_science)

old_garden = '<div class=\"wcard reveal d3\" style=\"--cc:#ff6b35\"><div class=\"wcard-top\"><div class=\"wcard-ico\">🛹</div><span class=\"wcard-arr\">↗</span></div><div class=\"wcard-title\">The Garden Skate Shop</div><div class=\"wcard-body\">Built the site and a membership program now driving 5–10% of monthly revenue. Also built the custom software backend to run it.</div><div class=\"wtags\"><span class=\"wtag\">Web Dev</span><span class=\"wtag\">Software</span><span class=\"wtag\">Revenue</span></div></div>'
new_garden = '<a href="the-garden.html" class="wcard reveal d3" style="--cc:#ff6b35"><div class="wcard-top"><div class="wcard-ico">🛹</div><span class="wcard-arr">↗</span></div><div class="wcard-title">The Garden Skate Shop</div><div class="wcard-body">Built the site and a membership program now driving 5–10% of monthly revenue. Also built the custom software backend to run it.</div><div class="wtags"><span class="wtag">Web Dev</span><span class="wtag">Software</span><span class="wtag">Revenue</span></div></a>'
html = html.replace(old_garden, new_garden)

old_eastwood = '<div class=\"wcard reveal d2\" style=\"--cc:#ffd60a\"><div class=\"wcard-top\"><div class=\"wcard-ico\">🍕</div><span class=\"wcard-arr\">↗</span></div><div class=\"wcard-title\">Eastwood Caddyshack</div><div class=\"wcard-body\">First website and delivery integration that worked with existing kitchen software. Delivery is now ~15% of revenue. Got them a free pro photoshoot through Uber Eats.</div><div class=\"wtags\"><span class=\"wtag\">Web</span><span class=\"wtag\">Integration</span><span class=\"wtag\">Growth</span></div></div>'
new_eastwood = '<a href="#" class="wcard reveal d2" style="--cc:#ffd60a"><div class="wcard-top"><div class="wcard-ico">🍕</div><span class="wcard-arr">↗</span></div><div class="wcard-title">Eastwood Caddyshack</div><div class="wcard-body">First website and delivery integration that worked with existing kitchen software. Delivery is now ~15% of revenue. Got them a free pro photoshoot through Uber Eats.</div><div class="wtags"><span class="wtag">Web</span><span class="wtag">Integration</span><span class="wtag">Growth</span></div></a>'
html = html.replace(old_eastwood, new_eastwood)

old_dbscript = '<div class=\"wcard reveal d3\" style=\"--cc:#8b6fff\"><div class=\"wcard-top\"><div class=\"wcard-ico\">🤖</div><span class=\"wcard-arr\">↗</span></div><div class=\"wcard-title\">db-script & Advice Bot</div><div class=\"wcard-body\">Open-source Discord framework — 150k+ npm downloads, 2k-developer community before I sold it. Advice Bot ran in ~10k servers across ~500k users.</div><div class=\"wtags\"><span class=\"wtag\">Open Source</span><span class=\"wtag\">Node.js</span><span class=\"wtag\">Community</span></div></div>'
new_dbscript = '<a href="db-script.html" class="wcard reveal d3" style="--cc:#8b6fff"><div class="wcard-top"><div class="wcard-ico">🤖</div><span class="wcard-arr">↗</span></div><div class="wcard-title">db-script & Advice Bot</div><div class="wcard-body">Open-source Discord framework — 150k+ npm downloads, 2k-developer community before I sold it. Advice Bot ran in ~10k servers across ~500k users.</div><div class="wtags"><span class="wtag">Open Source</span><span class="wtag">Node.js</span><span class="wtag">Community</span></div></a>'
html = html.replace(old_dbscript, new_dbscript)


# CTA
html = html.replace('<button class=\"btn-g\" id=\"cfbtn\">🎉 You deserve confetti</button>', '<button class=\"btn-g\" id=\"openBookingFormBtn\">Book a Call</button>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
