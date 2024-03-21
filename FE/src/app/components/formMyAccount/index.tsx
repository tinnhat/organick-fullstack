'use client'
import useFetch from '@/app/utils/useFetch'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {}

export default function FormMyAccount({}: Props) {
  const { data: session } = useSession()
  const fetchAPI = useFetch()
  const [changePassword, setChangePassword] = useState(false)
  const [file, setFile] = useState<any>()
  const handleChange = (e: any) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // setFile(selectedFile)
      const fileUrl = URL.createObjectURL(selectedFile)
      setFile(fileUrl)
      // Use fileUrl as needed
    }
  }

  const handleChangeProfile = async () => {
    const res = await fetchAPI(`/users/${session?.user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullname: 'change name ne' }),
    })
  }

  return (
    <div className='box'>
      <p className='box__title'>My Account</p>
      {/* <form action=''> */}
      {changePassword ? (
        <>
          <div className='input-box'>
            <label htmlFor='password'>Old Password</label>
            <br />
            <input
              role='presentation'
              autoComplete='off'
              type='password'
              id='password'
              placeholder='Enter your password'
            />
          </div>
          <div className='input-box'>
            <label htmlFor='rePassword'>New Password</label>
            <br />
            <input
              role='presentation'
              placeholder='Re-type your password'
              autoComplete='off'
              type='password'
              id='rePassword'
            />
          </div>
          <div className='input-box'>
            <label htmlFor='rePassword'>Confirm New Password</label>
            <br />
            <input
              role='presentation'
              placeholder='Re-type your password'
              autoComplete='off'
              type='password'
              id='rePassword'
            />
          </div>
        </>
      ) : (
        <>
          <p className='label-avatar'>Avatar</p>
          <div className='preview-avatar'>
            <label htmlFor='file-upload' className='custom-file-upload'>
              <FontAwesomeIcon className='icon' icon={faUpload} />
              Upload
            </label>
            <input id='file-upload' type='file' onChange={handleChange} />
            <Image
              style={{
                borderRadius: '50%',
                marginTop: '10px',
                marginBottom: '10px',
              }}
              alt=''
              width={100}
              height={100}
              src={file ? file : '/assets/img/avatar.jpg'}
            />
            {file && (
              <p className='clear-img' onClick={() => setFile('')}>
                Clear image
              </p>
            )}
          </div>

          <div className='input-box'>
            <label htmlFor='fullname'>Full Name</label>
            <br />
            <input
              role='presentation'
              autoComplete='off'
              type='text'
              id='fullname'
              placeholder='Enter your full name'
            />
          </div>
          <div className='input-box'>
            <label htmlFor='email'>Email</label>
            <br />
            <input
              role='presentation'
              autoComplete='off'
              type='email'
              id='email'
              placeholder='Enter your email'
            />
          </div>
        </>
      )}

      <button onClick={handleChangeProfile} className='btn-update'>
        Update Profile
      </button>
      {changePassword ? (
        <p
          className='btn-text'
          onClick={e => {
            e.preventDefault()
            setChangePassword(false)
          }}
        >
          Go back to my information
        </p>
      ) : (
        <p
          className='btn-text'
          onClick={e => {
            e.preventDefault()
            setChangePassword(true)
          }}
        >
          Change Password
        </p>
      )}
      {/* </form> */}
    </div>
  )
}
