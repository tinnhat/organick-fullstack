import React from 'react'
import './style.scss'
type Props = {}

export default function NewLatter({}: Props) {
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
