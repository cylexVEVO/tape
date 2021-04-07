import * as React from "react";
import {addHistory, mixtape_removeSong, pause, play, removeMixtape, resume, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {IMixtape, ISong} from "../interfaces";
import InlinePause from "@img/pause-inline.svg";
import InlinePlay from "@img/play-inline.svg";
import Clock from "@img/clock.svg";
import CreateMixtape from "@components/CreateMixtape";
import Trash from "@img/trash.svg";
import TrashConfirm from "@img/trash-confirm.svg";
import WithConfirm from "@components/WithConfirm";
import {useEffect, useState} from "react";

const mapState = (state: RootState) => ({
	library: state.library,
	currentSongId: state.player.currentSongId,
	playing: state.player.playing
});

const mapDispatch = {
	removeMixtape,
	pause,
	play,
	resume,
	addHistory,
	mixtape_removeSong
}

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const UTable: React.FC<Props & {songs: {songId: string, mixtapeId: string}[], mixtape: string}> = (props) => {
	const {playing, currentSongId, play, pause, resume, addHistory, mixtape_removeSong} = props;

	const removeSelected = () => {
		setSelected([]);
		selected.map((id) => mixtape_removeSong({mixtape: props.mixtape, mixtapeId: id}));
	}

	const inlineControlToggle = (id: string) => {
		if (playing && currentSongId === id) pause();
		if (!playing && currentSongId === id) resume();
		if ((playing || !playing) && currentSongId !== id) {
			addHistory(currentSongId);
			play(id);
		}
	};

	const getLength = (length: number): string => {
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
	};

	const [selected, setSelected] = useState<string[]>([]);
	const [selectMultipleDown, setSelectMultipleDown] = useState(false);

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "Control" || e.key === "Meta") setSelectMultipleDown(true);
		});
		window.addEventListener("keyup", (e) => {
			if (e.key === "Control" || e.key === "Meta") setSelectMultipleDown(false);
		});
	}, []);

	const toggleRow = (id: string) => {
		if (document.querySelector(`#inline-control-${id}:hover`)) return;

		if (selectMultipleDown) {
			if (selected.includes(id)) setSelected(selected.filter((x) => x !== id));
			if (!selected.includes(id)) setSelected([...selected, id]);
		} else {
			if (selected.includes(id)) {
				if (selected.length > 1) setSelected([id]);
				if (selected.length === 1) setSelected([]);
			}
			if (!selected.includes(id)) setSelected([id]);
		}
	};

	return (
		<div>
			{selected.length > 0 &&
				<div className={"flex w-full gap-4"}>
					<WithConfirm action={() => removeSelected()}>
						<button className={"flex items-center gap-1 focus:outline-none hover-opacity"}>
							<img alt={""} src={Trash}/>
							Remove selected
						</button>
						<button className={"flex items-center gap-1 focus:outline-none text-red-500"}>
							<img alt={""} src={TrashConfirm}/>
							Confirm
						</button>
					</WithConfirm>
				</div>
			}
			<div className={"table-grid opacity-20"}>
				<div/>
				<div className={"-ml-1"}>Title</div>
				<div className={"text-right"}>Album</div>
				<div className={"text-right"}>Artist</div>
				<div className={"flex items-center"}><img className={"ml-auto"} alt={"Length"} src={Clock}/></div>
			</div>
			{props.songs.map((song: {songId: string, mixtapeId: string}, idx: number) => {
				const {metadata: {title, artist, album, duration}} = props.library.songs.find((x: ISong) => x.id === song.songId);
				let showSeparator = true;

				if (idx === 0) showSeparator = false;
				if (selected.includes(song.mixtapeId)) showSeparator = false;
				if (selected.includes(props.songs[idx - 1]?.mixtapeId)) showSeparator = false;

				return (
					<div className={`top-separator ${!showSeparator ? "border-transparent" : ""}`} key={song.mixtapeId}>
						<div className={`table-grid ${selected.includes(song.mixtapeId) ? "rounded-md bg-blue-500 p-4 -mx-4" : "p-2 my-2 -mx-2"}`} onClick={() => toggleRow(song.mixtapeId)}>
							<div className={"flex items-center z-[200]"}>
								<img id={`inline-control-${song.mixtapeId}`} className={"hover-opacity"}
									 alt={playing && currentSongId === song.songId ? "Pause" : "Play"}
									 src={playing && currentSongId === song.songId ? InlinePause : InlinePlay}
									 onClick={() => inlineControlToggle(song.songId)}/>
							</div>
							<div>{title}</div>
							<div className={"text-right"}>{album}</div>
							<div className={"text-right"}>{artist}</div>
							<div className={"text-right"}>{getLength(duration)}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const Table = connector(UTable);

class Mixtape extends React.Component<Props, {selected: string, showCreateMixtape: boolean}> {
	state = {
		selected: "",
		showCreateMixtape: false
	};

	playlistView() {
		const {library: {mixtapes}} = this.props;
		const {selected} = this.state;
		const {name, songs} = mixtapes.filter((mixtape: IMixtape) => mixtape.id === selected)[0];

		return (
			<div>
				<div className={"hover-opacity mb-2"} onClick={() => this.setState({selected: ""})}>
					{"<"} back
				</div>
				<div className={"flex gap-4 mb-4"}>
					<div className={"mixtape bg"}/>
					<div className={"flex flex-col mt-1"}>
						<div className={"text-2xl"}>
							{name}
						</div>
						<div className={"text-xs opacity-20"}>
							{songs.length} songs
						</div>
						<WithConfirm action={() => {
							this.props.removeMixtape(selected);
							this.setState({selected: ""});
						}}>
							<button className={"focus:outline-none hover-opacity"}>
								<img alt={""} src={Trash}/>
							</button>
							<button className={"focus:outline-none text-red-500"}>
								<img alt={""} src={TrashConfirm}/>
							</button>
						</WithConfirm>
					</div>
				</div>
				<Table songs={songs} mixtape={selected}/>
			</div>
		);
	}

	render() {
		const {library: {mixtapes}} = this.props;
		const {selected, showCreateMixtape} = this.state;

		// TODO: add auto-generated playlists, contains songs with the same album / artist
		// TODO: center mixtapes w/o it looking stupid
		return (
			<div className={"px-8 py-2 text-white"}>
				<CreateMixtape show={showCreateMixtape} hide={() => this.setState({showCreateMixtape: false})}/>
				{!selected &&
					<div className={"flex flex-wrap gap-6"}>
						{mixtapes.map((mixtape: IMixtape) => {
							const {name, id} = mixtape;
							return (
								<div key={id} className={"mixtape relative"} onClick={() => this.setState({selected: id})}>
									<div className={"absolute top-0 left-0 right-0 bottom-0 z-20 gradient-overlay"}/>
									<div className={"absolute mixtape z-10 bg"}/>
									<div className={"absolute pointer-events-none text z-30"}>{name}</div>
								</div>
							);
						})}
						<div className={"mixtape relative hover-opacity border-4 border-white"} onClick={() => this.setState({showCreateMixtape: true})}>
							<div className={"absolute pointer-events-none create z-30 text-3xl"}>
								+
							</div>
							<div className={"absolute pointer-events-none text z-30"}>
								create mixtape
							</div>
						</div>
					</div>
				}
				{selected &&
					this.playlistView()
				}
			</div>
		);
	}
}

export default connector(Mixtape);