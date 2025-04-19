import graphene
from .anime.queries import AnimeQueries # Importa las consultas de anime
from .anime.mutations import *  # Importa la mutación para guardar anime
from .user.mutations import *  # Importa la mutación para crear usuario y Login


class Query(
    AnimeQueries,  # Importa las consultas de anime
    graphene.ObjectType  # Clase base de Graphene para definir el esquema
):
    pass

class Mutation(graphene.ObjectType): # Clase base de Graphene para definir el esquema)
    SaveAnime = SaveAnime.Field()  # Define la mutación para guardar anime
    DeleteAnime = RemoveAnimeFromFavorite.Field()  # Define la mutación para eliminar anime
    CreateUser = CreateUser.Field()  # Define la mutación para crear usuario
    Login = LoginUser.Field()  # Define la mutación para iniciar sesión
    


schema = graphene.Schema(query=Query, mutation=Mutation)  # Crea el esquema de GraphQL con las consultas y mutaciones definidas