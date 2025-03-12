const UserProfile = require("../models/userProfileModel");

// Create User Profile or update existing
const createUserProfile = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (userProfile) {
      // Update existing user profile
      userProfile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      res.status(200).json(userProfile);
    } else {
      // Create new user profile
      userProfile = new UserProfile({
        userId: req.user.id,
        ...req.body,
      });
      const savedProfile = await userProfile.save();
      res.status(201).json(savedProfile);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating or updating user profile", error });
  }
};

// Get User Profile by User ID
const getUserProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(200).json({ message: "User profile not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

// Delete User Profile
const deleteUserProfile = async (req, res) => {
  try {
    const deletedProfile = await UserProfile.findOneAndDelete({
      userId: req.user.id,
    });
    if (!deletedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user profile", error });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.params.id }); // Query by userId instead of _id

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserProfileById,
};
