const signUpPage = `
    <body>
        <div class="container">
            <form class="signup-form" action="/signup" method="POST">
                <h2>Join 24/7 Gym</h2>
                <p>Become a member and start your transformation today.</p>
                
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="John Doe" required>
                
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="john@example.com" required>
                
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required>
                
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Create a password" required>
                
                <label for="emergency_contact_number">Emergency Contact Number</label>
                <input type="tel" id="emergency_contact_number" name="emergency_contact_number" placeholder="(555) 987-6543" required>
                
                <br></br>
                <button type="submit" class="login-btn-submit">Sign up</button>
                <p class="login-signup-link">Already have an account? <a href="#">Log in</a></p>            
            </form>
        </div>
    </body>
`;

export default signUpPage;