import { checkAuth } from "../utils/middleware.js";

const defaultRoute = (app, protoClient) => {
  app.get(`/v1/`, async (req, res) => {
    return res.status(200);
  });

  app.post(`/v1/`, checkAuth, async (req, res) => {
    protoClient.textMessaging(
      {
        sessionId: req.body["sessionId"],
        content: req.body["content"],
      },
      (err, response) => {
        if (err) return res.status(500).send(err);
        return res.status(201).json(response);
      }
    );
  });
};

export default defaultRoute;
