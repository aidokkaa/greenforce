import { loginStart,loginFailure,loginSuccess } from "./userSlice";
import { publicRequest } from "../requestMethods";

export const login=async(dispatch,user)=>{
    dispatch(loginStart());
    try{
        const res = await publicRequest.post("/auth/login",user);
        console.log(res.data)
        dispatch(loginSuccess(res.data))
    }catch(err){
        console.error(err);
        dispatch(loginFailure());
    }
};

