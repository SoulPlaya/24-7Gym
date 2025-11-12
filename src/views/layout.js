const layout = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - PowerFit Gym</title>
    <link rel="stylesheet" href="/css/styles.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/classes">Classes</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
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
</body>
</html>
`;

export default layout;