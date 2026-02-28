from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ContentShield"
    debug: bool = False
    environment: str = "dev"

    # Placeholder — plug your real model endpoint here during the hackathon
    ml_api_url: str = ""
    ml_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
