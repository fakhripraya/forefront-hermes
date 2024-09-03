import { APP_OLYMPUS_SERVICE_BASE_URL } from "../../config/environment.js";
import {
  X_SID,
  AUTHORIZATION,
  POST_CHECK_AUTH,
} from "../variables/general.js";
import { URL_CHECK_AUTH_AND_REFRESH_TOKEN } from "../variables/url.js";
import { POSTRequest } from "./axios/post.js";

export const checkAuth = async (req, res, next) => {
  const refreshToken = req.body["refreshToken"];
  const sid = req.body["sid"];
  const token = req.headers["authorization"];

  // get OAUTH token
  const response = await POSTRequest({
    endpoint: APP_OLYMPUS_SERVICE_BASE_URL,
    url: URL_CHECK_AUTH_AND_REFRESH_TOKEN,
    headers: {
      [X_SID]: `${sid}`,
      [AUTHORIZATION]: token,
    },
    data: {
      credentialToken: {
        refreshToken: refreshToken,
      },
    },
    logTitle: POST_CHECK_AUTH,
  });

  if (!response)
    return res.status(404).send(UNIDENTIFIED_ERROR);
  if (response.httpCode === 500) return res.sendStatus(500);
  if (response.error)
    return res
      .status(response.httpCode)
      .send(response.errContent);

  next();
};
