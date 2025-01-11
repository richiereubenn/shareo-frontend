import Card from "../components/Card";
import shareo from "../assets/images/Shareo..png"
import plus from "../assets/icons/plus.png"
import groups from "../assets/icons/groups.png"
import room from "../assets/icons/room.png"
import Button from "../components/Button"

import { UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";

function Homepage() {

    useEffect(() => {
        console.log("Homepage")
    }, [])

    const handleClick = () => {
        alert(`Joining Room:`);
    };
    return (
        <div className="p-4 space-y-2">
            <div className="flex justify-between">
                <img
                    src={shareo}
                    alt="Contoh Gambar"
                    className="h-5"
                />
                {/* <p className="font-semibold text-lg">Hi, Rafi Abhista</p> */}
                <UserButton />
            </div>
            <div className="flex justify-between pt-2 items-center">
                <div>
                    <p className="text-xl font-semibold text-gray-500">Your Balance</p>
                    <p className="font-bold text-[30px]">Rp. 2.120.300</p>
                </div>

                <div className="bg-[#FFDB00] text-black text-sm font-bold py-2 px-4 rounded-lg">
                    <div className="flex gap-2 items-center">
                        <img
                            src={plus}
                            alt="Contoh Gambar"
                            className="h-4"
                        />
                        <p>Top Up</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    text="Join Room"
                    onClick={handleClick}
                    icon={<img src={room} alt="Plus Icon" className="h-5" />} // Gunakan JSX <img>
                    bgColor="#4B1AD4"
                    textColor="#ffffff"
                    height="54px"
                />
                <Button
                    text="Join Room"
                    onClick={handleClick}
                    icon={<img src={groups} alt="Plus Icon" className="h-5" />} // Gunakan JSX <img>
                    bgColor="#000000"
                    textColor="#ffffff"
                    height="54px"
                />
            </div>
            <p className="font-semibold text-lg pt-2">Split History</p>
            <Card
                title="Bakso Joko Parte"
                date="3 Januari 2024"
                people={3}
                total={120000}
                paid={75}
            />
            <Card
                title="Pizza Party"
                date="10 Januari 2024"
                people={5}
                total={250000}
                paid={50}
            />
            <Card
                title="Pizza Party"
                date="10 Januari 2024"
                people={5}
                total={250000}
                paid={50}
            />
        </div>
    )
}

export default Homepage;