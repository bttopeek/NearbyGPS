let map;
let userLocation;
let markers = [];
let resultsList = null;

function initMap() {
  resultsList = document.getElementById("results-list");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
      });

      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
    });
  } else {
    alert("Tu navegador no admite geolocalización.");
  }
}

function limpiarResultados() {
  if (resultsList) resultsList.innerHTML = "";
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function agregarResultadoALista(place, marker) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${place.name}</strong><br>${place.vicinity || place.formatted_address || "Sin dirección disponible"}`;

  li.addEventListener("click", () => {
    map.setCenter(marker.getPosition());
    map.setZoom(16);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1400);
  });

  resultsList.appendChild(li);
}

function buscarServicios() {
  if (!userLocation || !map) {
    alert("Esperando la ubicación...");
    return;
  }

  const tipo = document.getElementById("service-type").value;
  limpiarResultados();

  const request = {
    location: userLocation,
    radius: 3000,
    type: tipo
  };

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      results.forEach(place => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name
        });
        markers.push(marker);
        agregarResultadoALista(place, marker);
      });
    } else {
      alert("No se encontraron servicios cercanos.");
    }
  });
}

function buscarPorTexto() {
  const query = document.getElementById("text-search").value.trim();
  if (!query) {
    alert("Escribe algo para buscar.");
    return;
  }

  limpiarResultados();

  const request = {
    location: userLocation,
    radius: 5000,
    query: query
  };

  const service = new google.maps.places.PlacesService(map);
  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      results.forEach(place => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name
        });
        markers.push(marker);
        agregarResultadoALista(place, marker);
      });
    } else {
      alert("No se encontraron resultados con ese texto.");
    }
  });
}

window.onload = initMap;

function centrarEnMiUbicacion() {
  if (!userLocation || !map) {
    alert("Ubicación aún no disponible.");
    return;
  }

  map.setCenter(userLocation);
  map.setZoom(14);

  // Buscar el marcador azul
  const marcadorAzul = markers.find(m => m.getTitle() === "Tu ubicación");
  if (marcadorAzul) {
    marcadorAzul.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marcadorAzul.setAnimation(null), 1400);
  }
}
