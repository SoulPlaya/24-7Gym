const homePage = `
    <div class="hero">
        <div class="hero-overlay"></div>
        <video autoplay muted loop playsinline class="hero-video">
            <source src="../../videos/1110_compressed.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <div class="hero-content">
            <div class="hero-accent"></div>
            <h1 class="hero-title">
                <span class="hero-title-main">24/7 Fit </span>
                <span class="hero-title-sub">Elite Fitness Community</span>
            </h1>
            <p class="hero-tagline">Nothing Will Work Unless You Do</p>
            <div class="hero-cta">
                <a href="/classes" class="btn btn-primary">View Our Plans</a>
                <a href="/about" class="btn btn-secondary">What We Are All About</a>
            </div>
        </div>
        <div class="hero-scroll-indicator">
            <span class="scroll-text">Explore</span>
            <span class="scroll-arrow">↓</span>
        </div>
    </div>

    <section class="gallery-section">
        <div class="container">
            <div class="gallery-grid">
                <div class="gallery-item"><img src="../../images/lake.jpg" alt="Strength Training"></div>
                <div class="gallery-item wide"><img src="../../images/lake2.jpg" alt="Cardio Zone"></div>
                <div class="gallery-item wide"><img src="../../images/joey4.jpg" alt="Group Session"></div>
                <div class="gallery-item"><img src="../../images/joey.jpg" alt="Heavy Lifting"></div>
                <div class="gallery-item wide"><img src="../../images/joey2.jpg" alt="Functional Training"></div>
                <div class="gallery-item wide"><img src="../../images/joey3.jpg" alt="Athletes"></div>
                <div class="gallery-item tall"><img src="../../images/red.jpg" alt="Fitness Equipment"></div>
                <div class="gallery-item wide"><img src="../../images/red2.jpg" alt="Weightlifting Area"></div>
                <div class="gallery-item wide"><img src="../../images/247.jpg" alt="Personal Training"></div>
            </div>
        </div>
    </section>

    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Why Choose 24/7 Fit?</h2>
                <p class="section-subtitle">Experience A Gym Community Dedicated To Hard Work And Growth</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i data-lucide="dumbbell"></i>
                    </div>
                    <h3 class="feature-title">Training Equipment</h3>
                    <p class="feature-description">Access to a large variety of gym equipment to workout every part of the body.</p> 
                    <div class="feature-link">
                        <a href="/equipment">Explore Equipment →</a>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i data-lucide="flask-conical"></i>
                    </div>
                    <h3 class="feature-title">Elite Training Staff</h3>
                    <p class="feature-description">Work with certified expert trainer who create personalized programs tailored to your unique goals and fitness level.</p>
                    <div class="feature-link">
                        <a href="/classes">Meet Our Team →</a>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i data-lucide="clock-fading"></i>
                    </div>
                    <h3 class="feature-title">24/7 Access</h3>
                    <p class="feature-description">Train on your schedule with unlimited round-the-clock access. Your fitness journey doesn't sleep, and neither do we.</p>
                    <div class="feature-link">
                        <a href="/classes">Learn More →</a>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i data-lucide="castle"></i>
                    </div>
                    <h3 class="feature-title">Premium Facility</h3>
                    <p class="feature-description">Experience a state-of-the-art gym designed for performance, comfort, and results. Our premium facility features top-tier equipment, modern training spaces, and an atmosphere built to elevate every workout..</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <h3 class="feature-title">Dynamic Group Classes</h3>
                    <p class="feature-description">High-energy group classes coming.</p>
                    <div class="feature-link">
                        <a href="/classes">Class Schedule →</a>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                    <i data-lucide="utensils-crossed"></i>
                    </div>
                    <h3 class="feature-title">Nutrition Coaching</h3>
                    <p class="feature-description">Expert nutritional guidance and meal planning to fuel your performance and amplify your transformation results.</p>
                    <div class="feature-link">
                        <a href="/nutrition">Get Started →</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2 class="cta-title">Ready to Transform?</h2>
                <p class="cta-text">Join the PowerFit community and start your journey to peak performance today.</p>
                <a href="/classes" class="btn btn-primary btn-large">View Membership Plans</a>
            </div>
    </div>
</section>
`;

export default homePage;