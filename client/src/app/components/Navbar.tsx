import Link from "next/link";
import { useState } from "react";
import Button from "./Button";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClick = () => {
        console.log("Button clicked!");
    };

    const handleSignUp = () => {
        console.log("Button clicked!");
    };

    return (
        <nav className="bg-[#C4C7C9] text-black">
            <div className="max-w-7xl mx-auto p-2 flex justify-between items-center">
                {/* Logo */}
                <div className="font-BricolageGrotesque text-2xl md:ml-20 text-[#063970]">
                    <Link className="font-bold" href="/">HQuiz</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-16 mr-20 ml-0">
                    <div className="flex space-x-4 font-BricolageGrotesque font-bold">
                        <Link href="/" className="hover:text-gray-500">
                            Quiz Here
                        </Link>
                        <Link href="/about" className="hover:text-gray-500">
                            Pricing
                        </Link>
                        <Link href="/services" className="hover:text-gray-500">
                            How It Works
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Button onClick={handleClick} variant="outline">
                            Generate a Quiz
                        </Button>
                        <Button onClick={handleSignUp} variant="primary">
                            Sign Up
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#C4C7C9]">
                    <div className="px-4 pt-4 pb-4 space-y-2 font-BricolageGrotesque">
                        <Link href="/" className="block hover:text-gray-500">
                            Quiz Here
                        </Link>
                        <Link href="/about" className="block hover:text-gray-500">
                            Pricing
                        </Link>
                        <Link href="/services" className="block hover:text-gray-500">
                            How It Works
                        </Link>
                        <div className="mt-4 flex flex-col space-y-2">
                            <Button onClick={handleClick} variant="outline">
                                Generate a Quiz
                            </Button>
                            <Button onClick={handleClick} variant="primary">
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
