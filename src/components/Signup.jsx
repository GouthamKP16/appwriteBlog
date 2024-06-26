import React from "react";
import { useState } from "react";
import authService from "../appwrite/auth";
import { Input, Logo, Button } from "./index";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Login as authLogin } from "../store/authSlice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const signup = async (data) => {
    setError("");
    try {
      const User = await authService.createAccount(data);
      if (User) {
        const UserData = await authService.getCurrentUser();
        if (UserData) dispatch(authLogin(UserData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(signup)}>
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) => {
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Enter a valid Email address";
                  },
                },
              })}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: true,
                matchPatern: (value) => {
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(
                    value
                  ) ||
                    "the password length must be at least 8 , and must inculed at least one special , uppercase and number ";
                },
              })}
            />
            <Button className="w+h-full" type="submit">
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
