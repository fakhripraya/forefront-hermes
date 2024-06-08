const defaultRoute = (app, protoClient) => {
  app.get(`/v1/`, async (req, res) => {
    protoClient.textMessaging(
      {
        content: req.body["content"],
      },
      (err, response) => {
        if (err) return res.status(500).end();
        return res.status(201).json(response);
      }
    );
  });
};

export default defaultRoute;
