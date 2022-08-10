// Posicion
var x = document.getElementById("demo");
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else { 
  x.innerHTML = "Geolocation is not supported by this browser.";
}
let latitud, longitud;
function showPosition(position) {
    latitud=position.coords.latitude;
    longitud=position.coords.longitude;
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude+"<br>";
  // Json
fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/")
.then((resp) => resp.json())
.then(function(data) {
    let gasolineras=data.ListaEESSPrecio;
    let gasolinerasProvincia=[];
    gasolineras.forEach(element => {
        let latitud2=element.Latitud.replace(",", ".");
        let longitud2=element["Longitud (WGS84)"].replace(",", ".");
        const gasolinera = {
          datos: element,
          km: Dist(latitud,longitud,latitud2,longitud2)
          };
          gasolinerasProvincia.push(gasolinera);
    });
    gasolinerasProvincia.sort((a, b) => {
        return a.km - b.km;
    });
    gasolinerasProvincia=gasolinerasProvincia.slice(0,10);
    console.log(gasolinerasProvincia);
    gasolinerasProvincia.forEach(element => {
        x.innerHTML+=`<div class="col">
        <div class="card">
          <a
            href=""
            class="btn btn-light btn-lg active"
            role="button"
            aria-pressed="true"
          >
            `+element.datos.Rótulo+` 
            <span class="badge text-bg-secondary">95: `+element.datos['Precio Gasolina 95 E5']+` L/€</span>
            <span class="badge text-bg-secondary">A: `+element.datos['Precio Gasoleo A']+` L/€</span>
            <span class="badge text-bg-warning">`+element.km+`KM</span>
          </a>
        </div>
      </div>`;
    });
})
.catch(function(error) {
  console.log(error);
});
}




// Calcular distancia
function Dist(lat1, lon1, lat2, lon2) {
    rad = function (x) {
        return x * Math.PI / 180;
    }

    var R = 6378.137;//Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(2);
}