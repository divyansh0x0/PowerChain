<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useThemeManager } from '~/composables/useThemeManager';


const {theme, setTheme} = useThemeManager();
interface PowerData{
  latitude: number;
  longitude:number;
  currently_powered: boolean;
  power_availability:number;
  number_of_power_cuts:number;
  number_of_complaints:number;
  avg_time_of_daily_power:number;
}
function getRandomCoordinateInHimachal() : [number, number] {
  // Bounding box for Himachal Pradesh
  const minLat = 18.0;
  const maxLat = 28.5;
  const minLng = 74.0;
  const maxLng = 81.0;


  // Generate random latitude and longitude
  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;

  return [lat, lng];
}

const generateRandomPowerData = (count: number): PowerData[] => {
  const data: PowerData[] = [];
  for (let i = 0; i < count; i++) {
    // Random lat/long roughly within India’s bounding box
    const randomPoint = getRandomCoordinateInHimachal();
    const lat = randomPoint[0];
    const lng = randomPoint[1];
    const avg_time_of_daily_power = Math.floor(Math.random() * 24);
    data.push({
      latitude: lat,
     longitude: lng,
      currently_powered: Math.round(Math.random()) === 1,
      number_of_power_cuts: 2+ Math.floor(Math.random() * 10),
      number_of_complaints: Math.floor(Math.random() * 5),
      avg_time_of_daily_power:avg_time_of_daily_power ,
      power_availability:Math.floor(avg_time_of_daily_power/24 * 100),
    });
  }
  return data;
};
const randomPowerData = generateRandomPowerData(150);
onMounted(async () => {
  const L = await import('leaflet');
  await import('leaflet/dist/leaflet.css');

  const map = L.map('map', {
    center: [22.9734, 78.6569],
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
  });

  const lightTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap & CartoDB',
      }
  );

  const darkTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap & CartoDB',
      }
  );

  // Initially add correct theme layer
  let currentLayer = theme.value === 'dark' ? darkTiles : lightTiles;
  currentLayer.addTo(map);

  // Watch for theme changes dynamically
  watch(
      theme,
      (newTheme) => {
        const newLayer = newTheme === 'dark' ? darkTiles : lightTiles;

        if (map.hasLayer(currentLayer)) {
          map.removeLayer(currentLayer);
        }
        newLayer.addTo(map);
        currentLayer = newLayer; // keep track of active layer
      },
      { immediate: false }
  );

  // Load and render GeoJSON
  const response = await fetch('/geo/in.geojson');
  const indiaGeoJson = await response.json();

  const indiaLayer = L.geoJSON(indiaGeoJson, {
    style: {
      color: '#00ff00',
      weight: 2,
      fillOpacity: 0.1,
    },
  }).addTo(map);

  map.fitBounds(indiaLayer.getBounds());

  randomPowerData.forEach((point) => {
    let point_color = "";
    if(point.power_availability > 80){
      point_color = "#00ff00";
    }
    else if(point.power_availability > 50){
      point_color = "#ffc800";
    }
    else{
      point_color = "#ff0000";
    }
    L.circleMarker([point.latitude, point.longitude], {
      radius: 6,
      color: point_color,
      fillColor: point_color,
      fillOpacity: 0.5,
      stroke:false,
    })
        .addTo(map)
        .bindPopup(
            `
        <b>Currently Powered:</b> ${point.currently_powered}<br/>
        <b>Power Availability:</b> ${point.power_availability}%<br/>
        <b>Power Cuts:</b> ${point.number_of_power_cuts}<br/>
        <b>Complaints:</b> ${point.number_of_complaints}<br/>
        <b>Power availability time:</b> ${point.avg_time_of_daily_power}hr
      `
        );
  });
});
</script>

<template>
  <div class="map-wrapper">
    <div id="map"></div>
    <h3>Decentralized Power Tracker</h3>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative; /* establishes a new stacking context */
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

h3 {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000; /* higher than Leaflet’s tile layers */
  color: white; /* visible on dark map */
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}
</style>
