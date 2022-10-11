import Message from "../components/message"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { auth, db } from "../utils/firebase"
import {toast} from 'react-toastify'
import {doc, arrayUnion, Timestamp, updateDoc, onSnapshot} from 'firebase/firestore'

export default function Details(){
    const router = useRouter()
    const routeData = router.query
    const [message, setMessage] = useState('')
    const [allMessage, setAllMessages] = useState([])

    //Submit a message
    const submitMessage = async () => {
        //Check if user is logged
        if(!auth.currentUser) return router.push('/auth/login')
        if(!message){
            toast.error("Don't leave an empty message 😭", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 1500
            })
            return
        }

        const docRef = doc(db, 'posts', routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message, 
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                time: Timestamp.now()
            })
        })
        setMessage('')
    }

    //Get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id)
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessages(snapshot.data().comments)
        })   
        return unsubscribe    
    }

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, [router.isReady]);

    return (
        <div>
            <Message {...routeData}>
            </Message>
            <div className="my-4">
                <div className="flex">
                    <input className="bg-gray-800 w-full p-2 px-4 text-white text-sm rounded-l-md" onChange={(e) => setMessage(e.target.value)} type="text" value={message} placeholder="Place a comment 🫵" />
                    <button onClick={submitMessage} className="bg-gray-900 font-bold text-white py-2 px-4 text-sm rounded-r-md">submit</button>
                </div>
                <div className="py-6">
                    <h2 className="font-bold">comments</h2>
                    {allMessage?.map((message) => (
                        <div className="bg-white p-4 my-4 border-2" key={message.time}>
                        <div className="flex items-center gap-2 mb-4">
                            <img
                            className="w-8 rounded-full"
                            src={message.avatar}
                            alt=""
                            />
                            <h2>{message.username}</h2>
                        </div>
                        <h2>{message.message}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}