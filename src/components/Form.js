import React from "react";
import bgImg from "../assets/img2.JPG";
import { useForm } from "react-hook-form";
//aixos
import axios from "axios";

const Login_Url = "https://interview_fontend_web.shutokou.cc/login";
const Data_Url= "https://interview_fontend_web.shutokou.cc/get_data";


export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const onSubmit = (data) => console.log(data);
  const onSubmit = async function (data){
    try {
      const LoginResponse = await axios.post(Login_Url,{
        user:data.user,
        passwd:data.passwd,
      },{
        headers:{
          "Content-Type": "application/json",
          user:data.user,
        }
      });
      if (LoginResponse.data && LoginResponse.data.uuid && LoginResponse.data.token){
        // console.log("uuid :", LoginResponse.data.uuid);
        // console.log("token :", LoginResponse.data.token);

      const formData = new FormData();
      formData.append("user", data.user);
      formData.append("uuid", LoginResponse.data.uuid);
      formData.append("token", LoginResponse.data.token);
      formData.append("file", data.file[0]);

      const DataResponse = await axios.post(
        `${Data_Url}?user=${data.user}&uuid=${LoginResponse.data.uuid}&token=${LoginResponse.data.token}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "uuid": LoginResponse.data.uuid,
            "token": LoginResponse.data.token,
          },
        }
      );

        // console.log(DataResponse.data)
        // console.log(errors.DataResponse.data);
      } else {
        console.log(LoginResponse.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="register">
        <div className="col-1">
          <h2>Sign in</h2>
          <span>register and enjoy the service</span>

          <form
            id="form"
            className="flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              {...register("user")}
              placeholder="user"
            />
            <input
              type="password"
              {...register("passwd", { required: true, minLength: 8 })}
              placeholder="passwd"
            />
            {errors.passwd?.type === "required" && "Password is Required"}
            {errors.passwd?.type === "minLength" &&
              "Password must be at least 8 characters"}
            <input
              type="file"
              id="fileupload"
              {...register("file", { required: true })}
            />
            <label htmlFor="fileupload">Select a file!</label>
            {errors.file && "File is required"}
            <button className="btn">Sign in</button>
          </form>
        </div>
        <div className="col-2">
          <img src={bgImg} alt="bgImg" />
        </div>
      </div>
    </section>
  );
}

