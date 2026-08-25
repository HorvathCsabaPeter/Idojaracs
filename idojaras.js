async function getIdojaras(lat, lon, varosNev) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
    
    const valasz = await fetch(url);
    const adat = await valasz.json();

    // Kiírjuk a város nevét és a hőmérsékletet
    document.getElementById('cityName').innerText = varosNev;
    document.getElementById('temperature').innerText = Math.round(adat.current_weather.temperature);
    document.getElementById('windSpeed').innerText = adat.current_weather.windspeed;
    
    // A legfrissebb páratartalom kiolvasása
    const paratartalom = adat.hourly.relativehumidity_2m[0];
    document.getElementById('humidity').innerText = paratartalom;
}

