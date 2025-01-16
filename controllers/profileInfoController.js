// edit profile info using the OKTA auth 2.0 api

// const { OktaAuth } = require('@okta/okta-auth-js');

// exports.editProfileInfo = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         user.name = req.body.name;
//         user.email = req.body.email;
//         user.profilePic = req.body.profilePic;
//         await user.save();
//         res.status(200).json(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error updating profile info');
//     }
// }

// // controllers/userController.js
// const oktaClient = require('../config/oktaClient');

// const editProfileController = async (req, res) => {

//   try {
//     const  userId  = req.params.userId; // Assuming the userId is part of the authenticated request
//     const { firstName, lastName, email, website, imageUrl, nickname } = req.body;
//     // console.log(oktaClient);
//     console.log('Editing profile...', req.params.userId);

//     console.log('...............................................................');

//     // Fetch the Okta user
//     const oktaUser = await oktaClient.userApi.getUser( {userId}  );
//     console.log('Fetched Okta user:', oktaUser.profile);

//     console.log('...............................................................');

//     // Update user profile
//     oktaUser.profile.firstName = firstName || oktaUser.profile.firstName;
//     oktaUser.profile.lastName = lastName || oktaUser.profile.lastName;
//     oktaUser.profile.email = email || oktaUser.profile.email;
//     oktaUser.profile.website = website || oktaUser.profile.website;
//     oktaUser.profile.imageUrl = imageUrl || oktaUser.profile.imageUrl;
//     oktaUser.profile.nickname = nickname || oktaUser.profile.nickname;

//     // Update the user profile in Okta
//     // await oktaClient.userApi.updateUser({
//     //   userId,
//     //   body: { profile: oktaUser.profile },
//     // });
//     res.status(200).json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// };

// module.exports = { editProfileController };

const fetch = require("node-fetch"); // Ensure you have node-fetch installed (v2 or v3 based on your Node.js version)
const yourOktaDomain = process.env.OKTA_DOMAIN; // Replace with your Okta domain
const apiKey = process.env.OKTA_READ_API_TOKEN; // Replace with your API key

const editProfileController = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the userId is part of the route parameters
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { firstName, lastName, email, website, imageUrl, nickname } =
      req.body;

    console.log(req.body);

    // Prepare the payload for the update request
    const body = {
      profile: {
        ...req.body, // Include all keys dynamically under `profile`
      },
    };
    // Make the API call to update the user
    const response = await fetch(
      `https://${yourOktaDomain}/api/v1/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `SSWS ${apiKey}`, // SSWS is the prefix for Okta API keys
        },
        body: JSON.stringify(body),
      }
    );

    // Check the response status
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating user in Okta:", errorData);
      return res.status(response.status).json({
        error: "Failed to update profile",
        details: errorData,
      });
    }

    const updatedUser = await response.json();
    console.log("Updated user in Okta:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getProfileData = async (req, res) => {
  const yourOktaDomain = process.env.OKTA_DOMAIN; // Replace with your Okta domain
  const apiKey = process.env.OKTA_READ_API_TOKEN; // Replace with your API key
  const userId = req.params.userId;
  const resp = await fetch(`https://${yourOktaDomain}/api/v1/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `SSWS ${apiKey}`,
    },
  });

  const data = await resp.text();
  // console.log(data);

  data
    ? res.status(200).json(data)
    : res.status(404).json({ error: "User not found" });
};

const editProfileControllers = async (req, res) => {
  // console.log(req.body);
  res.status(200).json({ message: "Profile updated successfully" });
};

module.exports = {
  editProfileController,
  editProfileControllers,
  getProfileData,
};
