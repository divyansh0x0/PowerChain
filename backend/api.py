from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson import ObjectId
import os

client = MongoClient(os.getenv("MONGODB_URL"))
db = client["power_tracker"]
collection = db["power_data"]
api = FastAPI()


class PowerData(BaseModel):
    iot_id:str
    latitude: float
    longitude: float
    pincode: int
    transaction_id: str
    power_availability: int = Field(..., ge=0, le=1)
    number_power_cuts: int = 0
    number_complaints: int = 0


@api.get("/")
def hello_msg():
    return {"data":"Welcome to decentralized power tracking"}
@api.post("/power-data/")
def add_power_data(data: PowerData):
    result = collection.insert_one(data.model_dump())
    return {"id": str(result.inserted_id), "message": "Data inserted successfully"}

@api.get("/power-data/")
def get_all_data():
    docs = list(collection.find({}, {"_id": 0}))
    return {"data": docs}
@api.get("/power-data/")
def get_power_data(
    txid: str | None = Query(None),
    iot_id: str | None = Query(None),
    pincode: str | None = Query(None),
):
    # Build query dynamically
    query = {}
    if txid:
        query["txid"] = txid
    if iot_id:
        query["iot_id"] = iot_id
    if pincode:
        query["pincode"] = pincode

    # Fetch documents
    docs = list(collection.find(query, {"_id": 0}))

    if not docs:
        raise HTTPException(status_code=404, detail="No matching data found")

    return {"count": len(docs), "data": docs}