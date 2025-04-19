import graphene
# Definición del esquema de GraphQL

# Definición del tipo de fechas relevantes (Emisión y finalización)
class AiredType(graphene.ObjectType):
    from_date = graphene.String() # Fecha de inicio
    to_date = graphene.String() # Fecha de finalización
    string_date = graphene.String() # Fecha en formato de cadena

    def resolve_from_date(parent, info):
        return parent.get("from")
    
    def resolve_to_date(parent, info):
        return parent.get("to")
    
    def resolve_string_date(parent, info):
        return parent.get("string")
    
# Definición del tipo de anime
class AnimeType(graphene.ObjectType):
    #Información básica
    mal_id = graphene.Int() #id de MyAnimeList
    title = graphene.String() # Titulo del anime
    synopsis = graphene.String() # Sinopsis del anime
    genres = graphene.List(graphene.String) # Géneros del anime
    episodes = graphene.Int() # Número de episodios
    type = graphene.String() # Tipo de anime (TV, Movie, etc.)
    image_url = graphene.String() # URL de la imagen del anime

    # Información adicional
    aired = graphene.Field(AiredType) # Fechas de emisión
    rating = graphene.String() # Calificación del anime
    score = graphene.Float() # Puntuación del anime
    rank = graphene.Int() # Ranking del anime
    status = graphene.String() # Estado del anime (Finalizado, En emisión, etc.)
    airing = graphene.Boolean() # Si está en emisión
    trailer_url = graphene.String() # URL del tráiler

    def resolve_image_url(parent, info):
        return parent.get("images", {}).get("jpg", {}).get("image_url")
    
    def resolve_trailer_url(parent, info):
        return parent.get("trailer", {}).get("url")
    
    def resolve_genres(parent, info):
        return [genre.get("name") for genre in parent.get("genres", [])]
    
class FavoriteAnimeType(graphene.ObjectType):
    mal_id = graphene.Int() # ID de MyAnimeList
    title = graphene.String() # Título del anime
    synopsis = graphene.String() # Sinopsis del anime
    genres = graphene.List(graphene.String) # Géneros del anime
    episodes = graphene.Int() # Número de episodios
    type = graphene.String() # Tipo de anime (TV, Movie, etc.)
    image_url = graphene.String() # URL de la imagen del anime

    aired = graphene.Field(AiredType) # Fechas de emisión
    rating = graphene.String() # Calificación del anime
    score = graphene.Float() # Puntuación del anime
    rank = graphene.Int() # Ranking del anime
    status = graphene.String() # Estado del anime (Finalizado, En emisión, etc.)
    airing = graphene.Boolean() # Si está en emisión
    trailer_url = graphene.String() # URL del tráiler


