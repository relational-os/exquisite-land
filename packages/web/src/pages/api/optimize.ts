import { NextApiHandler } from "next";
import { optimize } from "svgo";

const api: NextApiHandler = async (req, res) => {
  console.log("api hit");
  // Insert API endpoint logic here
  //   console.log(req.body);
  const svgString = req.body;

  const svgOutput = optimize(svgString, {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // or disable plugins
            removeViewBox: false,
            collapseGroups: false,
          },
        },
      },
    ],
  }).data;

  return res.json({ data: svgOutput });
};

export default api;
