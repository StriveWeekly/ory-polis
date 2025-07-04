// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

const oryPolisConfig = {
  EXTERNAL_URL: 'https://sso.striveweekly.com',
  SAML_AUDIENCE: 'https://www.striveweekly.com',
  NEXTAUTH_URL: 'https://sso.striveweekly.com',
  ADMIN_PORTAL_SSO_TENANT: '_strive_weekly_tenant',
  ADMIN_PORTAL_SSO_PRODUCT: '_strive_weekly_admin_portal',
  IDP_ENABLED: 'true',
  DB_ENGINE: 'sql',
  DB_TYPE: 'postgres',
  DB_TTL: '300',
  DB_CLEANUP_LIMIT: '1000',
  DB_PAGE_LIMIT: '50',
  NEXTAUTH_ACL: '*@striveweekly.com',
  LOG_LEVEL: 'warn',
  OPENID_JWS_ALG: 'RS256',
  BOXYHQ_NO_ANALYTICS: '1',
  SETUP_LINK_EXPIRY_DAYS: '7',
  ADMIN_PORTAL_HIDE_DIRECTORY_SYNC: 'true',
  ADMIN_PORTAL_HIDE_IDENTITY_FEDERATION: 'true',
  SSO_TRACES_TTL: '240',
  SMPT_USER: 'AKIA2QNEPAB2PWRZXIZ3',
  SMTP_FROM: 'striveweekly.com',
  SMTP_HOST: 'email-smtp.us-east-1.amazonaws.com',
  SMTP_PORT: '587',
  // PRE_LOADED_CONNECTION: './strive-weekly/pre-loaded-connections/',
};

export default $config({
  app(input) {
    return {
      name: 'ory-polis',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  async run() {
    const email =
      $app.stage === 'prod'
        ? new sst.aws.Email('StriveWeeklySES', {
            sender: 'striveweekly.com',
            dmarc:
              'v=DMARC1; p=none; rua=mailto:fdbb57d0f9a3444d8163e00188d0e6a5@dmarc-reports.cloudflare.net;',
            dns: sst.cloudflare.dns(),
          })
        : sst.aws.Email.get('StriveWeeklySES', 'striveweekly.com');

    new sst.aws.Nextjs('OryPolis', {
      domain:
        $app.stage === 'prod'
          ? {
              name: 'sso.striveweekly.com',
              dns: sst.cloudflare.dns(),
            }
          : undefined,
      link: [
        email,
        new sst.Secret('OPENID_RSA_PRIVATE_KEY'),
        new sst.Secret('OPENID_RSA_PUBLIC_KEY'),
        new sst.Secret('PUBLIC_KEY'),
        new sst.Secret('PRIVATE_KEY'),
        new sst.Secret('NEXTAUTH_ADMIN_CREDENTIALS'),
        new sst.Secret('NEXTAUTH_SECRET'),
      ],
      environment: {
        ...oryPolisConfig,
        SMTP_PASSWORD: new sst.Secret('SMTP_PASSWORD').value,
        JACKSON_API_KEYS: new sst.Secret('JACKSON_API_KEYS').value,
        CLIENT_SECRET_VERIFIER: new sst.Secret('CLIENT_SECRET_VERIFIER').value,
        DB_URL: new sst.Secret('DB_URL').value,
      },
    });
  },
});
