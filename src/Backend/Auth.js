// This module is for receiving an access token from Devii

import axios from 'axios';

const AUTH_URL = 'https://api.devii.io/auth';

// Function to retrieve access token for the application
async function getAccessToken() {
    // Create an object to store the form data with your Devii credentials
    const data = {
        login: 'ujjwal@kirkwall.io',
        password: 'Ujjwal2003!',
        tenantid: 10132,
    };

    try {
        // Make the POST request to the Devii authentication endpoint with the provided data
        const response = await axios.post(AUTH_URL, data);

        // Check for a successful response
        if (response.status === 200) {
            // Extract the access token
            const accessToken = response.data.access_token;
            if (accessToken) {
                // Uncomment the line below if you would like to test the retrieval of the access token
                // console.log("This is your access token:", accessToken);
                return accessToken;
            } else {
                console.error("Access token not found in the response.");
                return null;
            }
        } else {
            // If the response status is not 200, it prints an error message along with the status code and the response text
            throw new Error(`Error: ${response.status}\n${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}


// const accessToken = getAccessToken();



// Function to set up authorization headers
async function setupAuthHeaders() {
    const accessToken = await getAccessToken(); // You need to fetch the access token within this function
    if (accessToken) {
        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };
        // console.log(headers.Authorization)
        return headers;
    } else {
        console.error("Failed to retrieve access token for headers setup.");
        return null;
    }
}

export { getAccessToken, setupAuthHeaders };