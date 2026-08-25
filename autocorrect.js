const keresoMezo = document.getElementById('cityInput');
const listaDoboz = document.getElementById('suggestions');

// 1. Gépelés figyelése
keresoMezo.addEventListener('input', async () => {
    const beirtSzoveg = keresoMezo.value; 

    if (beirtSzoveg.length < 2) {
        listaDoboz.innerHTML = ''; // Ha letörli a szöveget, eltüntetjük a listát
        return; 
    }

    keresVarosokat(beirtSzoveg);
});

// 2. Városok keresése az API-ban
async function keresVarosokat(szo) {
    const cim = `https://geocoding-api.open-meteo.com/v1/search?name=${szo}&count=5&language=hu`;
    const valasz = await fetch(cim);
    const adat = await valasz.json();

    listaKirajzolasa(adat.results);
}

// 3. A találati lista megjelenítése
function listaKirajzolasa(varosok) {
    listaDoboz.innerHTML = ''; 

    if (!varosok) return; 

    varosok.forEach(varos => {
        const sor = document.createElement('div');
        sor.classList.add('suggestion-item'); // CSS formázáshoz
        sor.innerText = `${varos.name}${varos.country ? ', ' + varos.country : ''}`; 

        // Kattintás egy városra
        sor.addEventListener('click', () => {
            keresoMezo.value = varos.name; 
            listaDoboz.innerHTML = ''; // Lista eltüntetése
            
            // Itt hívjuk meg az időjárást a város koordinátáival!
            getIdojaras(varos.latitude, varos.longitude, varos.name);
        });

        listaDoboz.appendChild(sor);
    });
}

// 4. Időjárás lekérése és kiírása
async function getIdojaras(lat, lon, varosNev) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
    
    const valasz = await fetch(url);
    const adat = await valasz.json();

    // Adatok kiírása a HTML elemekbe
    if (document.getElementById('cityName')) {
        document.getElementById('cityName').innerText = varosNev;
    }
    if (document.getElementById('temperature')) {
        document.getElementById('temperature').innerText = Math.round(adat.current_weather.temperature);
    }
    if (document.getElementById('windSpeed')) {
        document.getElementById('windSpeed').innerText = adat.current_weather.windspeed;
    }
    if (document.getElementById('humidity')) {
        document.getElementById('humidity').innerText = adat.hourly.relativehumidity_2m[0];
    }
}