import React from 'react'
import './style.scss'
type Props = {}

export default function Blog({}: Props) {
  return (
    <section className='blog'>
      <div className='container'>
        <div className='blog-container' data-aos='fade-up' data-aos-duration='200'>
          <p className='blog-title'>News</p>
          <div className='blog-header'>
            <p className='blog-header-text'>Discover weekly content about organic food, & more</p>
            <button className='btn btn-blog'>More News</button>
          </div>
          <div className='blog-content' data-aos='fade-up' data-aos-duration='500'>
            <div className='blog-box bkg-vegetable' data-aos='fade-up' data-aos-duration='1000'>
              <div className='blog-circle-date'>
                25
                <br />
                Nov
              </div>
              <div className='blog-box-content'>
                <p className='blog-author'>By Rachi Card</p>
                <p className='blog-box-content-title'>The Benefits of Vitamin D & How to Get It</p>
                <p className='blog-box-content-text'>
                  Simply dummy text of the printing and typesetting industry. Lorem Ipsum
                </p>
                <button className='btn btn-blog-box'>Read More</button>
              </div>
            </div>
            <div className='blog-box bkg-tomato' data-aos='fade-up' data-aos-duration='1000'>
              <div className='blog-circle-date'>
                25
                <br />
                Nov
              </div>
              <div className='blog-box-content'>
                <p className='blog-author'>By Rachi Card</p>
                <p className='blog-box-content-title'>The Benefits of Vitamin D & How to Get It</p>
                <p className='blog-box-content-text'>
                  Simply dummy text of the printing and typesetting industry. Lorem Ipsum
                </p>
                <button className='btn btn-blog-box'>Read More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
