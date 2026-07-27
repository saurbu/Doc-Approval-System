import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddEmployee = () => {
  const navigate = useNavigate()
  const handSubmit = (e)=>{
    e.preventDefault()

    const formData = new FormData(e.target)

    axios.post('http://localhost:3000/api/admin/create-employee', formData)
    .then((res) =>{
      navigate('/employees')
    })
    .catch((err)=>{
      console.log(err);
      
    })
  }

  return (
    <div className='ml-3'>
      <form action="" onSubmit={handSubmit} className='flex flex-col bg-red-300 gap-3'>
        <input type="text" placeholder=''/>
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </form>
    </div>
  )
}

export default AddEmployee
