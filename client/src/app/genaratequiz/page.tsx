"use client";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Quiznav from "../components/Quiznav";


export default function Quiz() {

    const handleClick = () => {
        console.log("Button clicked!");
    };
    const dropdownItems = [
        { label: 'Option 1', onClick: () => console.log('Option 1 selected') },
        { label: 'Option 2', onClick: () => console.log('Option 2 selected') },
        { label: 'Option 3', onClick: () => console.log('Option 3 selected') },
    ];
    return (
        <div className="bg-[#E2E2E2]">
            <Quiznav />
            <div className="w-[100%] m-auto h-[100vh] p-5">
            <div className="flex-col flex md:flex-row items-center justify-center m-auto">
                <div className="md:max-w-1/3 m-4 bg-white items-center p-5 ">
                <div className="flex flex-col  justify-center bg-white gap-3 h-full">
                
                        <Dropdown items={dropdownItems} buttonLabel="Generate a Quiz" />
                        <Dropdown items={dropdownItems} buttonLabel="My Quiz Results" />
                        <Dropdown items={dropdownItems} buttonLabel="Explore Templates" />
                        <div className="md:mt-20">
                        <Button onClick={handleClick} variant="outline" className="py-1 w-[190px] ">
                            Generate a Quiz
                        </Button>
                        </div>

                </div>
                </div>
                <div className="md:max-w-2/3">
                <div className="flex-col  p-4 m-4 justify-center gap-3 ">
                    <h6 className="text-[#063970] font-BricolageGrotesque text-2xl">
                    Generate  Quiz
                    </h6>
                    <p className="font-BricolageGrotesque text-sm">
                    Effortlessly create customized quizzes on any topic! Our smart quiz generator crafts tailored questions on any subject...
                    </p>
                    <div className=" border border-[#063970] h-[50vh]">

                    </div>
                </div>
                
                </div>
                </div>
               
            </div>
        </div>
    );
}