// Posicion
var x = document.getElementById("demo");
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  x.innerHTML = "Geolocation is not supported by this browser.";
}
let latitud,
  longitud,
  gasolinerasProvincia = []
  todasGasolinerasProvincia = [];
function showPosition(position) {
  latitud = position.coords.latitude;
  longitud = position.coords.longitude;
  // Json
  fetch(
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
  )
    .then((resp) => resp.json())
    .then(function (data) {
      let gasolineras = data.ListaEESSPrecio;
      gasolinerasProvincia = [];
      gasolineras.forEach((element) => {
        let latitud2 = element.Latitud.replace(",", ".");
        let longitud2 = element["Longitud (WGS84)"].replace(",", ".");
        const gasolinera = {
          datos: element,
          km: Dist(latitud, longitud, latitud2, longitud2),
        };
        todasGasolinerasProvincia.push(gasolinera);
      });
      todasGasolinerasProvincia.sort((a, b) => {
        return a.km - b.km;
      });

      gasolinerasProvincia = todasGasolinerasProvincia.slice(0, 50);
      dibujar(gasolinerasProvincia);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function gasolina() {
  gasolinerasProvincia.sort((a, b) => {
    if(a.datos["Precio Gasolina 95 E5"]==""){
      a.datos["Precio Gasolina 95 E5"]="N/A";
    }
    if(b.datos["Precio Gasolina 95 E5"]==""){
      b.datos["Precio Gasolina 95 E5"]="N/A";
    }
    if ( a.datos["Precio Gasolina 95 E5"] < b.datos["Precio Gasolina 95 E5"] ){
      return -1;
    }
    if ( a.datos["Precio Gasolina 95 E5"] > b.datos["Precio Gasolina 95 E5"] ){
      return 1;
    }
    return 0;
  });
  dibujar(gasolinerasProvincia);
  let gasolinas = document.getElementsByClassName("gasolina");
  let diesels = document.getElementsByClassName("diesel");
  for (const iterator of gasolinas) {
    iterator.style.display = "inline";
  }
  for (const iterator of diesels) {
    iterator.style.display = "none";
  }
  gasolinerasProvincia.sort((a, b) => {
    return a.datos["Precio Gasolina 95 E5"] - b.datos["Precio Gasolina 95 E5"];
  });
}

function cantidad(cant) {
  gasolinerasProvincia = todasGasolinerasProvincia.slice(0, cant);
  if(document.getElementsByClassName("gasolina")[0].style.display == "inline"){
    gasolina();
  } else if(document.getElementsByClassName("diesel")[0].style.display == "inline"){
    diesel();
  } else {
    dibujar(gasolinerasProvincia);
  }

}

function diesel() {
  gasolinerasProvincia.sort((a, b) => {
    if(a.datos["Precio Gasoleo A"]==""){
      a.datos["Precio Gasoleo A"]="N/A";
    }
    if(b.datos["Precio Gasoleo A"]==""){
      b.datos["Precio Gasoleo A"]="N/A";
    }
    if ( a.datos["Precio Gasoleo A"] < b.datos["Precio Gasoleo A"] ){
      return -1;
    }
    if ( a.datos["Precio Gasoleo A"] > b.datos["Precio Gasoleo A"] ){
      return 1;
    }
    return 0;
  });
  dibujar(gasolinerasProvincia);
  let gasolinas = document.getElementsByClassName("gasolina");
  let diesels = document.getElementsByClassName("diesel");
  for (const iterator of diesels) {
    iterator.style.display = "inline";
  }
  for (const iterator of gasolinas) {
    iterator.style.display = "none";
  }
  gasolinerasProvincia.sort((a, b) => {
    return a.datos["Precio Gasoleo A"] - b.datos["Precio Gasoleo A"];
  });
  console.log(gasolinerasProvincia);
}

//Dibujado
function dibujar(gasolinerasProvincia) {
  x.innerHTML = "";
  gasolinerasProvincia.forEach((element) => {
    let apertura="";
    let fondo="";
    if(element.datos['Tipo Venta']=='P'){
      apertura="Publica";
      fondo="bg-success";
    } else{
      apertura="Privada";
      fondo="bg-warning";
    }
    x.innerHTML +=
      `<div class="col">
  <div class="card `+ fondo +`">
    <a
      href="https://maps.google.com/?q=` +
      element.datos.Latitud.replace(",", ".") +
      `,` +
      element.datos["Longitud (WGS84)"].replace(",", ".") +
      `"
      class="btn btn-light btn-lg active"
      role="button"
      aria-pressed="true"
    >
      ` +
      element.datos.Rótulo +
      ` 
      <span class="badge text-bg-secondary gasolina" style="display:none">95: ` +
      element.datos["Precio Gasolina 95 E5"] +
      ` L/€</span>
      <span class="badge text-bg-secondary diesel" style="display:none">A: ` +
      element.datos["Precio Gasoleo A"] +
      ` L/€</span>
      <span class="badge text-bg-warning">` +
      element.km +
      `KM</span>
    </a>` +
    element.datos.Horario
     +
    `
  </div>
</div>`;
  });
}

// Calcular distancia
function Dist(lat1, lon1, lat2, lon2) {
  rad = function (x) {
    return (x * Math.PI) / 180;
  };

  var R = 6378.137; //Radio de la tierra en km
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(2);
}
