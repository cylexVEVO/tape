import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, addHistory, dequeue, removeHistory, queue} from ".";
import {ISong} from "../interfaces";

interface State {
	playing: boolean,
	volume: number,
	duration: number,
	position: number,
	currentSongId: string
}

const initialState: State = {
	playing: false,
	volume: .5,
	duration: 0,
	position: 0,
	currentSongId: ""
};

const setupAudioContext = createAsyncThunk<void, void, {state: RootState}>(
	"player/setupAudioContext",
	async (_, thunkAPI) => {
		const ipcRenderer = window.require("electron").ipcRenderer;
		const audioContext = new AudioContext();
		const audioElement = document.querySelector<HTMLMediaElement>("#audio")!;
		const track = audioContext.createMediaElementSource(audioElement);
		track.connect(audioContext.destination);

		audioElement.addEventListener("play", () => {
			ipcRenderer.send("updateDockMenu", true);
			thunkAPI.dispatch(startAnimation());
		});

		const stopAnim = () => {
			ipcRenderer.send("updateDockMenu", false);
			if (audioElement.currentTime === audioElement.duration) {
				// don't run if there's any songs in queue, otherwise we'd end up with duplicate history
				if (!thunkAPI.getState().queue.songs.length) {
					thunkAPI.dispatch(resetSong());
				}
			}
			thunkAPI.dispatch(stopAnimation());
		};

		// Handle events from dock menu
		ipcRenderer.on("play", () => {
			if (audioElement.src) {
				audioElement.play();
			}
		});

		ipcRenderer.on("pause", () => {
			audioElement.pause();
		});

		ipcRenderer.on("previous", () => {
			const previous = thunkAPI.getState().queue.history[0];

			if (thunkAPI.getState().queue.history.length && previous) {
				play(previous);
				thunkAPI.dispatch(queue(thunkAPI.getState().player.currentSongId));
				removeHistory(0);
			}
		});

		ipcRenderer.on("next", () => {
			const next = thunkAPI.getState().queue.songs[0];

			if (thunkAPI.getState().queue.songs.length && next) {
				play(next);
				thunkAPI.dispatch(addHistory(thunkAPI.getState().player.currentSongId));
				dequeue(0);
			}
		});

		audioElement.addEventListener("pause", () => {
			// Play next song in queue if there is one
			const audioElement = document.querySelector<HTMLMediaElement>("#audio")!;
			if (audioElement.currentTime === audioElement.duration) {
				thunkAPI.dispatch(addHistory(thunkAPI.getState().player.currentSongId));
				if (thunkAPI.getState().queue.songs[0]) {
					thunkAPI.dispatch(play(thunkAPI.getState().queue.songs[0]));
					thunkAPI.dispatch(dequeue(0));
				}
			}

			stopAnim();
		});
		global.audioContext = audioContext;
	}
);

const play = createAsyncThunk<{src: string, id: string}, string, {state: RootState}>(
	"player/play",
	async (id, thunkAPI) => {
		const fs = window.require("fs");
		const {location} = thunkAPI.getState().library.songs.find((song: ISong) => song.id === id)!;

		try {
			let blob = new Blob([await fs.readFileSync(location).buffer]);
			const objectURL = URL.createObjectURL(blob);
			return {src: objectURL, id};
		} catch {
			return thunkAPI.rejectWithValue("There was an error trying to play that song.\nPerhaps it's changed location?");
		}
	}
);

const {actions, reducer: playerReducer} = createSlice({
	name: "player",
	initialState: initialState,
	reducers: {
		resume: () => {
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;

			if (audio.src === "" || audio.src === null) return;

			audio.play();
		},
		pause: () => {
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;
			audio.pause();
		},
		changeVolume: (state, action: PayloadAction<number>) => {
			// TODO: move volume to gain node
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;
			state.volume = action.payload;
			audio.volume = action.payload;
		},
		seek: (state, action: PayloadAction<number>) => {
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;
			state.position = action.payload;
			audio.currentTime = action.payload;
		},
		stop: (state) => {
			state.playing = false;
			state.duration = 0;
			state.position = 0;
			state.currentSongId = "";
		},
		startAnimation: (state) => {
			state.playing = true;
		},
		stopAnimation: (state) => {
			state.playing = false;
		},
		resetSong: (state) => {
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;
			audio.pause();
			audio.src = "";
			state.currentSongId = "";
			state.playing = false;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(play.fulfilled, (state, {payload: {src, id}}) => {
			let audio = document.querySelector<HTMLAudioElement>("#audio")!;
			audio.src = src;
			state.currentSongId = id;
			audio.play();
		}).addCase(play.rejected, (_, action) => {
			// TODO: change this into an in-app prompt to choose new location or remove from library, this'll do for now
			window.require("@electron/remote").dialog.showErrorBox("An error occurred.", action.payload);
		}).addCase(setupAudioContext.pending, (state) => {
			state.playing = false;
			state.currentSongId = "";
		});
	}
});

const {changeVolume, resume, pause, seek, startAnimation, stopAnimation, resetSong} = actions;

export {
	changeVolume,
	pause,
	resume,
	seek,
	resetSong,
	setupAudioContext,
	play,
	playerReducer
};