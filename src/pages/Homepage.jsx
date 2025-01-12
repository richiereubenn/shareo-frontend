import Card from "../components/Card";
import shareo from "../assets/images/Shareo..png"
import plus from "../assets/icons/plus.png"
import groups from "../assets/icons/groups.png"
import room from "../assets/icons/room.png"
import Button from "../components/Button"

import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getUserDetails, getUserTransactions } from "../controllers/UserController";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Homepage() {

    const [transactions, setTransactions] = useState([])
    const [fbUser, setFbUser] = useState(null)

    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("Homepage")
        console.log("Current user : " + user.id)
        console.log("Firebase user_id : " + user.id)

        const getTransactions = async () => {
            const transactions = await getUserTransactions(user.id)
            console.log("Transactions : ", transactions)
            setTransactions(transactions.data)
        }

        const fetchUserDetails = async () => {
            const userDetails = await getUserDetails(user.id)
            console.log("User details : ", userDetails)
            setFbUser(userDetails.data)
        }

        fetchUserDetails()
        getTransactions()
        console.log("Transactions use state : ", transactions)
        console.log("Firebase user : ", fbUser)

    }, [])

    const createRoom = () => {
        navigate("/scan-receipt")
    }

    const joinRoom = () => {
        navigate("/scan-qr")
    }
    
    return (
        <div className="p-4 pt-8 space-y-2">
            <div className="flex justify-between items-center">
                <img
                    src={shareo}
                    alt="Contoh Gambar"
                    className="h-5"
                />
                {/* <p className="font-semibold text-lg">Hi, Rafi Abhista</p> */}
                <UserButton appearance={{
                    elements: {
                        userButtonAvatarBox: 'flex items-center justify-center w-12 h-12',
                    }
                }} />
            </div>
            <div className="flex justify-between pt-2 items-center">
                <div>
                    <p className="text-xl font-semibold text-gray-500">Your Balance</p>
                    <p className="font-bold text-[30px]">Rp. {fbUser?.balance}</p>
                </div>

                <a href="/topup" className="bg-[#FFDB00] text-black text-sm font-bold py-2 px-4 rounded-lg">
                    <div className="flex gap-2 items-center">
                        <img
                            src={plus}
                            alt="Contoh Gambar"
                            className="h-4"
                        />
                        <p>Top Up</p>
                    </div>
                </a>
            </div>
            <div className="flex gap-2">
                <Button
                    text="Join Room"
                    onClick={joinRoom}
                    icon={<img src={room} alt="Plus Icon" className="h-5" />} // Gunakan JSX <img>
                    bgColor="#4B1AD4"
                    textColor="#ffffff"
                    height="54px"
                />
                <Button
                    text="Create Room"
                    onClick={createRoom}
                    icon={<img src={groups} alt="Plus Icon" className="h-5" />} // Gunakan JSX <img>
                    bgColor="#000000"
                    textColor="#ffffff"
                    height="54px"
                />
            </div>
            <p className="font-semibold text-lg pt-2">Split History</p>
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <Card
                        key={transaction.id} // Don't forget to add a key prop
                        title={transaction.title}
                        date={transaction.date}
                        people={transaction.people}
                        total={transaction.total}
                        paid={transaction.paid}
                    />
                ))
            ) : (
                // What to show when there are no transactions
                <p className="flex w-full items-center justify-center">No transactions found</p>
            )}
        </div>
    )
}

export default Homepage;