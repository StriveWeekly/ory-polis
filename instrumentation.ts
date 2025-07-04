export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const sst = await import('sst');
    process.env.OPENID_RSA_PRIVATE_KEY ??= sst.Resource.OPENID_RSA_PRIVATE_KEY.value;
    process.env.OPENID_RSA_PUBLIC_KEY ??= sst.Resource.OPENID_RSA_PUBLIC_KEY.value;
    process.env.PUBLIC_KEY ??= sst.Resource.PUBLIC_KEY.value;
    process.env.PRIVATE_KEY ??= sst.Resource.PRIVATE_KEY.value;
    process.env.NEXTAUTH_SECRET ??= sst.Resource.NEXTAUTH_SECRET.value;
  }
}
