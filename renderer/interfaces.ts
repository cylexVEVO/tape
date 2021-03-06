export interface ISong {
	location: string,
	metadata: {
		title: string,
		album: string,
		artist: string,
		duration: number
	},
	id: string,
	favorited: boolean
}

// TODO: implement dynamic playlists
export interface IMixtape {
	name: string,
	id: string,
	icon: string,
	dynamic: boolean,
	songs: string[],
	// Only used when mixtape is dynamic
	include: string[]
}