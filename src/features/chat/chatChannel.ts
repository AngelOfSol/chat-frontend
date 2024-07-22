import { createAppSlice } from "../../app/createAppSlice";
import { User } from "../user/userStatus";

export type ChatLine = { user: User; message: String; timing: Date };
export type ChatChannel = { name: string; messages: ChatLine[]; users: User[] };
export type ChatState = {
  currentChannel: string | null;
  channels: ChatChannel[];
};

const initialState: ChatState = {
  currentChannel: null,
  channels: [
    { name: "General", messages: [], users: [] },
    { name: "Specific", messages: [], users: [] },
  ],
};

function getCurrentChannel(state: ChatState): ChatChannel | null {
  if (!state.currentChannel) {
    return null;
  }
  const currentChannel = state.currentChannel;

  return state.channels.find((value) => value.name == currentChannel) || null;
}

export const chatLinesSlice = createAppSlice({
  name: "chatLines",
  initialState: initialState as ChatState,
  reducers: (create) => ({
    submitChatMessage: create.preparedReducer(
      (user: User, message: string) => {
        return { payload: { user, message, timing: new Date() } };
      },
      (state, action) => {
        const channel = getCurrentChannel(state);
        if (!channel) {
          return;
        }
        channel.messages.push(action.payload);

        if (
          !channel.users.find((value) => value.name == action.payload.user.name)
        ) {
          channel.users.push(action.payload.user);
        }
      }
    ),
    changeChannel: create.reducer((state, action: { payload: string }) => {
      state.currentChannel = action.payload;
    }),
  }),
  selectors: {
    selectChatLines: (state) => {
      return getCurrentChannel(state);
    },
    selectChannelNames: (state) => {
      return state.channels.map((value) => value.name);
    },
  },
});

// Action creators are generated for each case reducer function.
export const { submitChatMessage, changeChannel } = chatLinesSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectChatLines: selectCurrentChannel, selectChannelNames } =
  chatLinesSlice.selectors;
