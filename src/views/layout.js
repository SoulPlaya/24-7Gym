const layout = (title, content, supabaseUrl, supabaseAnon, user = null) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 24/7 Fitness</title>
    <link rel="stylesheet" href="/css/styles.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/memberships">memberships</a></li>
            <li><a href="/contact">Contact</a></li>
            ${user ? `
                <li><a href="/qr-code">My QR Code</a></li>
            ` : `
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Sign Up</a></li>
            `}
        </ul>
    </nav>

    ${content}

    <footer>
        <p>&copy; 2025 24/7 fit Gym. All rights reserved.</p>
        <p>1074 Bear creek blvd suite i, hampton, Ga 30228 | (404) 409-0169</p>
    </footer>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            lucide.createIcons();
        });
    </script>

    <script type="module">
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

        const SUPABASE_URL = "${supabaseUrl}";
        const SUPABASE_ANON_KEY = "${supabaseAnon}";
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        async function hydrateSession() {
            try {
                const resp = await fetch('/auth/session', { credentials: 'include' });
                const { session, user } = await resp.json();

                if (session) {
                    await supabase.auth.setSession(session);
                }

                console.log("CLIENT: hydrated user →", user?.email ?? "Unauthenticated");
            } catch (err) {
                console.error("CLIENT: session hydration failed", err);
            }
        }

        hydrateSession();
    </script>
</body>
</html>
`;
export default layout;
