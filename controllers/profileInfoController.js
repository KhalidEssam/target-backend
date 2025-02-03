// edit profile info using the OKTA auth 2.0 api

const { OktaAuth } = require("@okta/okta-auth-js");
const fetch = require("node-fetch"); // Ensure you have node-fetch installed (v2 or v3 based on your Node.js version)
const yourOktaDomain = process.env.OKTA_DOMAIN; // Replace with your Okta domain
const apiKey = process.env.OKTA_READ_API_TOKEN; // Replace with your API key
const appId = process.env.OKTA_CLIENT_ID;


const editProfileController = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the userId is part of the route parameters
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // console.log("Request body:", req.body);

    // Step 1: Retrieve the current user profile from Okta
    const getUserResponse = await fetch(
      `https://${yourOktaDomain}/api/v1/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `SSWS ${apiKey}`, // SSWS is the prefix for Okta API keys
        },
      }
    );

    if (!getUserResponse.ok) {
      const errorData = await getUserResponse.json();
      console.error("Error fetching user profile from Okta:", errorData);
      return res.status(getUserResponse.status).json({
        error: "Failed to fetch user profile",
        details: errorData,
      });
    }

    const currentUser = await getUserResponse.json();
    const currentProfile = currentUser.profile;

    // Step 2: Merge existing profile with updates from req.body
    const updatedProfile = {
      ...currentProfile,
      ...req.body, // Override only the keys provided in req.body
    };

    const body = { profile: updatedProfile };

    // Step 3: Send the updated profile to Okta
    const updateResponse = await fetch(
      `https://${yourOktaDomain}/api/v1/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `SSWS ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("Error updating user in Okta:", errorData);
      return res.status(updateResponse.status).json({
        error: "Failed to update profile",
        details: errorData,
      });
    }

    const updatedUser = await updateResponse.json();
    // console.log("Updated user in Okta:", updatedUser);

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


const edit_User_Profile_App_Asignment_Controller = async (req, res) => {

  try {
    const userId = req.params.userId; // Assuming the userId is part of the route parameters
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Step 1: Retrieve the current user profile from Okta
    const getUserResponse = await fetch(
      `https://${yourOktaDomain}/api/v1/apps/${appId}/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `SSWS ${apiKey}`, // SSWS is the prefix for Okta API keys
        },
      }
    );
    // console.log(getUserResponse);
    const data = await getUserResponse.json();

    if (!getUserResponse.ok) {
      const errorData = await getUserResponse.json();
      console.error("Error fetching user profile from Okta:", errorData);
      return res.status(getUserResponse.status).json({
        error: "Failed to fetch user profile",
        details: errorData,
      });
    }
    const currentProfile = data.profile;

  /////////////////////////////////////////////////////

    console.log("Request body:", req.body);

    // // Step 2: Merge existing profile with updates from req.body
    const updatedProfile = {
      ...currentProfile,
      ...req.body, // Override only the keys provided in req.body
    };

    const body = { profile: updatedProfile };

    // Step 3: Send the updated profile to Okta
    const updateResponse = await fetch(
      `https://${yourOktaDomain}/api/v1/apps/${appId}/users/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `SSWS ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("Error updating user in Okta:", errorData);
      return res.status(updateResponse.status).json({
        error: "Failed to update profile",
        details: errorData,
      });
    }

    const updatedUser = await updateResponse.json();
    console.log("Updated user in Okta:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });

  /////////////////////////////////////////////////
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }


};

const getProfileDatas = async (req, res) => {
  const yourOktaDomain = process.env.OKTA_DOMAIN; // Replace with your Okta domain
  const apiKey = process.env.OKTA_READ_API_TOKEN; // Replace with your API key
  const userId = req.params.userId;
  const resp = await fetch(
    `https://${yourOktaDomain}/api/v1/users/${userId}?expand=profile`,
    {
      method: "GET",
      headers: {
        Authorization: `SSWS ${apiKey}`,
      },
    }
  );

  const data = await resp.text();
  // console.log(data);

  data
    ? res.status(200).json(data)
    : res.status(404).json({ error: "User not found" });
};
/////////////////
const oktaClient = require("../config/oktaClient");

const getProfileData = async (req, res) => {
  const userId = req.params.userId;

  try {
    
    const user = await oktaClient.userApi.getUser({ userId });
    console.log("Fetched Okta user:", user.profile);
    Profile = Object.fromEntries(
      Object.entries(user.profile).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
    // res.json(Profile);
    res.status(200).json(Profile);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/////////////////////

const editProfileControllers = async (req, res) => {
  // console.log(req.body);
  res.status(200).json({ message: "Profile updated successfully" });
};

module.exports = {
  editProfileController,
  editProfileControllers,
  edit_User_Profile_App_Asignment_Controller,
  getProfileData,
  getProfileDatas,
};
