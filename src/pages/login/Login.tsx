import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layout/AuthLayout";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { useState } from "react";
import type { LoginFormValues } from "../../types/login/login.type";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",

      password: "",
    },
  });

  async function myHandleSubmit(values: LoginFormValues) {
    if (isSubmitting) {
      return;
    }

    console.log("teesttt", values);

    try {
      setIsSubmitting(true);

      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );

      console.log(data);

      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      }

      toast.success("Signed in successfully", {
        description: data.message || "Welcome back to Sohbet — let's catch up!",
        timeout: 5000,
      });
      nav("/home", { replace: true });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.danger("Sign in failed", {
          description:
            error.response?.data.message ||
            "Please check your email and password, then try again.",
          timeout: 6000,
        });

        console.log(error.response);
      } else {
        toast.danger("Something went wrong", {
          description: "Please check your connection and try again.",
          timeout: 6000,
        });
      }

      console.log(error);
      return;
    } finally {
      reset();
      setIsSubmitting(false);
    }
  }
  return (
    <AuthLayout
      headline={
        <>
          <span className="block">Your people.</span>
          <span className="block">Your conversations.</span>
          <span className="block text-accent-soft">Your space.</span>
        </>
      }
      subcopy="A calmer corner of the internet — built for the conversations you actually want to have."
    >
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
        Welcome back
      </h1>
      <p className="mt-1.5 text-[15px] leading-6 text-ink-muted">
        Sign in to continue the conversation and catch up with your community.
      </p>

      <form
        noValidate
        className="mt-6 space-y-4 sm:mt-7"
        onSubmit={handleSubmit(myHandleSubmit)}
        aria-busy={isSubmitting}
      >
        <FormField
          id="username"
          label="Username"
          error={errors.username?.message}
        >
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            {...register("username", {
              required: "Please enter your username",
            })}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password", {
              required: "Please enter your password",
            })}
          />
        </FormField>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full disabled:shadow-none"
        >
          {isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-ink-muted">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-primary transition hover:text-primary-strong focus:outline-none focus-visible:underline"
        >
          Create account
        </Link>
      </p>

      <p className="mt-7 text-center text-xs text-ink-subtle">
        © {new Date().getFullYear()} Sohbet. All rights reserved.
      </p>
    </AuthLayout>
  );
}
