import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import type { AppThunk } from "../../app/store"

export type ChatLine = { userName: String, message: String, timing: Date, };

export type ChatLines = ChatLine[];


const initialState: ChatLines = [];

// If you are not using async thunks you can use the standalone `createSlice`.
export const chatLinesSlice = createAppSlice({
    name: "chatLines",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: initialState as ChatLines,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        submitChatMessage: create.preparedReducer(
            (userName: string, message: string) => { return { payload: { userName, message, timing: new Date() } } },
            (state, action) => {
                state.push(action.payload);
            },
        ),
    }),
    selectors: {
        selectChatLines: (state) => state
    }

})

// Action creators are generated for each case reducer function.
export const { submitChatMessage } =
    chatLinesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectChatLines } = chatLinesSlice.selectors
