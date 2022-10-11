import {auth, db} from '../utils/firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {collection, query, onSnapshot, where, doc, deleteDoc} from 'firebase/firestore'
import Message from '../components/message'
import {BsTrash2Fill} from 'react-icons/bs'
import {AiFillEdit} from 'react-icons/ai'
import Link from 'next/link'

export default function Dashboard(){
    const route = useRouter()
    const [user, loading] = useAuthState(auth)
    const [posts, setAllPosts] = useState([])

    //See if user is logged
    const getData = async () => {
        if(loading) return
        if(!user) return route.push('/auth/login')
        const collectionRef = collection(db, "posts")
        const q = query(collectionRef, where('user', '==', user.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
        return unsubscribe
    }

    const deletePost = async (id) => {
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef)
    }

    //Get users data
    useEffect(() => {
        getData()
    }, [user, loading])

    return (
        <div>
            <div className='flex justify-end'>
            <button className='font-medium text-white bg-gray-800 py-2 px-4 rounded-lg my-6' onClick={() => auth.signOut()}>Sign out</button>
            </div>
            <h1 className='text-2xl font-bold'>Your posts</h1>

            <div>
                {posts.map((post) => {
                return (
                    <Message {...post} key={post.id}>
                    <div className="flex gap-4">
                        <button
                        onClick={() => deletePost(post.id)}
                        className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                        >
                        <BsTrash2Fill className="text-2xl" /> Delete
                        </button>
                        <Link href={{ pathname: "/post", query: post }}>
                        <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                            <AiFillEdit className="text-2xl" />
                            Edit
                        </button>
                        </Link>
                    </div>
                    </Message>
                );
                })}
            </div>
        </div>
    )
}