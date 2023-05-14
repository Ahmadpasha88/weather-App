import axios from 'axios'
import {Rings} from 'react-loader-spinner'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BsFillHeartFill} from 'react-icons/bs'
import {useState} from 'react'

import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import './App.css'

function App() {
  const apiKey = '6bcbcd09f2b4be0fcbedfacfe3112f38'
  const [inputCity, setInputCity] = useState('')
  const [data, setData] = useState({})
  const [test, setTest] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  let fav = localStorage.getItem('fav')
  fav = JSON.parse(fav)
  if (fav === null) {
    fav = []
  }

  // const [list, setList] = useState(localStorage.get('items'))
  const getWetherDetails = cityName => {
    if (!cityName) return
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    axios
      .get(apiURL)
      .then(res => {
        console.log('response', res.data)
        setData(res.data)
      })
      .catch(err => {
        alert(
          'City not found or Server Error \n ***Please Enter a valid city Name***',
        )
        console.log('err', err)
      })
  }

  const handleChangeInput = e => {
    setInputCity(e.target.value)
  }
  const addToList = async () => {
    if (inputCity !== '') {
      fav.push(inputCity)
      localStorage.setItem('fav', JSON.stringify(fav))
      setTest(test + 1)
      setInputCity('')
      console.log(fav)
    }
  }

  const handleSearch = async () => {
    await setIsLoading(!isLoading)
    console.log(isLoading)
    await getWetherDetails(inputCity)
    await setIsLoading(false)
    await setInputCity('')
  }

  return (
    <div className="col-12">
      <div className="wetherBg col-sm-12">
        <h1 className="heading">Weather App</h1>

        <div className="d-grid gap-3 col-4 mt-4">
          <input
            type="text"
            className="form-control"
            value={inputCity}
            onChange={handleChangeInput}
            placeholder="Enter Your City"
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-warning text-white"
            onClick={addToList}
          >
            Add To <BsFillHeartFill color="red" />
          </button>
        </div>
      </div>
      <div className="bg-light">
        <h3 className="fav-heading">
          <BsFillHeartFill color="red" width="30px" height="30px" /> List
        </h3>
        <div className="d-flex flex-row justify-content-between flex-wrap">
          <ul className="d-flex flex-row">
            {fav.map(e => (
              <li key={e} className="p-2 fav-list">
                <button
                  className="btn btn-secondary text-white"
                  type="button"
                  onClick={async () => {
                    await getWetherDetails(e)
                    console.log(e)
                    setTest(test + 1)
                  }}
                >
                  {e}
                </button>
              </li>
            ))}
          </ul>
          {fav !== [] ? (
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                localStorage.removeItem('fav')
                setTest(0)
              }}
            >
              Clear List
            </button>
          ) : (
            <p>You Can ADD YOUR FAV</p>
          )}
        </div>

        {isLoading ? (
          <Rings color="#00BFFF" height={80} width={80} />
        ) : (
          Object.keys(data).length > 0 && (
            <div className="col-md-12 text-center mt-5">
              <div className="shadow rounded wetherResultBox">
                <img
                  className="weathorIcon"
                  alt="weather-icon"
                  src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
                />

                <h5 className="weathorCity">{data?.name}</h5>
                <h6 className="weathorTemp">
                  {(data?.main?.temp - 273.15).toFixed(2)}°C
                </h6>
              </div>
              <div className="popup-container">
                <Popup
                  modal
                  trigger={
                    <button
                      type="button"
                      className="trigger-button btn btn-info text-white mb-4 mt-3"
                    >
                      Detailed View
                    </button>
                  }
                >
                  {close => (
                    <>
                      <div className="detail-container">
                        <h5 className="weathorCity text-center text-dark detail-main">
                          Weather Forecast
                        </h5>
                        <h5 className="weathorCity text-center text-success detail-main">
                          {data?.name}{' '}
                          <span className="text-danger">
                            {data?.sys?.country}
                          </span>
                        </h5>
                        <h6 className="weathorTemp detail-heading">
                          Current Temp: {(data?.main?.temp - 273.15).toFixed(2)}
                          °C
                        </h6>
                        <hr />
                        <h6 className="weathorTemp detail-heading">
                          Humidity: {data?.main?.humidity}%
                        </h6>
                        <hr />
                        <h6 className="weathorTemp detail-heading">
                          Pressure: {data?.main?.pressure} hPa
                        </h6>
                        <hr />
                        <h6 className="weathorTemp detail-heading">
                          Cloud Cover: {data?.clouds?.all}%
                        </h6>
                        <hr />
                      </div>
                      <button
                        type="button"
                        className="trigger-button btn btn-dark text-white"
                        onClick={() => close()}
                      >
                        Close
                      </button>
                    </>
                  )}
                </Popup>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default App
