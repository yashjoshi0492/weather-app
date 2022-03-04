import { Row, Col, Image, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

const getIconName = (value) => {
  let icon = "Clear.svg";
  switch (value?.toLowerCase()) {
    case "rain":
      icon = "rain.svg";
      break;
    case "clouds":
      icon = "Clouds.svg";
      break;
    case "snow":
      icon = "snow.svg";
      break;
    default:
      break;
  }
  return icon;
};

const getDate = (timestamp) => {
  var a = new Date(timestamp * 1000);
  let date = a.getDate();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = a.getDay();
  return { date, day: days[day] };
};

export const Forecast = ({
  forecast,
  cityList,
  // forecastCity,
  selectedCity,
  convertKelvinToCelsius,
}) => {
  const forecastCity = useSelector((state) => state.forecast);

  return (
    <Col xs={7} className="wrapper">
      <Row>
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <Row>
              {cityList.map((city, key) => {
                if (city.name === selectedCity) {
                  return (
                    <div key={key}>
                      <Row>
                        <i
                          className="bi bi-arrow-repeat m-1"
                          onClick={(event) => {
                            event.stopPropagation();
                            forecast(city);
                          }}
                        ></i>
                      </Row>
                      <Col xs={4}>
                        <Image
                          className="weather-icon"
                          src={getIconName(city.weather[0]?.main)}
                          rounded
                        />
                      </Col>
                      <Col key={key}>
                        <Card.Title>
                          {convertKelvinToCelsius(city.main?.temp)}
                        </Card.Title>
                        <Card.Text>{city.weather?.description}</Card.Text>
                        <Card.Text>
                          Wind : {city.wind?.speed} ms {city.wind?.deg} deg
                        </Card.Text>
                        <Card.Text>Pressure : {city.main?.pressure}</Card.Text>
                      </Col>
                    </div>
                  );
                }
              })}
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <Row className="my-4">
        {forecastCity?.list?.map((data, key) => {
          return (
            <Col key={key}>
              <Row>
                <div className="text-center">{getDate(data.dt).date}</div>
              </Row>
              <Row>
                <div className="text-center">{getDate(data.dt).day}</div>
              </Row>
              <Row className="d-flex justify-content-center">
                <Image
                  className="weather-icon"
                  src={getIconName(data.weather[0]?.main)}
                  rounded
                />
              </Row>
              <Row>
                <div className="text-center">{data.temp.day} C</div>
              </Row>
            </Col>
          );
        })}
      </Row>
    </Col>
  );
};
