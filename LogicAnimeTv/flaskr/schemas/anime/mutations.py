import graphene
from ...services.jikan_api import buscar_anime_por_id
from ...models.anime_model import Anime, Aired 
from ...models.user_model import User 
from ...auth.utils import verify_token 

class SaveAnime(graphene.Mutation):
    class Arguments:
        mal_id = graphene.Int(required=True) # ID de MyAnimeList, se obtendrán los datos necesarios a partir de esta

    success = graphene.Boolean() # Indica si la operación fue exitosa
    message = graphene.String() # Mensaje de respuesta

    def mutate(self, info, mal_id):
        
        auth_header = info.context.headers.get("Authorization") # Obtiene el encabezado de autorización del contexto
        if not auth_header:
            return SaveAnime(success=False, message="No se proporcionó token de autorización")  
        
        token = auth_header.replace("Bearer ", "") # Elimina el prefijo "Bearer " del token
        user_id = verify_token(token) # Verifica el token y obtiene el ID del usuario

        if not user_id:
            return SaveAnime(success=False, message="Token inválido o expirado")

        anime_data = buscar_anime_por_id(mal_id) # Llama a la función para buscar el anime por ID
        print(anime_data) # Imprime el resultado de la búsqueda para depuración

        if not anime_data:
            return SaveAnime(success=False, message="Anime no encontrado") # Verifica si se encontraron datos
        
        try:
            aired_data = anime_data.get("aired", {})
            aired = Aired(
                from_date=aired_data.get("from"), 
                to_date=aired_data.get("to"),
                string_date=aired_data.get("string")
            )

            user = User.objects(id=user_id).first() # Busca el usuario por ID
            if not user:
                return SaveAnime(success=False, message="Usuario no encontrado")

            anime = Anime(
                mal_id=anime_data.get("mal_id"),
                title=anime_data.get("title"),
                synopsis=anime_data.get("synopsis"),
                genres=[genre.get("name") for genre in anime_data.get("genres", [])], 
                episodes=anime_data.get("episodes"),
                type=anime_data.get("type"),
                image_url=anime_data.get("images", {}).get("jpg", {}).get("image_url"),
                aired=aired,
                rating=anime_data.get("rating"),
                score=anime_data.get("score"),
                rank=anime_data.get("rank"),
                status=anime_data.get("status"),
                airing=anime_data.get("airing"),
                trailer_url=anime_data.get("trailer", {}).get("url"),
                user = user
            )

            if Anime.objects(mal_id=mal_id, user=user).first():
                return SaveAnime(success=False, message="Anime ya guardado")

            
            anime.save() # Guarda el anime en la base de datos
            return SaveAnime(success=True, message="Anime guardado exitosamente") # Retorna éxito
        except Exception as e:
            return SaveAnime(success=False, message=f"Error al guardar el anime: {str(e)}") # Maneja cualquier excepción que ocurra durante el proceso de guardado


class RemoveAnimeFromFavorite(graphene.Mutation):
    class Arguments:
        mal_id = graphene.Int(required=True) # ID de MyAnimeList del anime a eliminar

    success = graphene.Boolean() # Indica si la operación fue exitosa
    message = graphene.String() # Mensaje de respuesta

    def mutate(self, info, mal_id):
        
        auth_header = info.context.headers.get("Authorization") # Obtiene el encabezado de autorización del contexto
        if not auth_header:
            return RemoveAnimeFromFavorite(success=False, message="No se proporcionó token de autorización")  
        
        token = auth_header.replace("Bearer ", "") # Elimina el prefijo "Bearer " del token
        user_id = verify_token(token) # Verifica el token y obtiene el ID del usuario

        if not user_id:
            return RemoveAnimeFromFavorite(success=False, message="Token inválido o expirado")

        user = User.objects(id=user_id).first() # Busca el usuario por ID
        anime = Anime.objects(mal_id=mal_id, user=user).first() # Busca el anime por ID y usuario

        if not anime:
            return RemoveAnimeFromFavorite(success=False, message="Anime no encontrado o no pertenece al usuario") # Verifica si se encontró el anime
        
        try:
            anime.delete() # Elimina el anime de la base de datos
            return RemoveAnimeFromFavorite(success=True, message="Anime eliminado de favoritos exitosamente") # Retorna éxito
        except Exception as e:
            return RemoveAnimeFromFavorite(success=False, message=f"Error al eliminar el anime: {str(e)}") # Maneja cualquier excepción que ocurra durante el proceso de eliminación