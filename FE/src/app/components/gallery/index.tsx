import React from 'react'
import './style.scss'


export default function Gallery() {
  return (
    <section className='gallery'>
      <div className='gallery-container' data-aos='fade-up' data-aos-duration='1000'>
        <div className='box-gallery orange'>
          <button className='btn btn-gallery'>Organic Juice</button>
        </div>
        <div className='box-gallery food'>
          <button className='btn btn-gallery'>Organic Food</button>
        </div>
        <div className='box-gallery cookis'>
          <button className='btn btn-gallery'>Nuts Cookis</button>
        </div>
      </div>
    </section>
  )
}
