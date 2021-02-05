export interface Song {
	location: string,
	metadata: {
		title: string,
		album: string,
		artist: string,
		duration: number
	},
	id: string
}