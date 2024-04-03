import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.scss'


export default function Videos() {
  return (
    <section className='video'>
      <p className='video-title'>Organic Only</p>
      <p className='video-sub-title'>Everyday Fresh & Clean</p>
      <p className='video-text'>
        Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry's standard
        dummy text ever since the
      </p>
      <FontAwesomeIcon icon={faPlay} className='icon-play' />
    </section>
  )
}
