'use client'

import {useState, useEffect} from 'react'
import Profile from '@components/Profile'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'

const MyProfile = () => {
  
  const router = useRouter()
  const {data: session} = useSession()
  
  const [posts, setPosts] = useState([])



  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${
        session?.user.id
      }/posts`);
      const data = await response.json();

      setPosts(data)
    }
    if(session?.user.id) fetchPosts()
  },[])
  const handleEdit = (post) =>{
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete?")

    if (!hasConfirmed) return

    try {
      const response = await fetch(`/api/prompt/${post._id}`,{
          method: 'DELETE',
          body: JSON.stringify({
              prompt: post.prompt,
              tag: post.tag
          })
      })

      const filteredPosts = posts.filter((p)=>p._id !== post._id)

      setPosts(filteredPosts)
  } catch(error){
      alert(error)
      console.log(error)
  } 
  }
  return (
    <Profile 
      name='My'
      desc='Welcome to your personalized profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile