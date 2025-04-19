import graphene
from ...models.user_model import User
from ...auth.utils import generate_token 

class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True) # Correo electrónico del usuario
        password = graphene.String(required=True) # Contraseña del usuario

    success = graphene.Boolean() # Indica si la operación fue exitosa
    message = graphene.String() # Mensaje de respuesta

    def mutate(self, info, email, password):
        if User.objects(email=email).first(): # Verifica si el correo ya está en uso
            return CreateUser(success=False, message="El correo ya está en uso") 
        try: 
            user = User(email=email) # Crea una nueva instancia de usuario
            user.set_password(password) # Establece la contraseña hasheada
            user.save() # Guarda el usuario en la base de datos
            return CreateUser(success=True, message="Usuario creado exitosamente")
        except Exception as e:
            return CreateUser(success=False, message=f"Error al crear el usuario: {str(e)}")


class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True) # Correo electrónico del usuario
        password = graphene.String(required=True) # Contraseña del usuario

    success = graphene.Boolean() # Indica si la operación fue exitosa
    message = graphene.String() # Mensaje de respuesta
    token = graphene.String() # Token de autenticación

    def mutate(self, info, email, password):
        user = User.objects(email=email).first() # Busca el usuario por correo electrónico
        if not user or not user.check_password(password): # Verifica si el usuario existe y si la contraseña es correcta
            return LoginUser(success=False, message="Credenciales inválidas")
        
        token = generate_token(user.id)
        return LoginUser(success=True, message="Inicio de sesión exitoso", token=token) # Retorna el token de autenticación