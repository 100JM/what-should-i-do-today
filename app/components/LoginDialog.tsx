'use client';

import { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import useDialog from '../store/useDialog';
import useUserData from '../store/useUserData';

const LoginDialog = () => {
    const { showLogin, setShowLogin } = useDialog();
    const { data: session } = useSession();
    const { myPlace } = useUserData();
    const [showMyPlace, setShowMyPlace] = useState<boolean>(false);

    const handleSingOut = async () => {
        setShowLogin(false);
        await signOut({ callbackUrl: '/' });
    };

    useEffect(() => {
        if (showLogin) {
            setShowMyPlace(false);
        }
    }, [showLogin]);

    return (
        <Dialog
            open={showLogin}
            onClose={() => setShowLogin(false)}
            maxWidth="md"
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
                {session?.userId && !showMyPlace &&
                    <div className="flex flex-col gap-y-2 items-center">
                        <span>🤔</span>
                        <span className="text-base text-center font-bold text-gray-600">
                            {session.user?.name}님 안녕하세요!
                        </span>
                        <button onClick={() => setShowMyPlace(true)} className="w-40 h-12 bg-slate-200 flex justify-center items-center rounded-md">
                            <span className="text-base text-center font-bold">
                                🔖저장목록
                            </span>
                        </button>
                        <button onClick={handleSingOut} className="w-40 h-12 bg-slate-200 flex justify-center items-center rounded-md">
                            <span className="text-base text-center font-bold">
                                🚪로그아웃
                            </span>
                        </button>
                    </div>
                }
                {session?.userId && showMyPlace &&
                    <div className="flex flex-col gap-y-2 items-center min-w-[250px]">
                        <div className="flex items-center w-full text-base font-bold text-gray-600">
                            <button className="mr-auto" onClick={() => setShowMyPlace(false)}>
                                <i className="ri-arrow-left-line"></i>
                            </button>
                            <span className="absolute left-1/2 transform -translate-x-1/2">
                                🔖나의 저장 목록
                            </span>
                        </div>
                        {myPlace.length > 0 ?
                            <div className="grid gap-y-2 items-center max-h-[500px] overflow-y-auto px-1 w-full">
                                <button className="w-full h-12 bg-slate-200 flex justify-center items-center rounded-md">
                                    <span className="text-base text-center font-bold">
                                        내 장소
                                    </span>
                                </button>
                            </div>
                            :
                            <div className="w-full h-14 bg-slate-200 flex justify-center items-center rounded-md">
                                <span className="text-base text-center font-bold">🍃<br />저장된 장소가 없어요.</span>
                            </div>
                        }
                    </div>
                }
            </DialogTitle>
        </Dialog>
    )
}

export default LoginDialog;