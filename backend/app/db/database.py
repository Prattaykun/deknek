from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import certifi
from pymongo.errors import PyMongoError

from app.core.config import settings

_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(
            settings.mongodb_url,
            tls=True,
            tlsCAFile=certifi.where(),
            tlsDisableOCSPEndpointCheck=settings.mongodb_tls_disable_ocsp_endpoint_check,
            maxPoolSize=50,
            minPoolSize=5,
            maxIdleTimeMS=300000,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            retryWrites=True,
        )
        try:
            await _client.admin.command("ping")
            await _client[settings.database_name].users.create_index("email", unique=True)
        except PyMongoError as exc:
            _client.close()
            _client = None
            raise RuntimeError(
                "Failed to connect to MongoDB. Verify Atlas network access, URI credentials, and TLS settings."
            ) from exc


async def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_database() -> AsyncIOMotorDatabase:
    if _client is None:
        raise RuntimeError("MongoDB client has not been initialized")
    return _client[settings.database_name]
