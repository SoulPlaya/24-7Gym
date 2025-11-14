const contactPage = `
<div class="hero">
    <h1>Get In Touch</h1>
    <p>We'd Love to Hear From You</p>
</div>

<div class="container">
    <form action="/contact" method="POST">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone">
        </div>
        
        <div class="form-group">
            <label for="interest">I'm Interested In</label>
            <select id="interest" name="interest">
                <option>Membership</option>
                <option>Personal Training</option>
                <option>Group Classes</option>
                <option>Corporate Wellness</option>
                <option>Other</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5"></textarea>
        </div>
        
        <button type="submit">Send Message</button>
    </form>
    
    <div class="grid" style="margin-top: 3rem;">
        <div class="card">
            <h3>📍 Location</h3>
            <p>1074 Bear Creek Blvd. Suites F-l Hampton, Georgia 30228 </p>
        </div>
        <div class="card">
            <h3>📞 Phone</h3>
            <p> (404)409-0169</p>
            <p> (404)660-2822</p>
        </div>
        <div class="card">
            <h3>✉️ Email</h3>
            <p>info@247fitsouth</p>
            <p>oqbk194@icloud.com</p>
        </div>
    </div>
</div>
`;

export default contactPage;