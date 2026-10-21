export type SignUpFormValues = {
  name: string;
  username: string;
  email: string;
  /**
   * String (native <input type="date"> value, "YYYY-MM-DD"), matching the
   * API payload — not a Date. A later edit in this project changed this to
   * `Date`, which doesn't match what the native date input actually gives
   * you without extra parsing/formatting glue. Reverted per your
   * confirmation; the age check now happens inside the field's RHF
   * `validate` function instead, without changing this type or the payload.
   */
  dateOfBirth: string;
  gender: "male" | "female";
  password: string;
  rePassword: string;
};
