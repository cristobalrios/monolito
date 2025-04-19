from mongoengine import *
from .user_model import User

class Aired(EmbeddedDocument):
    from_date = StringField() # Fecha de inicio del anime
    to_date = StringField() # Fecha de fin del anime
    string_date = StringField() # Fecha en formato de cadena

class Anime(Document):
    mal_id = IntField(required=True, unique_with='user' )  # ID de MyAnimeList
    title = StringField(required=True)  # Título del anime
    synopsis = StringField()  # Sinopsis del anime
    genres = ListField(StringField())  # Géneros del anime
    episodes = IntField()  # Número de episodios
    type = StringField()  # Tipo de anime (TV, Movie, etc.)
    image_url = StringField()  # URL de la imagen del anime

    aired = EmbeddedDocumentField(Aired)  # Fechas de emisión
    rating = StringField()  # Calificación del anime
    score = FloatField()  # Puntuación del anime
    rank = IntField()  # Ranking del anime
    status = StringField()  # Estado del anime (Finalizado, En emisión, etc.)
    airing = BooleanField()  # Si está en emisión
    trailer_url = StringField()  # URL del tráiler

    user = ReferenceField(User, required=True)  # Referencia al usuario que guardó el anime
    meta = {
    'collection': 'anime',
    'indexes': [
        {
            'fields': ['mal_id', 'user'],
            'unique': True
        }
    ]
}
