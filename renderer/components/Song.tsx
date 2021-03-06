import * as React from "react";
import {addHistory, pause, play, queue, resume, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {ISong} from "../interfaces";

const mapState = (state: RootState) => ({
	library: state.library,
	currentSongId: state.player.currentSongId,
	playing: state.player.playing
});

const mapDispatch = {
	queue,
	play,
	pause,
	resume,
	addHistory
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class Song extends React.Component<Props & {id: string, icon: JSX.Element}> {
	getLength(length: number) {
		// modified version of https://stackoverflow.com/a/34841026
		const hours = Math.floor(length / 3600);
		const minutes = Math.floor(length / 60) % 60;
		const seconds = length % 60;

		let x = [hours, minutes, seconds]
			.map((v) => v < 10 ? "0" + v : v)
			.filter((v, i) => v !== "00" || i > 0)
			.join(":");

		if (x.length === 5 && x.split("")[0] === "0") x = x.substr(1);

		return x;
	}

	render() {
		const {library, icon, id} = this.props;
		const {metadata: {title, album, artist, duration}} = library.songs.find((song: ISong) => song.id === id);

		return (
			<tr>
				<td>
					{icon}
				</td>
				<td>{title}{/*<button onClick={() => this.props.queue({id: id, position: "first"})}>queue</button>*/}</td>
				<td className={"text-right"}>{album || "No Album"}</td>
				<td className={"text-right"}>{artist || "No Artist"}</td>
				<td className={"text-right"}>{this.getLength(duration)}</td>
			</tr>
		)
	}
}

export default connector(Song);