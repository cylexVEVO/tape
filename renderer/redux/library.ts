import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Song} from "../interfaces";
import * as crypto from "crypto";
import {RootState} from "./index";

interface State {
	songs: Song[],
	filter: string
}

const initialState: State = {
	songs: [],
	filter: ""
};

const addSong = createAsyncThunk<Song, string, {state: RootState}>(
	"library/addSong",
	async (location, thunkAPI) => {
		let id = crypto.randomBytes(8).toString("hex");
		while (thunkAPI.getState().library.songs.find((song) => song.id === id)) {
			id = crypto.randomBytes(8).toString("hex");
		}

		const ipcRenderer = window.require("electron").ipcRenderer;

		let song: Song = {...await ipcRenderer.invoke("getMetadata", location), id};
		return song;
	}
);

const {actions, reducer} = createSlice({
	name: "library",
	initialState,
	reducers: {
		setFilter: (state, action: PayloadAction<string>) => {
			state.filter = action.payload;
		},
		removeSong: (state, action: PayloadAction<string>) => {
			state.songs = state.songs.filter((song) => song.id !== action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(addSong.fulfilled, (state, action) => {
			state.songs.push(action.payload);
		});
	}
});

const {setFilter, removeSong} = actions;

export {
	reducer as libraryReducer,
	addSong,
	setFilter,
	removeSong
};