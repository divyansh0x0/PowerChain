<script setup lang="ts">
import {onMounted, watch} from 'vue';
import {useThemeManager} from '~/composables/useThemeManager';

const {theme, setTheme} = useThemeManager();

interface PowerData {
    latitude: number;
    longitude: number;
    recorded_at: string;
    pincode: number;
    currently_powered: boolean;
    power_availability: number;
    number_of_power_cuts: number;
    number_of_complaints: number;
}
interface TransactionData{
    _id:string;
    power_data:string;
    transaction_id:string;
    verified_on_chain_at: string;
}
async function fetchAllData():Promise<TransactionData[]> {
    const url = "https://decentralized-power-tracker.onrender.com";
    console.log("Fetching all data");
    const res = await fetch(`${url}/power-data/`);
    const data:any = await res.json();
    console.log("All data:", data);
    return data["data"];
}
onMounted(async () => {
    const iot_data = await fetchAllData();
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
        {immediate: false}
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

    function addDataPoint(point: PowerData) {
        console.log(point);
        let point_color = "";
        if (point.power_availability > 85) {
            point_color = "#00ff00";
        } else if (point.power_availability > 50) {
            point_color = "#ffc800";
        } else {
            point_color = "#ff0000";
        }
        L.circleMarker([point.latitude, point.longitude], {
            radius: 6,
            color: point_color,
            fillColor: point_color,
            fillOpacity: 0.5,
            stroke: false,
        })
            .addTo(map)
            .bindPopup(
                `
        <b>Currently Powered:</b> ${point.currently_powered}<br/>
        <b>Power Availability:</b> ${point.power_availability*100}%<br/>
        <b>Power Cuts:</b> ${point.number_of_power_cuts}<br/>
        <b>Complaints:</b> ${point.number_of_complaints}<br/>
        <b>Power availability time:</b> ${point.power_availability * 24}hr
      `
            );
    }

    for (const iot_data_el of iot_data) {
        addDataPoint(JSON.parse(iot_data_el["power_data"]));
    }
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
