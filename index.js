const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.set('view engine', 'ejs');

// 1. Middleware to serve static files from the 'public' folder
// When you visit http://localhost:3000, Express will automatically load public/index.html
app.use(express.static('public'));

// 2. Middleware to parse URL-encoded form data (Requirement 1)
// The 'extended: true' option allows for parsing complex objects, which is standard practice.
app.use(express.urlencoded({ extended: true }));


// 3. Route to handle the form submission
app.post('/submit', (req, res) => {
    // Extract the data from req.body (Requirement 2)
    // The variable names match the 'name' attributes from your HTML form inputs
    const studentName = req.body.studentName;
    const branch = req.body.branch;
    const year = req.body.year;

    // Display the submitted information on the webpage (Requirement 3)
    res.send(`
        <h2>Form Submitted Successfully</h2>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Branch:</strong> ${branch}</p>
        <p><strong>Year:</strong> ${year}</p>
        <br>
        <a href="/">Go back to form</a>
    `);
});

// Route to render the dynamic EJS profile
app.get('/profile', (req, res) => {
    // res.render takes two arguments: 
    // 1. The name of the EJS file (without the extension)
    // 2. An object containing the data you want to inject
    res.render('profile', {
        name: "Pranet",
        branch: "Computer Engineering",
        year: "SE"
    });
});

app.get('/sunscreen', async (req, res) => {

    console.log("The sunscreen route was triggered!");

    // Exact coordinates for Mira 
    const lat = 19.2952;
    const lng = 72.8544;
    
    // PASTE YOUR OPENUV API KEY HERE
    const apiKey = 'openuv-wl9orrmn798c1s-io'; 

    try {
        // 1. Make the API request using Axios
        const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`, {
            headers: {
                'x-access-token': apiKey // OpenUV requires the key in the headers
            }
        });

        // 2. Extract the UV index from the API response
        const uvIndex = response.data.result.uv;
        
        // 3. Logic: UV Index >= 3 requires sunscreen
        const needsSunscreen = uvIndex >= 3; 

        // 4. Render the page with the retrieved data
        res.render('sunscreen', {
            name: "Pranet",
            location: "Mira Bhayandar",
            uvIndex: uvIndex.toFixed(2), // Rounds to 2 decimal places
            needsSunscreen: needsSunscreen
        });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send("Error retrieving UV data. Check your API key or terminal logs.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});