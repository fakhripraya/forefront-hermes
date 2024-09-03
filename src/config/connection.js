import { APP_ORIGIN } from "../../config/environment.js";
import { DEFAULT_ALLOW_LIST } from "../variables/general.js";

const CORSConfiguration = () => {
  const ALLOW_LIST =
    APP_ORIGIN.split(" ") || DEFAULT_ALLOW_LIST;
  return ALLOW_LIST;
};

export default CORSConfiguration;
