from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
from math import radians, sin, cos, sqrt, atan2
import os
import hashlib

base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(base_dir, 'data', 'xgboost_flight_cancellation_model.pkl')
AIRPORTS_PATH = os.path.join(base_dir, 'data', 'coordinates.csv')

app = Flask(__name__)

# NOT: Bu aralıklar, tahmin modelinin eğitildiği verilere göre ayarlanmalı
FEATURE_RANGES = {
    'temperature_2m_archive_best_match (K)': {'min': 235.9, 'max': 320.0},
    'apparent_temperature_archive_best_match (K)': {'min': 229.8, 'max': 318.7},
    'dew_point_2m_archive_best_match (K)': {'min': 232.7, 'max': 300.5},
    'apparent_temperature_ecmwf_ifs (K)': {'min': 229.8, 'max': 318.7},
    'surface_pressure_archive_best_match (hPa)': {'min': 727.4, 'max': 1038.5},
    'surface_pressure_ecmwf_ifs (hPa)': {'min': 727.4, 'max': 1038.5},
    'surface_pressure_change': {'min': -0.990, 'max': 0.995},
    'wind_gusts_10m_archive_best_match (km/h)': {'min': 1.1, 'max': 135.7},
    'wind_direction_10m_archive_best_match (°)': {'min': 1.0, 'max': 360.0},
    'total_column_integrated_water_vapour_archive_best_match (kg/m²)': {'min': 0.6, 'max': 70.7},
    'CRSElapsedTime': {'min': -48.0, 'max': 435.0},
    'Distance': {'min': 31.0, 'max': 3043.0}
}

FEATURES = [
    'DayofMonth_sin', 'DayofMonth_cos', 'Month_3', 'CRSElapsedTime',
    'apparent_temperature_archive_best_match (K)', 'Distance', 'DayOfWeek_2',
    'ArrHour_cos', 'total_column_integrated_water_vapour_archive_best_match (kg/m²)',
    'Month_2', 'DayOfWeek_3', 'surface_pressure_archive_best_match (hPa)',
    'Month_5', 'Month_7', 'Quarter_2', 'Month_4', 'surface_pressure_change',
    'Month_6', 'surface_pressure_ecmwf_ifs (hPa)', 'DepHour_sin',
    'temperature_2m_archive_best_match (K)', 'dew_point_2m_archive_best_match (K)',
    'apparent_temperature_ecmwf_ifs (K)', 'wind_gusts_10m_archive_best_match (km/h)',
    'wind_direction_10m_archive_best_match (°)'
]

try:
    model = joblib.load(MODEL_PATH)
    airports_df = pd.read_csv(AIRPORTS_PATH)
    print(" Model ve havaalanı veri seti başarıyla yüklendi!")
except Exception as e:
    print(f" Model veya havaalanı veri seti yüklenemedi: {e}")
    model = None
    airports_df = None

# SORGULAMA LİMİTİ İÇİN YENİ EKLENEN KISIM
# GÜNLÜK LİMİTİ 10'DAN 50'YE ÇIKARTTIK
DAILY_LIMIT = 50
query_limits = {}

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 3959.0
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def get_airport_coordinates(airport_code):
    if airports_df is None:
        raise Exception("Havaalanları veri seti yüklü değil!")
    
    airport_data = airports_df[airports_df['code'] == airport_code.upper()]
    
    if airport_data.empty:
        raise Exception(f"'{airport_code}' havaalanı kodu veri setinde bulunamadı!")
        
    return airport_data.iloc[0]['latitude'], airport_data.iloc[0]['longitude']

def calculate_flight_distance(dep_airport, arr_airport):
    try:
        dep_lat, dep_lon = get_airport_coordinates(dep_airport)
        arr_lat, arr_lon = get_airport_coordinates(arr_airport)
        distance = calculate_distance(dep_lat, dep_lon, arr_lat, arr_lon)
        return distance
    except Exception as e:
        raise Exception(f"Mesafe hesaplanamadı: {str(e)}")

def validate_input(dep_datetime, arr_datetime, dep_airport, arr_airport):
    try:
        dep_date_obj = datetime.fromisoformat(dep_datetime.replace('Z', ''))
        arr_date_obj = datetime.fromisoformat(arr_datetime.replace('Z', ''))
    except ValueError:
        return False, "Tarih veya saat biçimi hatalı!"
    
    now = datetime.now()
    max_future_date = now + timedelta(days=14)
    max_past_date = now - timedelta(days=290)
    
    if not (max_past_date <= dep_date_obj <= max_future_date):
        return False, f"Tarih, tahmin edilebilen aralığın dışında! {max_past_date.strftime('%Y-%m-%d')} ile {max_future_date.strftime('%Y-%m-%d')} arasında olmalı"
    
    if arr_date_obj < dep_date_obj:
        return False, "Varış tarihi kalkış tarihinden önce olamaz!"

    flight_duration = (arr_date_obj - dep_date_obj).total_seconds() / 3600
    if flight_duration > 24 or flight_duration < 0.5:
        return False, "Uçuş süresi 30 dakika ile 24 saat arasında olmalı!"
    
    if not (isinstance(dep_airport, str) and len(dep_airport.strip()) == 3 and isinstance(arr_airport, str) and len(arr_airport.strip()) == 3):
        return False, "Havaalanı kodu 3 harfli olmalı!"
    
    if dep_airport.upper() == arr_airport.upper():
        return False, "Kalkış ve varış havaalanları aynı olamaz!"
    
    return True, "Giriş verileri geçerli"

def normalize_feature(value, feature_name):
    if feature_name not in FEATURE_RANGES:
        return value
    min_val = FEATURE_RANGES[feature_name]['min']
    max_val = FEATURE_RANGES[feature_name]['max']
    if max_val - min_val == 0:
        return 0.0
    normalized = (value - min_val) / (max_val - min_val)
    return np.clip(normalized, 0, 1)

def generate_deterministic_weather_data(input_string, feature_name):
    """Girdi stringine göre tutarlı (deterministik) bir değer üretir."""
    hash_object = hashlib.sha256(input_string.encode())
    seed_value = int(hash_object.hexdigest(), 16) % (2**32 - 1)
    
    np.random.seed(seed_value)
    
    feature_range = FEATURE_RANGES.get(feature_name)
    if feature_range:
        return np.random.uniform(feature_range['min'], feature_range['max'])
    return 0.0

def generate_features(input_data):
    try:
        df = pd.DataFrame([input_data])
        date = pd.to_datetime(f"{input_data['year']}-{input_data['month']}-{input_data['day']}")
        df['DayofMonth'] = input_data['day']
        df['Month'] = input_data['month']
        df['DayOfWeek'] = date.dayofweek
        df['DepHour'] = input_data['dep_hour'] + input_data['dep_minute'] / 60
        df['ArrHour'] = input_data['arr_hour'] + input_data['arr_minute'] / 60
        
        dep_time = datetime(2025, 1, 1, input_data['dep_hour'], input_data['dep_minute'])
        arr_time = datetime(2025, 1, 1, input_data['arr_hour'], input_data['arr_minute'])
        if arr_time < dep_time:
            arr_time += timedelta(days=1)
        elapsed_minutes = (arr_time - dep_time).total_seconds() / 60
        
        df['CRSElapsedTime'] = normalize_feature(elapsed_minutes, 'CRSElapsedTime')
        df['Distance'] = normalize_feature(input_data['Distance'], 'Distance')
        
        df['DayofMonth_sin'] = np.sin(2 * np.pi * df['DayofMonth'] / 31)
        df['DayofMonth_cos'] = np.cos(2 * np.pi * df['DayofMonth'] / 31)
        df['DepHour_sin'] = np.sin(2 * np.pi * df['DepHour'] / 24)
        df['ArrHour_cos'] = np.cos(2 * np.pi * df['ArrHour'] / 24)
        
        for month in [2, 3, 4, 5, 6, 7]:
            df[f'Month_{month}'] = (df['Month'] == month).astype(int)
        df['Quarter_2'] = df['Month'].isin([4, 5, 6]).astype(int)
        df['DayOfWeek_2'] = (df['DayOfWeek'] == 1).astype(int)
        df['DayOfWeek_3'] = (df['DayOfWeek'] == 2).astype(int)
        
        for feature in FEATURES:
            if feature not in df.columns:
                raw_value = input_data.get(feature, 0.0)
                df[feature] = normalize_feature(raw_value, feature)
        
        return df[FEATURES]
    except Exception as e:
        raise Exception(f"Özellik üretiminde hata: {str(e)}")

@app.route("/")
def tahmin_yap():
    return render_template("index.html")

@app.route("/anasayfa.html")
def anasayfa():
    return render_template("anasayfa.html")

@app.route("/model.html")
def model_sayfasi():
    return render_template("model.html")

@app.route("/veltrixai.html")
def veltrix_ai_sayfasi():
    return render_template("veltrixai.html")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None or airports_df is None:
        return jsonify({"success": False, "message": "Model veya veri seti sunucuda yüklenemedi. Lütfen daha sonra tekrar deneyin."}), 500

    # RATE LİMİT KONTROLÜ
    ip_address = request.remote_addr
    today = datetime.now().date()
    
    if ip_address in query_limits:
        # Eğer sorgu bugünden önce yapıldıysa, sayacı sıfırla
        if query_limits[ip_address]['date'] != today:
            query_limits[ip_address] = {'count': 0, 'date': today}
        
    if ip_address in query_limits and query_limits[ip_address]['count'] >= DAILY_LIMIT:
        return jsonify({"success": False, "message": "Günlük sorgu limitinize ulaştınız. Lütfen yarın tekrar deneyin."}), 429
    
    try:
        data = request.json
        dep_airport_code = data.get("from")
        arr_airport_code = data.get("to")
        
        dep_datetime_str = data.get("departure_datetime")
        arr_datetime_str = data.get("arrival_datetime")
        
        is_valid, message = validate_input(
            dep_datetime_str, arr_datetime_str, dep_airport_code, arr_airport_code
        )
        if not is_valid:
            # Hatalı aramalar limiti tüketmeyeceği için burada direkt dönüyoruz
            return jsonify({"success": False, "message": message})
        
        dep_date_obj = datetime.fromisoformat(dep_datetime_str.replace('Z', ''))
        arr_date_obj = datetime.fromisoformat(arr_datetime_str.replace('Z', ''))
        
        distance_miles = calculate_flight_distance(dep_airport_code, arr_airport_code)
        flight_duration_minutes = (arr_date_obj - dep_date_obj).total_seconds() / 60

        # Hava durumu verilerini uçuş mesafesi ve tarih/saat ile dinamik hale getirme
        # Bu, aynı girdiler için her zaman aynı değerleri üretecektir.
        input_string = f"{dep_airport_code}{arr_airport_code}{dep_datetime_str}{arr_datetime_str}"
        
        input_data = {
            'year': dep_date_obj.year, 'month': dep_date_obj.month, 'day': dep_date_obj.day,
            'dep_hour': dep_date_obj.hour, 'dep_minute': dep_date_obj.minute,
            'arr_hour': arr_date_obj.hour, 'arr_minute': arr_date_obj.minute,
            'Distance': distance_miles,
            'CRSElapsedTime': flight_duration_minutes,
            # Her bir özellik için deterministik değerler üretin
            'temperature_2m_archive_best_match (K)': generate_deterministic_weather_data(input_string, 'temperature_2m_archive_best_match (K)'),
            'apparent_temperature_archive_best_match (K)': generate_deterministic_weather_data(input_string, 'apparent_temperature_archive_best_match (K)'),
            'dew_point_2m_archive_best_match (K)': generate_deterministic_weather_data(input_string, 'dew_point_2m_archive_best_match (K)'),
            'apparent_temperature_ecmwf_ifs (K)': generate_deterministic_weather_data(input_string, 'apparent_temperature_ecmwf_ifs (K)'),
            'surface_pressure_archive_best_match (hPa)': generate_deterministic_weather_data(input_string, 'surface_pressure_archive_best_match (hPa)'),
            'surface_pressure_ecmwf_ifs (hPa)': generate_deterministic_weather_data(input_string, 'surface_pressure_ecmwf_ifs (hPa)'),
            'surface_pressure_change': generate_deterministic_weather_data(input_string, 'surface_pressure_change'),
            'wind_gusts_10m_archive_best_match (km/h)': generate_deterministic_weather_data(input_string, 'wind_gusts_10m_archive_best_match (km/h)'),
            'wind_direction_10m_archive_best_match (°)': generate_deterministic_weather_data(input_string, 'wind_direction_10m_archive_best_match (°)')
        }
        
        features_df = generate_features(input_data)
        
        proba = model.predict_proba(features_df)[0, 1]
        
        risk_percentage = proba * 100

        details = {
            "temperature": f"{round(input_data['temperature_2m_archive_best_match (K)'] - 273.15, 2)} °C",
            "pressure": f"{round(input_data['surface_pressure_archive_best_match (hPa)'], 2)} hPa",
            "wind_gusts": f"{round(input_data['wind_gusts_10m_archive_best_match (km/h)'], 2)} km/h",
            "wind_direction": f"{round(input_data['wind_direction_10m_archive_best_match (°)'], 2)}°",
            "flight_duration": f"{round(flight_duration_minutes / 60, 2)} saat",
            "flight_distance": f"{round(distance_miles, 2)} mil"
        }
        
        # Sadece başarılı tahminler için limiti artır
        if ip_address not in query_limits:
            query_limits[ip_address] = {'count': 1, 'date': today}
        else:
            query_limits[ip_address]['count'] += 1

        return jsonify({
            "success": True,
            "risk_score": float(risk_percentage),
            "details": details
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Tahmin yapılırken beklenmedik bir hata oluştu: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)