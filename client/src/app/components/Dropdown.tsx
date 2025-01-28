import React, { useState } from 'react';

interface DropdownItem {
    label: string;
    onClick: () => void;
}

interface DropdownProps {
    items: DropdownItem[];
    buttonLabel?: string; // Optional button label
    className?: string; // Optional additional class names for customization
}

const Dropdown: React.FC<DropdownProps> = ({
    items,
    buttonLabel = 'Options', // Default button label
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-center rounded-md border border-[#063970] shadow-sm px-2 py-2 bg-white text-sm font-medium text-[#063970] hover:text-white hover:bg-[#063970] font-BricolageGrotesque  w-[190px]"
                >
                    {/* focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */}
                    {buttonLabel}
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.04 1.08l-4.25 3.5a.75.75 0 01-.96 0l-4.25-3.5a.75.75 0 010-1.08z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1 flex flex-col items-center justify-center" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false); // Close dropdown after selection
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
