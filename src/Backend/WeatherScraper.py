from flask import Flask, jsonify, send_from_directory
import requests
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderServiceError, GeocoderTimedOut
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)  # Enable CORS for all routes

@app.route('/weather-alerts/<zipcode>', methods=['GET'])
def get_weather_alerts(zipcode):
    geolocater = Nominatim(user_agent='my-weather')
    try:
        location = geolocater.geocode({'postalcode': zipcode, 'country': 'US'})
    except (GeocoderServiceError, GeocoderTimedOut) as e:
        return jsonify({"error": "Geocoding service error or timeout"}), 500

    if not location:
        return jsonify({"error": "Location not found"}), 404

    latitude = location.latitude
    longitude = location.longitude
    url = f"https://forecast.weather.gov/MapClick.php?lat={latitude}&lon={longitude}"
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve weather data"}), 500
    
    soup = BeautifulSoup(response.text, 'html.parser')

    conditions = soup.find("h3", attrs={"class": "panel-title"})
    conditions_text = conditions.text if conditions else "No weather conditions found."

    alerts = soup.find_all("a", attrs={"class": "anchor-hazards"})
    alerts_text = [alert.text for alert in alerts] if alerts else ["No weather alerts found."]

    return jsonify({
        "conditions": conditions_text,
        "alerts": alerts_text
    })

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
