import graphene
from .types import *
from ...services.jikan_api import buscar_anime_avanzado
from ...auth.utils import verify_token
from ...models.user_model import User
from ...models.anime_model import Anime

# Definición de la clase de consulta
class AnimeQueries(graphene.ObjectType):
    busqueda_avanzada = graphene.List(
        AnimeType,
        nombre=graphene.String(),
        tipo=graphene.String(),
        estado=graphene.String(),
        min_score=graphene.Float(),
        genero=graphene.String()
    )

    en_emision = graphene.List(AnimeType)

    obtener_favoritos = graphene.List(FavoriteAnimeType)

    # Resolver: busqueda_avanzada
    def resolve_busqueda_avanzada(self, info, nombre=None, tipo=None, estado=None, min_score=None, genero=None):
        params = {}
        if nombre: params["q"] = nombre
        if tipo: params["type"] = tipo
        if estado: params["status"] = estado
        if genero: params["genres"] = genero  # En Jikan se usa el ID de género

        resultado = buscar_anime_avanzado(params)
        return resultado

    # Resolver: en_emision
    def resolve_en_emision(self, info):
        resultado = buscar_anime_avanzado({"status": "airing"})
        return resultado
    
    def resolve_obtener_favoritos(self, info):
        auth_header = info.context.headers.get("Authorization")
        if not auth_header:
            return [] # Si no se proporciona el token, devuelve una lista vacía
        
        token = auth_header.replace("Bearer ", "") # Elimina el prefijo "Bearer " del token
        user_id = verify_token(token) # Verifica el token y obtiene el ID del usuario

        if not user_id:
            return [] # Si el token es inválido, devuelve una lista vacía
        
        return Anime.objects(user=user_id) # Devuelve los animes guardados por el usuario