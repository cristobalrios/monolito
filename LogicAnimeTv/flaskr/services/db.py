import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB credentials from environment variables
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create a MongoDB client and connect to the database
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Example: Print the list of collections in the database
print("Collections:", db.list_collection_names())