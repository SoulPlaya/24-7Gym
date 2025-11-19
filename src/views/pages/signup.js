const signUpPage = `
    <body>
        <div class="container">
            <form class="signup-form">
                <h2>Join 24/7 Gym</h2>
                <p>Become a member and start your transformation today.</p>

                <label for="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" required>

                <label for="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" required>

                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="(555) 123-4567" required>

                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" required>

                <label for="membership">Membership Plan</label>
                <select id="membership" required>
                    <option value="">Choose a plan</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                </select>

                <br>
                <button type="submit" class="login-btn-submit">Sign up</button>

                <p class="login-signup-link">Already have an account? <a href="#">Log in</a></p>            
            </form>
        </div>
    </body>
    <script>
        const form = document.querySelector('.signup-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page reload

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const membership = document.getElementById('membership').value;

            try {
                const res = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name, phone, membership })
                });

                const text = await res.text();
                document.body.innerHTML = text; // replace page with response message
            } catch (err) {
                alert('Signup failed: ' + err.message);
            }
        });
    </script>
`;
   
export default signUpPage;