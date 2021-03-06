import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMixtape, ISong} from "../interfaces";
import * as crypto from "crypto";
import {dequeue, removeHistory, RootState} from "./index";

interface State {
	songs: ISong[],
	mixtapes: IMixtape[]
}

const initialState: State = {
	songs: [],
	mixtapes: []
};

const addSong = createAsyncThunk<ISong, string, {state: RootState}>(
	"library/addSong",
	async (location, thunkAPI) => {
		let id = crypto.randomBytes(8).toString("hex");
		while (thunkAPI.getState().library.songs.find((song: ISong) => song.id === id)) id = crypto.randomBytes(8).toString("hex");

		return {...await window.require("electron").ipcRenderer.invoke("getMetadata", location), id};
	}
);

const removeSong = createAsyncThunk<string, string, {state: RootState}>(
	"library/removeSong",
	async (id, thunkAPI) => {
		thunkAPI.getState().queue.history.map((id2: string) => id2 === id).map(() => thunkAPI.dispatch(removeHistory(thunkAPI.getState().queue.history.indexOf(id))));
		thunkAPI.getState().queue.songs.map((id2: string) => id2 === id).map(() => thunkAPI.dispatch(dequeue(thunkAPI.getState().queue.songs.indexOf(id))));
		thunkAPI.getState().library.mixtapes.map((mixtape: IMixtape) => {
			mixtape.songs.map((id2, i) => {
				if (id2 === id) thunkAPI.dispatch(mixtape_removeSong({mixtape: mixtape.id, position: i}));
				console.log(thunkAPI.getState().library.mixtapes[0].songs);
			});
		});

		return id;
	}
);

const {actions, reducer} = createSlice({
	name: "library",
	initialState,
	reducers: {
		addMixtape: (state, action: PayloadAction<{name: string, icon: string, dynamic: boolean, songs: string[], include: string[]}>) => {
			let id = crypto.randomBytes(8).toString("hex");
			while (state.mixtapes.find((mixtape) => mixtape.id === id)) id = crypto.randomBytes(8).toString("hex");

			const mixtape = {id, ...action.payload};

			state.mixtapes.push(mixtape);
		},
		removeMixtape: (state, action: PayloadAction<string>) => {
			state.mixtapes = state.mixtapes.filter((mixtape) => mixtape.id !== action.payload);
		},
		mixtape_addSong: (state, action: PayloadAction<{mixtape: string, song: string}>) => {
			const i = state.mixtapes.indexOf(state.mixtapes.filter((mixtape) => mixtape.id === action.payload.mixtape)[0]);
			state.mixtapes[i].songs.push(action.payload.song);
		},
		mixtape_removeSong: (state, action: PayloadAction<{mixtape: string, position: number}>) => {
			console.log(action.payload.position);
			const i = state.mixtapes.indexOf(state.mixtapes.filter((mixtape) => mixtape.id === action.payload.mixtape)[0]);
			state.mixtapes[i].songs.splice(action.payload.position, 1);
		},
		mixtape_addMixtape: (_, __: PayloadAction<string>) => {},
		mixtape_removeMixtape: (_, __: PayloadAction<string>) => {},
		mixtape_changeIcon: (_, __: PayloadAction<string>) => {},
		mixtape_changeName: (_, __: PayloadAction<string>) => {},
	},
	extraReducers: (builder) => {
		builder.addCase(addSong.fulfilled, (state, action) => {
			state.songs.push(action.payload);
		}).addCase(removeSong.fulfilled, (state, action) => {
			state.songs = state.songs.filter((song: ISong) => song.id !== action.payload);
		});
	}
});

const {addMixtape, mixtape_addSong, mixtape_removeSong} = actions;

export {
	reducer as libraryReducer,
	addSong,
	removeSong,
	addMixtape,
	mixtape_addSong,
	mixtape_removeSong
};