/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mediahub.seoul.go.kr',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
