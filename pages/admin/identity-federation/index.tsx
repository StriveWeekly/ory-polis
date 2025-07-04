import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export { default } from '@ee/identity-federation/pages/index';

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      hasValidLicense: true,
    },
  };
}
