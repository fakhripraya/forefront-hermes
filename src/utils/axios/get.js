import axios from "axios";
import {
  Axios,
  cancelSourceToken,
} from "../../config/axios.js";
import { GET } from "../../variables/general.js";

export const GETRequest = async (config) => {
  // init result
  let result = {
    httpResponse: null,
    httpCode: null,
    error: false,
    errContent: null,
  };
  // creates the cancel token source
  const cancelSource = cancelSourceToken();
  // Start timing now
  console.time(config.logTitle);

  try {
    const res = await Axios(config.endpoint)({
      method: GET,
      url: config.url,
      headers: config.headers,
      cancelToken: cancelSource.token,
    });
    result.response = res.data;
    result.httpCode = res.status;
  } catch (err) {
    if (err.response) {
      if (axios.isCancel(err)) cancelSource.cancel();
      result.error = true;
      result.errContent = err.response.data;
      result.httpCode = err.response.status;
    } else {
      result.httpCode = 500;
    }
  }

  // End timing now
  console.timeEnd(config.logTitle);

  return result;
};
