'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import NavLinks from './NavLinks';

const Header = () => {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(
            new Date().toLocaleDateString('bn-BD', {
                dateStyle: 'full',
            })
        );
    }, []);

    return (
        <header className="w-full px-6 py-4 border-b bg-white border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        className="w-10 h-10 bg-green-700"
                        height={50}
                        width={50}
                        src="/logo-icon.png"
                        alt="বাজার দর লোগো"
                    />

                    <div>
                        <h2>বাজার দর</h2>
                        <div>{date || 'তারিখ লোড হচ্ছে...'}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <button className="btn hover:text-green-600">
                        সাইন ইন
                    </button>

                    <button className="btn text-white bg-green-600 text-neutral-700 transition-colors hover:bg-pink-600">
                        সাইন আপ
                    </button>
                </div>
            </div>

            <NavLinks />
        </header>
    );
};

export default Header;