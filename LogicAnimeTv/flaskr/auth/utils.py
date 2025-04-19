import jwt as pyjwt
import datetime
import os
from dotenv import load_dotenv


load_dotenv() 
SECRET_KEY = os.getenv("SECRET_KEY")
def generate_token(usuario_id):
    payload = {
        "user_id": str(usuario_id),
        "iat": datetime.datetime.now(datetime.timezone.utc),  # emisión
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1),  # expiración
    }
    token = pyjwt.encode(payload, SECRET_KEY, algorithm="HS256") # Se utiliza el algoritmo HS256 para firmar el token
    return token

def verify_token(token):
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except pyjwt.ExpiredSignatureError:
        return None
    except pyjwt.InvalidTokenError:
        return None

