import React from 'react'
import Users from '../../../components/Chatpage/Users'

function Home() {
  return (
    <div>
      <div className='w-full h-full bg-[#fff] flex flex-row'>
        <div className='w-[5%] h-full border-r-2 border-black-300'>
          

        </div>
        <div className='w-[30%] h-[100%]'>
        <Users/>

        </div>

      </div>
    </div>
  )
}

export default Home