import { hashNonce } from '@/auth/wallet/client-helpers';
import {
  MiniAppWalletAuthSuccessPayload,
  MiniKit,
  verifySiweMessage,
} from '@worldcoin/minikit-js';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User {
    walletAddress: string;
    username: string;
    profilePictureUrl: string;
  }

  interface Session {
    user: {
      walletAddress: string;
      username: string;
      profilePictureUrl: string;
    } & DefaultSession['user'];
  }
}

// Auth configuration for Wallet Auth based sessions
// For more information on each option (and a full list of options) go to
// https://authjs.dev/getting-started/authentication/credentials
// Debug environment variables
console.log('🔐 Auth Environment Variables:');
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'SET' : 'NOT SET');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('AUTH') || key.includes('SECRET')));

// Fallback secret if both are undefined
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'World App Wallet',
      credentials: {
        nonce: { label: 'Nonce', type: 'text' },
        signedNonce: { label: 'Signed Nonce', type: 'text' },
        finalPayloadJson: { label: 'Final Payload', type: 'text' },
      },
      // @ts-expect-error TODO
      authorize: async ({
        nonce,
        signedNonce,
        finalPayloadJson,
      }: {
        nonce: string;
        signedNonce: string;
        finalPayloadJson: string;
      }) => {
        const expectedSignedNonce = hashNonce({ nonce });

        if (signedNonce !== expectedSignedNonce) {
          console.log('Invalid signed nonce');
          return null;
        }

        const finalPayload: MiniAppWalletAuthSuccessPayload =
          JSON.parse(finalPayloadJson);
        const result = await verifySiweMessage(finalPayload, nonce);

        if (!result.isValid || !result.siweMessageData.address) {
          console.log('Invalid final payload');
          return null;
        }

        // Get user info from MiniKit
        const userInfo = await MiniKit.getUserInfo(finalPayload.address);
        
        // Register/verify user in backend database
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
          const verifyResponse = await fetch(`${backendUrl}/api/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nullifier_hash: finalPayload.nullifier_hash,
              verification_level: finalPayload.verification_level,
              action: finalPayload.action,
              walletAddress: finalPayload.address,
              username: userInfo.username,
              profilePictureUrl: userInfo.profilePictureUrl
            }),
          });
          console.log('verifyResponse', verifyResponse)
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log('✅ User registered in backend:', verifyData.user.id);
            
            // Return user with backend-generated ID
            return {
              id: verifyData.user.id, // Use backend-generated user ID
              walletAddress: finalPayload.address,
              ...userInfo,
            };
          } else {
            console.error('❌ Failed to register user in backend');
            // Fallback to wallet address as ID
            return {
              id: finalPayload.address,
              walletAddress: finalPayload.address,
              ...userInfo,
            };
          }
        } catch (error) {
          console.log('verifyResponse', verifyResponse, "error" , error);
          console.error('❌ Backend registration error:', error);
          // Fallback to wallet address as ID
          return {
            id: finalPayload.address,
            walletAddress: finalPayload.address,
            ...userInfo,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.profilePictureUrl = user.profilePictureUrl;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.walletAddress = token.walletAddress as string;
        session.user.username = token.username as string;
        session.user.profilePictureUrl = token.profilePictureUrl as string;
      }

      return session;
    },
  },
});
