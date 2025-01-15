import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
    providers: [
        KakaoProvider({
            clientId: process.env.NEXT_KAKAO_REST_API_KEY as string,
            clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: 'login consent'
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile ) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.userId = account.providerAccountId;
                token.provider = account.provider;
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.userId = token.userId as string;
            session.provider = token.provider as string;

            return session;
        }
    },
    // debug: true,
});

export { handler as GET, handler as POST };