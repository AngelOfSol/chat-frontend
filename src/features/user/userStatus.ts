import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

export interface User {
  name: string;
}

export type UserInactive = { state: "inactive" };

export type UserActive = {
  state: "active";
  user: User;
};

export type UserStatus = UserInactive | UserActive;

const initialState: UserStatus = {
  state: "inactive",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const userStatusSlice = createAppSlice({
  name: "userStatus",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialState as UserStatus,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    logOut: create.reducer((_) => {
      return { state: "inactive" };
    }),
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    logIn: create.reducer(
      (
        state,
        action: PayloadAction<{ userName: string; password: string }>
      ) => {
        return {
          state: "active",
          user: { name: action.payload.userName },
        };
      }
    ),
  }),
});

// Action creators are generated for each case reducer function.
export const { logIn, logOut } = userStatusSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {} = userStatusSlice.selectors;
