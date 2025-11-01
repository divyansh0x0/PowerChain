# Decentralized Power Tracker

## Why decentralized?

This will allow tempering of data from any single authority which can allow corruption to creep in. This will also allow the people to actively see what the current goverment is doing and how well the Power Station handles complaints. 
Decentralization builds trust.
## How will it scale and cost of implementation
It can be done in 3 stages:
1. Transformer-Level Installation: It will be done on local distribution transformers or feeder pillars (each usually supplies 20–100 houses).
   Ideal for a city-wide pilot.

2. Street-Level or Cluster-Level Installation: street distribution points that serve small clusters (10–20 homes).
3. Per-House Installation:Inside or near smart meters / main breaker of individual homes.

## Tech Stack
### Front End
- Nuxt/Vue
- Leaflet for map
- Government UI: an authenticated panel to mark complaints resolved/unresolved; record action audit trail (who, when, notes).
### Backend
- Python FastAPI
- Central Database (MongoDB)
### Block
- Periodically (say, every 15 or 30 minutes), the backend takes all `(house_id + power_status + timestamp)` and hashes it for each record using SHA-256
- Builds a Merkle Tree from all these hashes computes a Merkle Root for that area
- Uploads the entire JSON batch to IPFS and get a CID
- The backend sends the CID to smart contract on Ethereum

So the chain only has
- Merkle Root (proof)
- Area ID
- IPFS link
- Timestamp

To get a specific house/transformer

### IOT
Each IoT device (in a home, transformer, or street area) reports:
- latitude
- longitude
- power_status (ON/OFF)
- timestamp
- device_signature

```Text
Bharti Airtel has already announced a major NB-IoT deployment: they partnered with Secure Meters to roll out NB-IoT based smart-meters for ~1.3 million homes in Bihar.
SIM7020E NB‑IoT (Narrowband Internet of Things) Module can be used
4G IoT Core network elements include 3GPP compliant HSS, PCRF, SCEF, DRA, and SMSC, supporting all the features and functionality for NB-IoT and LTE-M devices.

```
## prevention of IoT tempering

Choose IoT boards that have TPM (Trusted Platform Module) or Secure Element chips. Like
ESP32 with ATECC608A.

### Secure Boot

Ensure the device only runs signed firmware.
If someone flashes custom firmware (malware), the device refuses to boot.
Encrypt all communications
### Secure Network 
TLS (HTTPS/MQTT over SSL) or DTLS for low-bandwidth devices.
Even if someone intercepts packets, they can’t modify or read them.