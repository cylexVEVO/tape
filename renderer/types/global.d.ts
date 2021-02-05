declare module NodeJS {
	interface Global {
		audioContext: AudioContext
	}
}

declare let audioContext: AudioContext;