"use client"

import { usePathname, useRouter } from 'next/navigation';

const Tabs = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isTransfer = pathname === '/transfer';
    const isBridge = pathname === '/bridge';

    // Conditionally render the component
    if (!isTransfer && !isBridge) {
        return null;
    }

    return (
        <div className='mt-24 mb-12'>
            <div className="flex justify-center items-center">
                <div onClick={() => router.push('/transfer')} className={`cursor-pointer text-white font-bold bg-gradient-to-r from-[#FF00E1] to-[#4200FF] rounded-full px-6 py-1 flex items-center gap-2 ${isTransfer ? '' : 'opacity-75'}`}>
                    {isTransfer && <div className="h-2 w-2 bg-white rounded-full"></div>}
                    TRANSFER
                </div>
                <span>- - - - - - - - - - - - -</span>
                <div onClick={() => router.push('/bridge')} className={`cursor-pointer text-white font-bold bg-gradient-to-r from-[#FF00E1] to-[#4200FF] rounded-full px-6 py-1 flex items-center gap-2 ${isBridge ? '' : 'opacity-75'}`}>
                    {isBridge && <div className="h-2 w-2 bg-white rounded-full"></div>}
                    BRIDGE
                </div>
            </div>
        </div>
    );
}

export default Tabs;
