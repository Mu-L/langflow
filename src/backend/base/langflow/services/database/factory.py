from typing import TYPE_CHECKING

from langflow.services.database.service import DatabaseService
from langflow.services.factory import ServiceFactory

if TYPE_CHECKING:
    from langflow.services.settings.service import SettingsService


class DatabaseServiceFactory(ServiceFactory):
    def __init__(self):
        super().__init__(DatabaseService)

    def create(self, settings_service: "SettingsService"):
        # Here you would have logic to create and configure a DatabaseService
        if not settings_service.settings.database_url:
            raise ValueError("No database URL provided")
        return DatabaseService(settings_service.settings.database_url)
