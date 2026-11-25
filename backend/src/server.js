const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
