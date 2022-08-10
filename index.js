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
      if(element.Provincia == "ARABA/ÁLAVA"){
        const gasolinera = {
          datos: element,
          km: Dist(latitud,longitud,parseInt(element.Latitud),parseInt(element["Longitud (WGS84)"]))
          };
          gasolinerasProvincia.push(gasolinera);
      }
        
          
    });
    gasolinerasProvincia.sort((a, b) => {
        return a.km - b.km;
    });
    console.log(gasolinerasProvincia);
    gasolinerasProvincia.forEach(element => {
        x.innerHTML+=element.km+" "+element.datos["C.P."]+" "+element.datos.Rótulo+" "+element.datos.Localidad+"<br>";
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
    return d.toFixed(3);//Retorna tres decimales
}