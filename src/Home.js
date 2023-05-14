import {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {CgProfile} from 'react-icons/cg'
import {BsSendFill} from 'react-icons/bs'
import {RiLogoutCircleLine} from 'react-icons/ri'
// import auth from './firebase-config'
import './App.css'

const Home = props => {
  const accessToken = Cookies.get('accessToken')
  const {history} = props
  const [usersData, setUsersData] = useState('')
  const userName = Cookies.get('userName')

  const getData = async () => {
    if (accessToken === undefined) {
      history.replace('/')
    }
    const fromServer = await axios.get(
      'https://socialmedia-63ed9-default-rtdb.firebaseio.com/usersData.json/',
    )
    const {data} = fromServer
    setUsersData(data)
  }

  useEffect(() => {
    getData()
  })

  const onLogOut = () => {
    Cookies.remove('accessToken')
    console.log(accessToken)
    history.replace('/login')
  }
  const onUserProfile = () => {
    history.push('/userprofile')
  }

  const onNewPost = () => {
    history.push('/post')
  }

  const firstLetter = e => {
    const fl = String(e)
    fl.toUpperCase()
    return fl[0]
  }

  if (accessToken === undefined) {
    history.replace('/login')
  }

  return (
    <div className="body">
      <h1 className="main-heading">
        {' '}
        <span className="first-part">Social</span>{' '}
        <span className="second-part">Media</span>
      </h1>
      <div className="userprofile">
        <button type="button" className="btn" onClick={onUserProfile}>
          <CgProfile /> Profile
        </button>
      </div>

      <div className="home-header">
        <button type="button" className="btn crtpost" onClick={onNewPost}>
          Post <BsSendFill />
        </button>
        <button type="button" className="btn" onClick={onLogOut}>
          <RiLogoutCircleLine />
        </button>
      </div>

      <h1 className="heading">Available Posts</h1>
      <div className="list-container">
        {Object.keys(usersData).map(key => (
          <div className="post-box">
            {usersData[key].picUrl !== false && (
              <img
                src={usersData[key].picUrl}
                className="image-con"
                alt={key}
              />
            )}
            <p className="title">{usersData[key].Title}</p>
            <p className="postdis">{usersData[key].postContent}</p>
            <p className="postedAt">Posted At: {usersData[key].Date}</p>
            <div className="name-card">
              <p className="firstLetter">
                {firstLetter(usersData[key].username)}
              </p>
              <h1 className="userName">{usersData[key].username}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
