import Card from "../components/Card";
import shareo from "../assets/images/Shareo..png"
import plus from "../assets/icons/plus.png"
import groups from "../assets/icons/groups.png"
import room from "../assets/icons/room.png"
import Button from "../components/Button"

import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getUserDetails, getUserTransactions } from "../controllers/UserController";
import { getUsersFromTransaction } from "../controllers/TransactionController";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getRoomsByUserId } from "../controllers/RoomController";

function Homepage() {

    const [transactions, setTransactions] = useState([])
    const [rooms, setRooms] = useState([])
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

        const fetchRooms = async () => {
            const rooms = await getRoomsByUserId(user.id)
            console.log("Rooms : ", rooms)
            setRooms(rooms.data)
        }

        fetchUserDetails()
        getTransactions()
        fetchRooms()
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
        <div className="space-y-2">
            {/* <h1>Hello, {user.firstName}</h1>
            <h1>Hello, {user.id}</h1> */}
            <div className="p-8 sticky top-0 pb-8 gap-6 bg-white drop-shadow-md">
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
                        <p className="text-xl font-medium text-[#1e1e1e]">
                            {fbUser?.balance?.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </p>
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
                <div className="flex gap-2 pt-4">
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
            </div>
            <p className="font-semibold text-lg pt-2 px-4">Split Rooms</p>
            <div className="px-4">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div className="p-2" onClick={() => navigate(`/select-item/${room.id}`)}>
                            <Card
                                key={room.id} // Don't forget to add a key prop
                                title={room.room_name}
                                status={room.status}
                                userId={room.user_id}
                            />
                        </div>
                    ))
                ) : (
                    // What to show when there are no transactions
                    <p className="flex w-full items-center justify-center">No rooms found</p>
                )}
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

            <p className="font-semibold text-lg pt-2">Split History</p>
            {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <Card
                        key={transaction.id} // Don't forget to add a key prop
                        title={transaction.title}
                        date={transaction.date}
                        people={getUsersFromTransaction(transaction.id)}
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