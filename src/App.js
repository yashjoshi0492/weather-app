import { useEffect, useState } from "react";
import "./App.css";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import BigNumber from "bignumber.js";
import { Forecast } from "./Forecast.js";
import { useDispatch } from "react-redux";

//in case of change the limit, change here
const limit = 5;

function App() {
  const [cityList, setCityList] = useState([]);
  const [enteredCity, setEnteredCity] = useState("");
  const [forecastCity, setforecastCity] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  // const [recentLocationLoader, setRecentLocationLoader] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("citylist") != null) {
      setCityList(JSON.parse(localStorage.getItem("citylist")));
      forecast(JSON.parse(localStorage.getItem("citylist"))[0]);
    }
  }, []);

  const dispatch = useDispatch();
  const fetchCityWeatherDetails = (city) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c51223c219d6aec8cb8c5210449bd859`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const addCity = async () => {
    try {
      let weatherDetail = await fetchCityWeatherDetails(enteredCity);
      //when citylist limit reaches 8, remove first element from the city
      if (cityList?.length === limit) {
        cityList.shift();
      }
      forecast(weatherDetail);
      let tempList = [...cityList, weatherDetail];
      setCityList(tempList.reverse());
      setEnteredCity("");
      localStorage.setItem("citylist", JSON.stringify(tempList.reverse()));
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Try some other city name",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const removeCity = (removedCity) => {
    let tempCityList = cityList.filter(
      (city) => city.name !== removedCity.name
    );
    setCityList([...tempCityList]);
  };

  const convertKelvinToCelsius = (kelvin) => {
    return `${new BigNumber(kelvin).minus(273.15)} C  `;
  };

  const fetchForecastDetails = (city) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=3&appid=c51223c219d6aec8cb8c5210449bd859`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const forecast = async (city) => {
    let forecastData = await fetchForecastDetails(city.name);
    setSelectedCity(city.name);
    // let templist = cityList.map((city) => {
    //   if (city.name === forecastData.city.name) {
    //     city["list"] = forecastData.list;
    //   }
    //   return city;
    // });
    // console.log(`forecastData`, forecastData);
    setforecastCity(forecastData);
    dispatch({ type: "SET_FORECAST", payload: forecastData });
    // setCityList(templist);
  };

  // const fetchandUpdateCity = async (city) => {
  //   try {
  //     let weatherDetail = await fetchCityWeatherDetails(city);
  //     //when citylist limit reaches 8, remove first element from the city
  //     let tempList = cityList.map((city) => {
  //       if (city.name === weatherDetail.name) {
  //         city = weatherDetail;
  //       }
  //       return city;
  //     });
  //     setCityList(tempList);
  //   } catch (err) {
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Try some other city name",
  //       icon: "error",
  //       confirmButtonText: "Ok",
  //     });
  //   } finally {
  //     setRecentLocationLoader(0);
  //   }
  // };

  return (
    <>
      <Container>
        <h1 className="d-flex justify-content-center my-4">Weather APP</h1>
        <hr />
        <Row className="my-4">
          <Col xs={4} className="wrapper">
            <Row>
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Type city name"
                  className="m-2 text-capitalize"
                  aria-label="Type city name"
                  value={enteredCity}
                  onChange={(e) => {
                    setEnteredCity(e?.target?.value);
                  }}
                />
                <i
                  className="bi bi-plus-lg plus-icon m-2"
                  onClick={addCity}
                ></i>
              </Form>
            </Row>
            <hr />
            <Row className="m-1">
              <p className="recent-location">Recent locations</p>
              <hr />
              <div className="m-1">
                {cityList.map((city, key) => {
                  return (
                    <div key={key}>
                      <div
                        className="d-flex justify-content-between citylist"
                        onClick={() => forecast(city)}
                      >
                        <div>
                          {city.name}
                          {" - "}
                          <span>{convertKelvinToCelsius(city.main?.temp)}</span>
                          <span>{city.weather[0]?.main}</span>
                        </div>
                        <div>
                          <span>
                            {/* <i
                              className="bi bi-arrow-repeat m-1"
                              onClick={(event) => {
                                event.stopPropagation();
                                setRecentLocationLoader(key);
                                fetchandUpdateCity(city.name);
                              }}
                            ></i> */}
                            <i
                              className="bi bi-x m-1"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeCity(city);
                              }}
                            ></i>
                          </span>
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
              {cityList.length ? (
                <div className="clear-button">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setforecastCity({});
                      dispatch({ type: "SET_FORECAST", payload: {} });
                      setCityList([]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              ) : null}
            </Row>
          </Col>
          <Forecast
            forecast={forecast}
            cityList={cityList}
            // forecastCity={forecastCity}
            selectedCity={selectedCity}
            convertKelvinToCelsius={convertKelvinToCelsius}
          />
        </Row>
      </Container>
    </>
  );
}

export default App;
