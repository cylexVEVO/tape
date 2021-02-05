// please ignore all of this file it will be refactored v soon <3

import * as React from "react";
import {play, resume, pause, addSong, setFilter, removeSong, resetSong, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import InlinePlay from "../../assets/img/play-inline.svg";
import InlinePause from "../../assets/img/pause-inline.svg";
import Open from "../../assets/img/folder-open.svg";
import Clock from "../../assets/img/clock.svg";
import Pencil from "../../assets/img/pencil-alt.svg";
import Trash from "../../assets/img/trash.svg";
import TrashConfirm from "../../assets/img/trash-confirm.svg";
import {ChangeEvent} from "react";

const mapState = (state: RootState) => ({
	library: state.library,
	currentSongId: state.player.currentSongId,
	playing: state.player.playing
});

const mapDispatch = {
	play,
	resume,
	pause,
	addSong,
	setFilter,
	removeSong,
	resetSong
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class Library extends React.Component<Props, {editing: boolean, selected: string[], confirmation: boolean}> {
	state = {
		editing: false,
		selected: [""],
		confirmation: false
	};

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

	importSongs() {
		// TODO: add message when importing songs with titles of songs already in libraries,
		// 	smth like "you're importing songs that appear to already be in your library. do you want to skip these or add them anyways? [skip duplicates/add anyways]"
		const remote = window.require("@electron/remote");
		const currentWindow = remote.getCurrentWindow();
		const dialog = remote.dialog;

		let acceptable = ["mp3", "aac", "wav", "ogg", "m4a", "flac"];

		dialog.showOpenDialog(currentWindow, {
			filters: [
				{
					name: "Audio Files",
					extensions: acceptable
				}
			],
			properties: ["openFile", "multiSelections"]
		}).then((selection: any) => {
			if (!selection.canceled) {
				selection.filePaths.map((pathName: string) => {
					this.props.addSong(pathName);
				});
			}
		});
	}

	inlineControlToggle(id: string) {
		const {play, pause, resume, playing, currentSongId} = this.props;

		// TODO: c
		if (playing) {
			if (currentSongId === id) {
				pause();
			} else {
				play(id);
			}
		} else {
			if (currentSongId === id) {
				resume();
			} else {
				play(id);
			}
		}
	}

	toggleEditing() {
		this.setState({editing: !this.state.editing, selected: [], confirmation: false});
	}

	handleCheckChange(e: ChangeEvent<HTMLInputElement>, id: string) {
		const {selected} = this.state;

		if (e.target.checked) {
			if (!selected.includes(id)) {
				this.setState({selected: [...selected, id]});
			}
		} else {
			if (selected.includes(id)) {
				this.setState({selected: selected.filter((id2) => id2 !== id)});
			}
		}
	}

	removeSelected() {
		const {removeSong, resetSong, currentSongId} = this.props;
		const {selected} = this.state;

		if (selected.includes(currentSongId)) resetSong();

		selected.map((id) => {
			removeSong(id);
		});

		this.toggleEditing();
	}

	render() {
		const {currentSongId, playing, setFilter} = this.props;
		const {editing, selected, confirmation} = this.state;
		let library = this.props.library.songs;

		if (this.props.library.filter !== "") library = library.filter((song) => {
			return song.metadata.title.toLowerCase().includes(this.props.library.filter.toLowerCase()) ||
				song.metadata.artist.toLowerCase().includes(this.props.library.filter.toLowerCase()) ||
				song.metadata.album.toLowerCase().includes(this.props.library.filter.toLowerCase())
		});

		// TODO: add sorting
		return (
			<div className={"px-8 pt-2 text-white"}>
				<input className={"bg-transparent bottom-separator w-full mb-2 focus:outline-none pl-1 pb-1"}
					   placeholder={"Search your library..."}
					   type={"text"}
					   value={this.props.library.filter}
					   onChange={(e) => setFilter(e.target.value)}/>
				<table className={"table-auto w-full"}>
					<thead>
						<tr>
							<th><img className={`${editing ? "opacity-100" : "hover-opacity"} w-4`}
									 alt={"Edit library"}
									 src={Pencil}
									 onClick={() => this.toggleEditing()}/></th>
							<th className={"font-normal text-left"}>
								{editing && !confirmation &&
									<button className={"flex items-center focus:outline-none hover-opacity mr-2"}
											onClick={() => this.setState({confirmation: true})}>
										<img className={"stroke-current mr-1"} alt={""} src={Trash}/>
										Remove selected
									</button>
								}
								{editing && confirmation &&
									<button className={"flex items-center focus:outline-none text-red-500 mr-2"}
											onClick={() => this.removeSelected()}>
										<img className={"stroke-current mr-1"} alt={""} src={TrashConfirm}/>
										Confirm
									</button>
								}
								{!editing &&
									<div className={"opacity-20"}>Title</div>
								}
							</th>
							<th className={"font-normal opacity-20 text-right"}>Album</th>
							<th className={"font-normal opacity-20 text-right"}>Artist</th>
							<th><img className={"ml-auto"} alt={"Length"} src={Clock}/></th>
						</tr>
					</thead>
					<tbody>
						{library.map((song) => {
							return (
								<>
									<tr key={song.id}>
										<td>
											{editing &&
												<input className={"mr-2 w-4"} type={"checkbox"} checked={selected.includes(song.id)} onChange={(e) => this.handleCheckChange(e, song.id)}/>
											}
											{!editing &&
												<img className={"hover-opacity mr-2"}
													 alt={playing && currentSongId === song.id ? "Pause" : "Play"}
													 src={playing && currentSongId === song.id ? InlinePause : InlinePlay}
													 onClick={() => this.inlineControlToggle(song.id)}/>
											}
										</td>
										<td>{song.metadata.title}</td>
										<td className={"text-right"}>{song.metadata.album || "No Album"}</td>
										<td className={"text-right"}>{song.metadata.artist || "No Artist"}</td>
										<td className={"text-right"}>{this.getLength(song.metadata.duration)}</td>
									</tr>

									{library.indexOf(song) !== library.length - 1 &&
										<tr>
											<td className={"py-1"} colSpan={5}>
												<div className={"bottom-separator"}/>
											</td>
										</tr>
									}
								</>
							);
						})}
						<tr>
							<td className={"text-center pt-2"} colSpan={5}>
								<div className={"inline-flex items-center gap-2 hover-opacity"} onClick={() => this.importSongs()}>
									<img alt={""} src={Open}/>
									Import music
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default connector(Library);