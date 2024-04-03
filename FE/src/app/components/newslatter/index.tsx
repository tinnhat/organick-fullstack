import React from 'react'
import './style.scss'


export default function NewLatter() {
  return (
    <section className='newsLatteer'>
      <div className='container'>
        <div className='newslatteer-container'>
          <p className='newslatter-text'>Subscribe to our Newsletter</p>
          <div className='newslatter-box'>
            <input type='email' className='newslatter-input' placeholder='Your email address' />
            <button className='btn btn-subscribe'>Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  )
}
