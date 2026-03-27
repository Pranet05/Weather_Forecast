const express = require('express');
const axios = require('axios');
const app = express();

// Using 3001 to avoid any 'zombie server' issues from earlier!
const port = 3001; 

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware for static files and form parsing
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// OpenUV API Route (Roll No 44 Task)
// ==========================================
app.get('/sunscreen', async (req, res) => {
    // Coordinates for Mira Bhayandar
    const lat = 19.2952;
    const lng = 72.8544;
    
    // Replace this string with your actual OpenUV API Key if it changes
    const apiKey = 'openuv-wl9orrmn798c1s-io'; 

    try {
        console.log("Fetching UV data from OpenUV API...");
        
        // Make the GET request to OpenUV using Axios
        const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, {
            headers: {
                'x-access-token': apiKey 
            }
        });

        // Extract the UV index from the response data
        const uvIndex = response.data.result.uv;
        
        // WHO guideline: UV Index of 3 or higher means sunscreen is needed
        const needsSunscreen = uvIndex >= 3; 

        // Render the sunscreen.ejs file and pass the data to it
        res.render('sunscreen', {
            name: "Pranet",
            location: "Mira Bhayandar",
            uvIndex: uvIndex.toFixed(2), 
            needsSunscreen: needsSunscreen
        });

    } catch (error) {
        console.error("Error fetching data from API:", error.message);
        res.status(500).send("Error retrieving UV data. Check your terminal for details.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Sunscreen app is running! Visit http://localhost:${port}/sunscreen`);
});
