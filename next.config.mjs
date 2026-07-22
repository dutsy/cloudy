import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // If you are loading images from Supabase Storage, add it here too:
      // {
      //   protocol: 'https',
      //   hostname: 'YOUR_SUPABASE_PROJECT_ID.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
  },
};
 
export default withNextIntl(nextConfig);