function fleche(canvas,angle){ 
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var degrees = angle - 90;
    var centerX = 40;
    var centerY = 40;
    var arrowSize = 40;
    
    // conversion degrés/radian
    var radians = degrees * Math.PI / 180;
    
    // calcul de la position de la fin de la flèche
    var endX = centerX + arrowSize * Math.cos(radians);
    var endY = centerY + arrowSize * Math.sin(radians);
    
    // tracé de la flèche
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    
    // tête de la flèche
    var arrowheadSize = 15;
    var arrowheadAngle = Math.PI / 6;
    var arrowheadX = endX - arrowheadSize * Math.cos(radians + arrowheadAngle);
    var arrowheadY = endY - arrowheadSize * Math.sin(radians + arrowheadAngle);
    
    ctx.moveTo(endX, endY);
    ctx.lineTo(arrowheadX, arrowheadY);
    
    arrowheadX = endX - arrowheadSize * Math.cos(radians - arrowheadAngle);
    arrowheadY = endY - arrowheadSize * Math.sin(radians - arrowheadAngle);
    
    ctx.moveTo(endX, endY);
    ctx.lineTo(arrowheadX, arrowheadY);
    
    ctx.stroke();
}

// création d'objets date et conversion au format ISO

let datej0 = new Date();
let splitj0 = datej0.toISOString();
splitj0 = splitj0.split("T");
let j0 = splitj0[0];

let datej1 = new Date();
datej1.setDate(datej0.getDate() + 1);
let splitj1 = datej1.toISOString();
splitj1 = splitj1.split("T");
let j1 = splitj1[0];

let datej2 = new Date();
datej2.setDate(datej0.getDate() + 2)
let splitj2 = datej2.toISOString();
splitj2 = splitj2.split("T");
let j2 = splitj2[0];

let datej3 = new Date();
datej3.setDate(datej0.getDate() + 3)
let splitj3 = datej3.toISOString();
splitj3 = splitj3.split("T");
let j3 = splitj3[0];

// Afficher les dates dans le sélecteur

let jours = document.querySelectorAll(".jour");
jours[0].innerHTML = datej0.toLocaleDateString();
jours[1].innerHTML = datej1.toLocaleDateString();
jours[2].innerHTML = datej2.toLocaleDateString();
jours[3].innerHTML = datej3.toLocaleDateString();

// Update les graphes quand on change la date

let j = j0;
let selectjour = document.querySelector("#selectjour")
selectjour.addEventListener("change", function(){
    if(this.value == "j0"){
        j = j0;
        updateChart();
    }else if(this.value == "j1"){
        j = j1;
        updateChart();
    }else if(this.value == "j2"){
        j = j2;
        updateChart();
    }else if(this.value == "j3"){
        j = j3;
        updateChart();
    }
})

// Update les graphes quand on change la ville
// Valeurs de Saint-Lô par défaut
let lat = 49.12;
let long = -1.09;

let selectville = document.querySelector("#selectville")
selectville.addEventListener("change", function(){
    if(this.value == "v1"){
        lat = 49.12;
        long = -1.09;
        updateChart();
        updateCurrent();
    }else if(this.value == "v2"){
        lat = 49.15;
        long = 0.23;
        updateChart();
        updateCurrent();
    }else if(this.value == "v3"){
        lat = 49.02;
        long = 1.15;
        updateChart();
        updateCurrent();
    }
})

function updateChart(){
    
    // Requête via l'api

    async function fetchData(){
        const url = "https://api.open-meteo.com/v1/meteofrance?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin&start_date=" + j + "&end_date=" + j ;
        const response = await fetch(url);
        const data1 = await response.json();
        return data1;
    }
    
    // récupérer la réponse

    fetchData().then(data1 => {
        let tabHeure = [];
        let time = data1.hourly.time;
        time.forEach(function(element){
            let heure = element.split("T");
            tabHeure.push(heure[1]);
        });

        // Assigner les éléments du JSON aux données des tableaux chart.js

        const temp = data1.hourly.temperature_2m;
        const apparentTemp = data1.hourly.apparent_temperature;
        const prec = data1.hourly.precipitation;
        const hum = data1.hourly.relativehumidity_2m;
        const cLow = data1.hourly.cloudcover_low;
        const cMid = data1.hourly.cloudcover_mid;
        const cHigh = data1.hourly.cloudcover_high;
        const cloud = data1.hourly.cloudcover;
        
        graphTemp.config.data.labels = tabHeure;
        graphTemp.config.data.datasets[0].data = temp;
        graphTemp.config.data.datasets[1].data = apparentTemp;
        graphTemp.update();
        
        graphPrec.config.data.labels = tabHeure;
        graphPrec.config.data.datasets[0].data = prec;
        graphPrec.update();
        
        graphHum.config.data.labels = tabHeure;
        graphHum.config.data.datasets[0].data = hum;
        graphHum.update();

        // Prendre une heure sur deux
        
        tabHeure2 = tabHeure.filter(function(element, index) {
            return index % 2 !== 0;
        });
        cLow2 = cLow.filter(function(element, index) {
            return index % 2 !== 0;
        });
        cMid2 = cMid.filter(function(element, index) {
            return index % 2 !== 0;
        });
        cHigh2 = cHigh.filter(function(element, index) {
            return index % 2 !== 0;
        });
        cloud2 = cloud.filter(function(element, index) {
            return index % 2 !== 0;
        });
        
        graphCloud.config.data.labels = tabHeure2;
        graphCloud.config.data.datasets[0].data = cLow2;
        graphCloud.config.data.datasets[1].data = cMid2;
        graphCloud.config.data.datasets[2].data = cHigh2;
        graphCloud.config.data.datasets[3].data = cloud2;
        graphCloud.update();
        
        // Tracer les flèches
        
        var fleches = document.querySelectorAll(".fleches");
        fleche(fleches[0],data1.hourly.winddirection_10m[3]);            
        fleche(fleches[1],data1.hourly.winddirection_10m[7]);
        fleche(fleches[2],data1.hourly.winddirection_10m[11]);
        fleche(fleches[3],data1.hourly.winddirection_10m[15]);
        fleche(fleches[4],data1.hourly.winddirection_10m[19]);
        fleche(fleches[5],data1.hourly.winddirection_10m[23]);
        
        var vitesses = document.querySelectorAll(".vitesses");
        vitesses[0].innerHTML = data1.hourly.windspeed_10m[3] + " km/h";
        vitesses[1].innerHTML = data1.hourly.windspeed_10m[7] + " km/h";
        vitesses[2].innerHTML = data1.hourly.windspeed_10m[11] + " km/h";
        vitesses[3].innerHTML = data1.hourly.windspeed_10m[15] + " km/h";
        vitesses[4].innerHTML = data1.hourly.windspeed_10m[19] + " km/h";
        vitesses[5].innerHTML = data1.hourly.windspeed_10m[23] + " km/h";
    });
    
    async function fetchAirData(){
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=49.12&longitude=-1.09&hourly=pm10,pm2_5,carbon_monoxide,uv_index,uv_index_clear_sky&start_date=" + j + "&end_date=" + j + "&timezone=Europe%2FBerlin" ;
        const response = await fetch(url);
        const data2 = await response.json();
        return data2;
    }

    // Qualité de l'air
    
    fetchAirData().then(data2 => {
        let tabHeure = [];
        let time = data2.hourly.time;
        time.forEach(function(element){
            let heure = element.split("T");
            tabHeure.push(heure[1]);
        });
        const UV = data2.hourly.uv_index;
        const UVclair = data2.hourly.uv_index_clear_sky;
        const carbon = data2.hourly.carbon_monoxide;
        const pm10 = data2.hourly.pm10;
        const pm25 = data2.hourly.pm2_5;
        
        graphUV.config.data.labels = tabHeure;
        graphUV.config.data.datasets[0].data = UV;
        graphUV.config.data.datasets[1].data = UVclair;
        graphUV.update();
        
        graphCarbon.config.data.labels = tabHeure;
        graphCarbon.config.data.datasets[0].data = carbon;
        graphCarbon.update();
        
        graphPM.config.data.labels = tabHeure;
        graphPM.config.data.datasets[0].data = pm10;
        graphPM.config.data.datasets[1].data = pm25;
        graphPM.update();
        
    });
}

    // Météo courante

function updateCurrent(){
    

    async function fetchCurrentData(){
        const url = "https://api.open-meteo.com/v1/meteofrance?latitude=" + lat + "&longitude=" + long + "&hourly=precipitation,cloudcover&current_weather=true&timezone=Europe%2FBerlin";
        const response = await fetch(url);
        const data3 = await response.json();
        return data3;
    }
    
    fetchCurrentData().then(data3 => {

        const cloud = data3.hourly.cloudcover;
        const prec = data3.hourly.precipitation;
        const temp = data3.current_weather.temperature;
        const vitessevent = data3.current_weather.windspeed;
        const directionvent = data3.current_weather.winddirection;

        let currenttemp = document.querySelector("#currenttemp");
        currenttemp.innerHTML = temp + " °C";

        let currentfleche = document.querySelector("#currentfleche");
        fleche(currentfleche,directionvent);

        let currentvitesse = document.querySelector("#currentvitesse");
        currentvitesse.innerHTML = vitessevent + " km/h";

        let currentcloud = 0;
        let currentprec = 0;
        let nb = 0;
        let indexHeure = 0;
        let heures = data3.hourly.time;
        // Récupérer la date et l'heure au bon format
        let currentDate = data3.current_weather.time;
        
        let heurecheck = false;
        // Récupérer l'index de la date
        heures.forEach(function(element, index){
            if(element == currentDate){
                indexHeure = index;
                heurecheck = true;
            }
        })
        
        if(heurecheck == true){
            // Aller chercher les données qui correspondent à l'heure courante
            currentcloud = cloud[indexHeure];
            currentprec = prec[indexHeure];
        }else{
            // Afficher sur une moyenne si erreur
            cloud.forEach(function(element){
                currentcloud = currentcloud + element;
                nb++;
            })
            currentcloud = currentcloud / nb;
            nb = 0
            prec.forEach(function(element){
                currentprec = currentprec + element;
                nb++;
            })
            currentprec = currentprec / nb;
        }

        // Vérifier s'il fait jour

        let heure = datej0.getHours();
        let jour = true;
        if(heure >= 8 && heure < 18){
            jour = true;
        }else{
            jour = false;
        }

        // Modifier l'icône selon la météo courante
        
        let icone = document.querySelector("#icone");
        icone.className = "fa-solid fa-6x";
        if(jour == true){
            if(currentcloud >= 75){
                if(currentprec >= 0.5){
                    icone.classList.add("fa-cloud-showers-heavy")
                }else{
                    icone.classList.add("fa-cloud")
                }
            }else if(currentcloud < 75 && currentcloud >= 50){
                if(currentprec >= 0.5){
                    icone.classList.add("fa-cloud-sun-rain")
                }else{
                    icone.classList.add("fa-cloud-sun")
                }
            }else{
                icone.classList.add("fa-sun")
            }
        }else{
            if(currentcloud >= 75){
                if(currentprec >= 0.5){
                    icone.classList.add("fa-cloud-showers-heavy")
                }else{
                    icone.classList.add("fa-cloud")
                }
            }else if(currentcloud < 75 && currentcloud >= 50){
                if(currentprec >= 0.5){
                    icone.classList.add("fa-cloud-moon-rain")
                }else{
                    icone.classList.add("fa-cloud-moon")
                }
            }else{
                icone.classList.add("fa-moon")
            }
        }

    });
}

// Données des graphiques

const dataTemp = {
    labels: [],
    datasets: [{
        label: 'Température (en °C)',
        data: [],
        fill: false,
        backgroundColor: 'RGB(252, 108, 108)',
        borderColor: 'RGB(252, 108, 108)',
        tension: 0.1
    },{
        label: 'Température apparente (en °C)',
        data: [],
        fill: false,
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        tension: 0.1
    }]
};

const dataPrec = {
    labels: [],
    datasets: [{
        label: 'Précipitations (en mm)',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        borderWidth: 1
    }]
};

const dataHum = {
    labels: [],
    datasets: [{
        label: 'Humidité (en %)',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        borderWidth: 1
    }]
};

const dataCloud = {
    labels: [],
    datasets: [{
        label: 'Couverture nuageuse basse (en %)',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        borderWidth: 1
    },{
        label: 'Couverture nuageuse moyenne (en %)',
        data: [],
        backgroundColor: 'RGB(252, 108, 108)',
        borderColor: 'RGB(252, 108, 108)',
        borderWidth: 1
    },{
        label: 'Couverture nuageuse haute (en %)',
        data: [],
        backgroundColor: 'RGB(28, 33, 53)',
        borderColor: 'RGB(28, 33, 53)',
        borderWidth: 1
    },{
        label: 'Couverture nuageuse totale (en %)',
        data: [],
        backgroundColor: 'RGB(216, 205, 177)',
        borderColor: 'RGB(216, 205, 177)',
        borderWidth: 1
    }]
};

const dataUV = {
    labels: [],
    datasets: [{
        label: 'Indice UV',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        borderWidth: 1
    },{
        label: 'Indice UV temps clair',
        data: [],
        backgroundColor: 'RGB(252, 108, 108)',
        borderColor: 'RGB(252, 108, 108)',
        borderWidth: 1
    }]
};

const dataCarbon = {
    labels: [],
    datasets: [{
        label: 'Monoxyde de Carbone (en μg/m³)',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        tension: 0.1
    }]
};

const dataPM = {
    labels: [],
    datasets: [{
        label: 'Particules PM10 (en μg/m³)',
        data: [],
        backgroundColor: 'RGB(118, 187, 228)',
        borderColor: 'RGB(118, 187, 228)',
        borderWidth: 1
    },{
        label: 'Particules PM2.5 (en μg/m³)',
        data: [],
        backgroundColor: 'RGB(252, 108, 108)',
        borderColor: 'RGB(252, 108, 108)',
        borderWidth: 1
    }]
};



// configuration des graphes

const configTemp = {
    type: 'line',
    data: dataTemp,
};

const configPrec = {
    type: 'bar',
    data: dataPrec,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
}

const configHum = {
    type: 'bar',
    data: dataHum,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
}

const configCloud = {
    type: 'bar',
    data: dataCloud,
    options: {
        interaction: {
            mode: 'index'
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

const configUV = {
    type: 'bar',
    data: dataUV,
    options: {
        interaction: {
            mode: 'index'
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

const configCarbon = {
    type: 'line',
    data: dataCarbon,
};

const configPM = {
    type: 'bar',
    data: dataPM,
    options: {
        interaction: {
            mode: 'index'
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

// création des graphes

const graphTemp = new Chart(
    document.getElementById('temp'),
    configTemp
);
const graphPrec = new Chart(
    document.getElementById('prec'),
    configPrec
    );
const graphHum = new Chart(
    document.getElementById('hum'),
    configHum
);
const graphCloud = new Chart(
    document.getElementById('cloud'),
    configCloud
);
const graphUV = new Chart(
    document.getElementById('UV'),
    configUV
);
const graphCarbon = new Chart(
    document.getElementById('carbon'),
    configCarbon
);
const graphPM = new Chart(
    document.getElementById('pm'),
    configPM
);
                        
updateChart();
updateCurrent();
                            
