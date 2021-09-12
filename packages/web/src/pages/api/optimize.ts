import { NextApiHandler } from "next";
const { optimize } = require("svgo");

const api: NextApiHandler = async (req, res) => {
  console.log("api hit");
  // Insert API endpoint logic here
  //   console.log(req.body);
  const svgString = req.body;

  console.log(svgString);
  const output = optimize(svgString);
  console.log(output.data);

  return res.json({ data: output.data });
};

export default api;
