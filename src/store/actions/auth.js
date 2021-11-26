import * as actionTypes from "./actionTypes";

export const login = (isRegister, user) => {
  let needToRegister = true;
  let userFirstName;
  let userLastName;
  let username;
  let id;
  let userPhone;
  let createDateTime;
  let avatar;
  if (isRegister === true) {
    needToRegister = false;
    userFirstName = user.firstName;
    userLastName = user.lastName;
    userPhone = user.phoneNumber;
    username = user.username;
    id = user.id;
    createDateTime = user.createDateTime;
    avatar = user.avatar;
  }
  if (!needToRegister) {
    return {
      type: actionTypes.LOGIN,
      needToRegister,
      userFirstName,
      userLastName,
      username,
      userPhone,
      id,
      createDateTime,
      avatar,
    };
  }
  return {
    type: actionTypes.LOGIN,
    needToRegister,
  };
};

export const updateUserData = (firstName, lastName, username, avatar) => {
  console.log("[auth.js] first name:",firstName);
  return {
    type: actionTypes.UPDATE_USER,
    firstName,
    lastName,
    username,
    avatar,
  }
}

export const setSocket = (socket) => {
  return {
    type: actionTypes.SET_SOCKET,
    socket,
  }
}

export const phoneNumberEntered = () => {
  return {
    type: actionTypes.PHONENUMBER_ENTERED,
  };
};

export const registerUser = (firstName, lastName, phoneNumber, username, id, createDateTime, avatar) => {
  return {
    type: actionTypes.REGISTER,
    firstName,
    lastName,
    phoneNumber,
    username,
    id,
    createDateTime,
    avatar,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

export const decreaseProgressLevel = () => {
  return {
    type: actionTypes.DECREASE_PROGRESS_LEVEL,
  };
};

export const increaseProgressLevel = () => {
  return {
    type: actionTypes.INCREASE_PROGRESS_LEVEL,
  };
};
