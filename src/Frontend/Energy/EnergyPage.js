import React, { useState } from "react";
import axios from "axios";

const EnergyPage = () => {
  const [zipCode, setZipCode] = useState("");
  const [energyRates, setEnergyRates] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch energy rates from OpenEI API based on zip code
  const fetchEnergyRates = async () => {
    setError(null); // Reset error
    setEnergyRates(null); // Reset rates
    try {
      const response = await axios.get("https://api.openei.org/utility_rates", {
        params: {
          version: "latest", // Latest version of the API
          format: "json", // Response format
          api_key: "YOUR_API_KEY", // Replace with your OpenEI API key
          address: zipCode, // Address parameter to find rates by zip code
          limit: 1, // Limit results (adjust as needed)
          detail: "full", // Fetch detailed information
        },
      });

      const data = response.data.items[0]; // Assume we get the first item
      const rates = {
        electricity: getRateByType(data, "Energy"), // Get electricity rate
        naturalGas: getRateByType(data, "Natural Gas"), // Get natural gas rate
        liquidPropane: getRateByType(data, "Liquid Propane"), // Get liquid propane rate
        gasPropane: getRateByType(data, "Propane"), // Get gas propane rate
      };

      setEnergyRates(rates);
    } catch (error) {
      setError("Failed to fetch energy rates. Please check the zip code or try again later.");
      console.error("Error fetching energy rates:", error);
    }
  };

  // Helper function to extract specific rate by type
  const getRateByType = (data, type) => {
    if (!data || !data.energyratestructure) return "N/A";
    for (let i = 0; i < data.energyratestructure.length; i++) {
      const period = data.energyratestructure[i];
      for (let j = 0; j < period.length; j++) {
        if (period[j].unit === type) {
          return period[j].rate;
        }
      }
    }
    return "N/A"; // Return "N/A" if not found
  };

  // Handle user input for zip code
  const handleZipCodeChange = (e) => setZipCode(e.target.value);

  return (
    <div>
      <h1>Energy Rates Calculator</h1>

      {/* Input for Zip Code */}
      <label>
        Enter your zip code:
        <input type="text" value={zipCode} onChange={handleZipCodeChange} />
        <button onClick={fetchEnergyRates}>Get Energy Rates</button>
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display energy rates if available */}
      {energyRates && (
        <div>
          <h2>Rates for Zip Code: {zipCode}</h2>
          <p>Electricity: ${energyRates.electricity} per kWh</p>
          <p>Natural Gas: ${energyRates.naturalGas} per therm</p>
          <p>Liquid Propane: ${energyRates.liquidPropane} per gallon</p>
          <p>Gas Propane: ${energyRates.gasPropane} per gallon</p>
        </div>
      )}
    </div>
  );
};

export default EnergyPage;
