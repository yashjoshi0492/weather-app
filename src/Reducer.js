const setForecast = (state = {}, action) => {
  switch (action.type) {
    case "SET_FORECAST":
      return {
        forecast: action.payload,
      };
    default:
      return state;
  }
};

export default setForecast;
