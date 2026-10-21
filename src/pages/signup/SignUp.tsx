import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layout/AuthLayout";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import type { SignUpFormValues } from "../../types/signup/signup.type";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { useState } from "react";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
  });

  async function myHandleSubmit(values: SignUpFormValues) {
    if (isSubmitting) {
      return;
    }
    console.log("teesttt", values);
    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );
      console.log(data);

      toast.success("Account created", {
        description: data.message || "Welcome to Sohbet — your space is ready.",
        timeout: 5000,
      });
      nav("/login");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.danger("We couldn't create your account", {
          description:
            error.response?.data.message ||
            "Please check your details and try again.",
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
        Create your account
      </h1>
      <p className="mt-1.5 text-[15px] leading-6 text-ink-muted">
        Join the conversation and connect with people.
      </p>

      <form
        noValidate
        className="mt-6 space-y-4 sm:mt-7"
        onSubmit={handleSubmit(myHandleSubmit)}
        aria-busy={isSubmitting}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="name" label="Full name" error={errors.name?.message}>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name", {
                required: "Enter your full name",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
          </FormField>

          <FormField
            id="username"
            label="Username"
            error={errors.username?.message}
          >
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="janedoe"
              invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              {...register("username", {
                required: "Choose a username",
                pattern: {
                  value: /^[a-zA-Z0-9_]{3,20}$/,
                  message: "3–20 letters, numbers or underscores",
                },
              })}
            />
          </FormField>
        </div>

        <FormField
          id="email"
          label="Email address"
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email", {
              required: "Enter your email address",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="dateOfBirth"
            label="Date of birth"
            error={errors.dateOfBirth?.message}
          >
            <Input
              id="dateOfBirth"
              type="date"
              autoComplete="bday"
              invalid={!!errors.dateOfBirth}
              aria-describedby={
                errors.dateOfBirth ? "dateOfBirth-error" : undefined
              }
              {...register("dateOfBirth", {
                required: "Enter your date of birth",

                validate: (value) => {
                  const dob = new Date(value);
                  if (Number.isNaN(dob.getTime())) {
                    return "Enter a valid date";
                  }
                  const today = new Date();
                  let age = today.getFullYear() - dob.getFullYear();
                  const hadBirthdayThisYear =
                    today.getMonth() > dob.getMonth() ||
                    (today.getMonth() === dob.getMonth() &&
                      today.getDate() >= dob.getDate());
                  if (!hadBirthdayThisYear) age -= 1;
                  return age >= 13 || "You must be at least 13 years old";
                },
              })}
            />
          </FormField>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-ink">
              Gender
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative">
                <input
                  type="radio"
                  id="gender-male"
                  value="male"
                  className="peer sr-only"
                  {...register("gender", { required: true })}
                />
                <label
                  htmlFor="gender-male"
                  className="flex cursor-pointer items-center justify-center rounded-field border border-line bg-surface py-3 text-[15px] text-ink transition peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-focus-visible:ring-offset-2"
                >
                  Male
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="gender-female"
                  value="female"
                  className="peer sr-only"
                  {...register("gender", { required: true })}
                />
                <label
                  htmlFor="gender-female"
                  className="flex cursor-pointer items-center justify-center rounded-field border border-line bg-surface py-3 text-[15px] text-ink transition peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-focus-visible:ring-offset-2"
                >
                  Female
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Create a password",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
            />
          </FormField>

          <FormField
            id="rePassword"
            label="Confirm password"
            error={errors.rePassword?.message}
          >
            <PasswordInput
              id="rePassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              invalid={!!errors.rePassword}
              aria-describedby={
                errors.rePassword ? "rePassword-error" : undefined
              }
              {...register("rePassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
            />
          </FormField>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full disabled:shadow-none"
        >
          {isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-ink-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary transition hover:text-primary-strong focus:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-7 text-center text-xs text-ink-subtle">
        © {new Date().getFullYear()} Sohbet. All rights reserved.
      </p>
    </AuthLayout>
  );
}
