import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface State {
	songs: string[],
	history: string[]
}

const initialState: State = {
	songs: [],
	history: []
};

const {actions, reducer} = createSlice({
	name: "queue",
	initialState,
	reducers: {
		queue: (state, action: PayloadAction<{id: string, position: "first" | "last" | number}>) => {
			const {id, position} = action.payload;

			if (typeof position === "string") {
				if (position == "first") {
					state.songs.unshift(id);
				} else {
					state.songs.push(id);
				}
			} else {
				state.songs.splice(position - 1, 0, id);
			}
		},
		dequeue: (state, action: PayloadAction<number>) => {
			state.songs.splice(action.payload, 1);
		},
		move: (state, action: PayloadAction<{from: number, to: number}>) => {
			const id = state.songs.splice(action.payload.from, 1)[0];
			state.songs.splice(action.payload.to, 0, id);
		},
		addHistory: (state, action: PayloadAction<string>) => {
			if (action.payload) state.history.unshift(action.payload);
		},
		removeHistory: (state, action: PayloadAction<number>) => {
			state.history.splice(action.payload, 1);
		},
		clearHistory: (state) => {
			state.history = [];
		},
		clearQueue: (state) => {
			state.songs = [];
		}
	}
});

const {queue, dequeue, addHistory, clearHistory, clearQueue, removeHistory} = actions;

export {
	reducer as queueReducer,
	queue,
	dequeue,
	addHistory,
	clearHistory,
	clearQueue,
	removeHistory
};