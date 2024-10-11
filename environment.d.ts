declare namespace NodeJS {
  interface ProcessEnv {
    // inyected by webpack
    SUBDOMAIN: string,
    CUSTOM_AUTH_DOMAIN: string
    DEBUG_TOKEN: boolean,
    // inyected by env
    API_KEY: string,
    AUTH_DOMAIN: string,
    PROJECT_ID: string,
    STORAGE_BUCKET: string,
    MESSAGING_SENDER_ID: string,
    APP_ID: string,
    MEASUREMENT_ID: string,
    APP_NAME: string,
    TEXT_MODERATION_API: string,
    IMAGE_MODERATION_API: string,
    EXPLICIT_CONTENT_DETECTION_API_KEY: string | undefined,
    RECAPTCHA_SITE_KEY: string | undefined,
  }
}
