from datetime import datetime, timezone
from typing import Any

from bson import ObjectId


class UserModel:
    @staticmethod
    def from_mongo(doc: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": str(doc["_id"]),
            "email": doc["email"],
            "full_name": doc.get("full_name", ""),
            "created_at": doc["created_at"],
        }

    @staticmethod
    def create(email: str, full_name: str, hashed_password: str) -> dict[str, Any]:
        now = datetime.now(timezone.utc)
        return {
            "_id": ObjectId(),
            "email": email.lower(),
            "full_name": full_name,
            "hashed_password": hashed_password,
            "created_at": now,
        }
