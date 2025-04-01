export const signup = async (req, res) => {
  // Todo: Implement signup logic
  res.status(201).json({ message: "User signed up successfully!" });
};

export const signin = async (req, res) => {
  // Todo: Implement signin logic
  res.status(200).json({ message: "User signed in successfully!" });
};

export const signout = async (req, res) => {
  // Todo: Implement signout logic
  res.status(200).json({ message: "User signed out successfully!" });
};
