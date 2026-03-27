const express = require('express');
const axios = require('axios');
const path = require('path'); // Added this to help Vercel find your folders
const app = express();

const port = process.env.PORT || 3001; 

// Tell Vercel EXACTLY where the views folder is located
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Notice we removed app.use(express.static('public')) so the old form doesn't hijack the home page!
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HOME PAGE ROUTE (Changed from /sunscreen to /)
// ==========================================
app.get('/', async (req, res) => {
    const lat = 19.2952;
    const lng = 72.8544;
    
    const apiKey = 'openuv-wl9orrmn798c1s-io'; 

    try {
        const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, {
            headers: {
                'x-access-token': apiKey 
            }
        });

        const uvIndex = response.data.result.uv;
        const needsSunscreen = uvIndex >= 3; 

        res.render('sunscreen', {
            name: "Pranet",
            location: "Mira Bhayandar",
            uvIndex: uvIndex.toFixed(2), 
            needsSunscreen: needsSunscreen
        });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send("Error retrieving UV data. Check terminal logs.");
    }
});

app.listen(port, () => {
    console.log(`Server is running! Visit http://localhost:${port}`);
});

// CRITICAL FOR VERCEL: Export the Express app
module.exports = app;
