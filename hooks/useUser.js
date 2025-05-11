import { useDispatch, useSelector } from "react-redux";
import {
  clearUserData,
  setUserData,
  updateUserData,
} from "../store/slices/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  return {
    userData: userData,
    saveUserData: (data) => dispatch(setUserData(data)),
    updateUserData: (data) => dispatch(updateUserData(data)),
    clearUserData: () => dispatch(clearUserData()),
  };
};
