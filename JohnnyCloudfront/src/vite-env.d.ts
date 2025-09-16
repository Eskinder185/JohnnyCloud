/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string
  readonly VITE_CHAT_API: string
  readonly VITE_COGNITO_DOMAIN: string
  readonly VITE_COGNITO_CLIENT_ID: string
  readonly VITE_COGNITO_USER_POOL_ID: string
  readonly VITE_COGNITO_IDENTITY_POOL_ID: string
  readonly VITE_LEX_BOT_ID: string
  readonly VITE_LEX_BOT_ALIAS_ID: string
  readonly VITE_LEX_LOCALE_ID: string
  readonly VITE_REDIRECT_URI: string
  readonly VITE_SIGNOUT_URI: string
  readonly VITE_CHAT_API: string
  readonly VITE_METRICS_API: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_SLACK_CONTACTS: string
  readonly VITE_SLACK_JOIN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

