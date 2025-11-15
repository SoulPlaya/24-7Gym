const loginPage = `
      <link rel="stylesheet" href="/css/styles.css">
      <body class="login-page">
            <div class="login-container">
                  <div class="login-card">
                        <div class="login-header">
                              <h1 class="login-logo">24/7</h1>
                              <div class="login-accent"></div>
                              <p class="login-subtitle">Welcome back, champion</p>
                        </div>

                        <form class="login-form">
                              <div class="login-form-group">
                                    <label for="email" class="login-form-label">Email Address</label>
                                    <input
                                          type="email"
                                          id="email"
                                          name="email"
                                          class="login-form-input"
                                          placeholder="your.email@example.com"
                                          required
                                    >
                              </div>

                              <div class="login-form-group">
                                    <label for="password" class="login-form-label">Password</label>
                                    <input
                                          type="password"
                                          id="password"
                                          name="password"
                                          class="login-form-input"
                                          placeholder="Enter your password"
                                          required
                                    >
                              </div>

                              <div class="login-form-options">
                                    <div class="login-remember-me">
                                          <input type="checkbox" id="remember" name="remember" class="login-remember-checkbox">
                                          <label for="remember" class="login-remember-label">Remember me</label>
                                    </div>
                                    <a href="#" class="login-forgot-password">Forgot Password?</a>
                              </div>

                              <button type="submit" class="login-btn-submit">Sign In</button>

                              <div class="login-signup-link">
                                    Don't have an account? <a href="#">Sign Up</a>
                              </div>
                        </form>
                        
                        <br>
                        <div class="hero-cta">
                              <a href="/" class="btn btn-secondary">Back to home</a>
                        </div>
                  </div>
            </div>
      </body>
`;

export default loginPage;