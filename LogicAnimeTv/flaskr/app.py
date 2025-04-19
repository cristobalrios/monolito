from flask import Flask
from flask_graphql import GraphQLView
from .schemas.schema import schema
from mongoengine import *
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/graphql": {"origins": "*"}})  # Permite solicitudes desde cualquier origen

try:
    connect(host=os.getenv('MONGO_URI'))
except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # Habilita interfaz web para probar queries
    )
)

if __name__ == '__main__':
    app.run(debug=True)
