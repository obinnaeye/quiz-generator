import Link from "next/link";
import { useState } from "react";
import Button from "./Button";

const Quiznav: React.FC = () => {
    

    return (
        <nav className="bg-[#C4C7C9] text-black">
            <div className="max-w-7xl mx-auto p-2 flex justify-between items-center">
                {/* Logo */}
                <div className="font-BricolageGrotesque text-2xl md:ml-20 text-[#063970]">
                    <Link className="font-bold" href="/">HQuiz</Link>
                </div>

                <div className="flex flex-col items-center p-4 md:p-0 md:px-4 mr-4 md:mr-4 justify-center ">
                    <div className="w-[30px] h-[30px] border border-[#063970] rounded-full">
<img src="/person.png" alt="Profile" className="w-full h-full rounded-full" />
                    </div>
                    <p className="text-[#063970] text-sm">John Doe</p>
                </div>

                </div>
        </nav>
    );
};

export default Quiznav;
