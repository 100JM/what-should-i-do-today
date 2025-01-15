'use client';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import useDialog from '../store/useDialog';

const LoginDialog = () => {
    const { showLogin, setShowLogin } = useDialog();
    const { data: session } = useSession();

    const handleSingOut = async () => {
        setShowLogin(false);
        await signOut({ callbackUrl: '/' });
    };

    return (
        <Dialog
            open={showLogin}
            onClose={() => setShowLogin(false)}
            maxWidth="sm"
        >
            <DialogTitle>
                {!session?.userId &&
                    <div className="flex flex-col gap-y-2 items-center">
                        <span>🤔</span>
                        <span className="text-base text-center font-bold text-gray-600">
                            로그인하고 모든 기능을 이용해보세요!
                        </span>
                        <button onClick={() => signIn('kakao', { callbackUrl: '/' })}>
                            <Image
                                src="/images/kakao_login_large_wide.png"
                                alt="카카오 로그인"
                                layout="intrinsic"
                                width={300}
                                height={100}
                            />
                        </button>
                    </div>
                }
                {session?.userId &&
                    <div className="flex flex-col gap-y-2 items-center">
                        <span>🤔</span>
                        <span className="text-base text-center font-bold text-gray-600">
                            {session.user?.name}님 안녕하세요!
                        </span>
                        <button onClick={handleSingOut} className="w-40 h-12 bg-slate-200 flex justify-center items-center rounded-md">
                            <span className="text-base text-center font-bold">
                                🚪로그아웃
                            </span>
                        </button>
                    </div>
                }
            </DialogTitle>
        </Dialog>
    )
}

export default LoginDialog;