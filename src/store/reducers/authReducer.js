import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  username: "",
  id: "",
  avatar: "",
  createDateTime: null,
  isLoggedIn: false,
  progress: 0,
  isRegisterComplete: false,
  socket: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PHONENUMBER_ENTERED:
      return updateObject(state, { progress: 1 });

    case actionTypes.UPDATE_USER:
      console.log(action);
      console.log(action.firstName);
      return updateObject(state, {
        firstName: action.firstName,
        lastName: action.lastName,
        username: action.username,
        avatar: action.avatar,
      });

    case actionTypes.LOGIN:
      if (action.needToRegister) {
        console.log("You need to register");
        return updateObject(state, { progress: 2 });
      } else {
        console.log(
          "You don't need to register " +
          action.userFirstName +
          " " +
          action.userLastName
        );
        return updateObject(state, {
          progress: 3,
          firstName: action.userFirstName,
          lastName: action.userLastName,
          phoneNumber: action.userPhone,
          username: action.username,
          id: action.id,
          createDateTime: action.createDateTime,
          avatar: action.avatar,
          isLoggedIn: true,
          isRegisterComplete: true,
        });
      }

    case actionTypes.ISLOGGEDIN:
      return updateObject(state, {
        isLoggedIn:false
      })
    case actionTypes.REGISTER:
      return updateObject(state, {
        firstName: action.firstName,
        lastName: action.lastName,
        phoneNumber: action.phoneNumber,
        username: action.username,
        id: action.id,
        createDateTime: action.createDateTime,
        avatar: action.avatar,
        progress: 3,
        isLoggedIn: true,
        isRegisterComplete: true,
      });

    case actionTypes.LOGOUT:
      return updateObject(state, {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        username: "",
        id: "",
        avatar: "",
        createDateTime: "",
        isLoggedIn: false,
        progress: 0,
        isRegisterComplete: false,
      });

    case actionTypes.DECREASE_PROGRESS_LEVEL:
      return updateObject(state, {
        progress: state.progress - 1,
        phoneNumber: "",
      });

    case actionTypes.INCREASE_PROGRESS_LEVEL:
      return updateObject(state, {
        progress: state.progress + 1,
      });

    case actionTypes.SET_SOCKET:
      return updateObject(state, {
        socket: action.socket,
      });

    default:
      return state;
  }
};

export default authReducer;
