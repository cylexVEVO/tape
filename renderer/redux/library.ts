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
			mixtape.songs.map((id2) => {
				thunkAPI.dispatch(_mixtape_removeInstances({mixtape: mixtape.id, id: id2.songId}));
			});
		});

		return id;
	}
);

const {actions, reducer} = createSlice({
	name: "library",
	initialState,
	reducers: {
		addMixtape: (state, action: PayloadAction<{name: string, icon: string, dynamic: boolean, songs: {songId: string, mixtapeId: string}[], include: string[]}>) => {
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
			let id = crypto.randomBytes(8).toString("hex");
			while (state.mixtapes.find((mixtape) => mixtape.id === action.payload.mixtape)!.songs.find((song) => song.mixtapeId === id)) id = crypto.randomBytes(8).toString("hex");
			state.mixtapes[i].songs.push({songId: action.payload.song, mixtapeId: id});
		},
		mixtape_removeSong: (state, action: PayloadAction<{mixtape: string, mixtapeId: string}>) => {
			const i = state.mixtapes.indexOf(state.mixtapes.filter((mixtape) => mixtape.id === action.payload.mixtape)[0]);
			const ii = state.mixtapes[i].songs.indexOf(state.mixtapes[i].songs.find((song) => song.mixtapeId === action.payload.mixtapeId)!);
			state.mixtapes[i].songs.splice(ii, 1);
		},
		_mixtape_removeInstances: (state, action: PayloadAction<{mixtape: string, id: string}>) => {
			const i = state.mixtapes.indexOf(state.mixtapes.filter((mixtape) => mixtape.id === action.payload.mixtape)[0]);
			state.mixtapes[i].songs = state.mixtapes[i].songs.filter((song) => song.songId === action.payload.id);
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

const {addMixtape, removeMixtape, mixtape_addSong, mixtape_removeSong, _mixtape_removeInstances} = actions;

export {
	reducer as libraryReducer,
	addSong,
	removeSong,
	addMixtape,
	removeMixtape,
	mixtape_addSong,
	mixtape_removeSong
};