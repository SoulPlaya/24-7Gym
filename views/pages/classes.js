const classesPage = `
<div class="hero">
    <h1>Group Fitness Classes</h1>
    <p>Find Your Perfect Workout</p>
</div>

<div class="container">
    <h2>Weekly Schedule</h2>
    <table class="schedule-table">
        <thead>
            <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Wednesday</th>
                <th>Friday</th>
                <th>Saturday</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>6:00 AM</td>
                <td>Early Bird HIIT</td>
                <td>Morning Yoga</td>
                <td>Early Bird HIIT</td>
                <td>Power Cycling</td>
            </tr>
            <tr>
                <td>9:00 AM</td>
                <td>Pilates Flow</td>
                <td>Boxing Fitness</td>
                <td>Pilates Flow</td>
                <td>Yoga Basics</td>
            </tr>
            <tr>
                <td>12:00 PM</td>
                <td>Lunch Break Cardio</td>
                <td>Core Strength</td>
                <td>Lunch Break Cardio</td>
                <td>Zumba Party</td>
            </tr>
            <tr>
                <td>5:30 PM</td>
                <td>Power Cycling</td>
                <td>Bootcamp</td>
                <td>Power Cycling</td>
                <td>Meditation & Stretch</td>
            </tr>
            <tr>
                <td>7:00 PM</td>
                <td>Evening Yoga</td>
                <td>HIIT Circuit</td>
                <td>Evening Yoga</td>
                <td>-</td>
            </tr>
        </tbody>
    </table>
    
    <h2 style="margin-top: 3rem;">Class Descriptions</h2>
    <div class="grid">
        <div class="card">
            <h3>HIIT</h3>
            <p>High-Intensity Interval Training for maximum calorie burn and cardiovascular fitness.</p>
        </div>
        <div class="card">
            <h3>Yoga</h3>
            <p>Improve flexibility, balance, and mental clarity through various yoga styles.</p>
        </div>
        <div class="card">
            <h3>Cycling</h3>
            <p>Intense cardio workout on stationary bikes with energizing music.</p>
        </div>
        <div class="card">
            <h3>Boxing Fitness</h3>
            <p>Learn boxing techniques while getting an incredible full-body workout.</p>
        </div>
        <div class="card">
            <h3>Pilates</h3>
            <p>Strengthen your core and improve posture with low-impact exercises.</p>
        </div>
        <div class="card">
            <h3>Bootcamp</h3>
            <p>Military-inspired training that builds strength and endurance.</p>
        </div>
    </div>
</div>
`;

module.exports = classesPage;

// ============================================
// FILE: views/pages/pricing.js
// ============================================
const pricingPage = `
<div class="hero">
    <h1>Membership Plans</h1>
    <p>Choose the Perfect Plan for Your Goals</p>
</div>

<div class="container">
    <div class="grid">
        <div class="card price-card">
            <h3>Basic</h3>
            <div class="price">$29<span style="font-size: 1rem;">/month</span></div>
            <ul class="features">
                <li>Access to gym equipment</li>
                <li>Locker room access</li>
                <li>Open gym hours (24/7)</li>
                <li>Free fitness training</li>
                
            </ul>
            <a href="/contact" class="btn" style="margin-top: 1rem;">Get Started</a>
        </div>
        
       
        
        <div class="card price-card">
            <h3>Elite</h3>
            <div class="price">$110<span style="font-size: 1rem;">/month</span></div>
            <ul class="features">
                <li>Everything in Premium</li>
                <li>Unlimited personal training</li>
                <li>Nutrition coaching</li>
                <li>Guest privileges (2/month)</li>
                <li>Priority class booking</li>
                <li>Free merchandise</li>
            </ul>
            <a href="/contact" class="btn" style="margin-bottom: 1rem;">Get Started</a>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 3rem; padding: 2rem; background: #f5f5f5; border-radius: 10px;">
        <h3>Special Offers</h3>
        <p style="font-size: 1.1rem; margin: 1rem 0;">
            🎉 First month FREE for annual memberships<br>
            👥 Bring a friend and both get 20% off<br>
            🎓 Student discount: 15% off all plans
        </p>
    </div>
</div>
`;

module.exports = pricingPage