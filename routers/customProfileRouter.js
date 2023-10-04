const { authentication } = require("../utils.js");
const User = require("../model/User.js");
app.get("/me", authentication, async (req, res) => {
  try {
    const userId = req.me;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
