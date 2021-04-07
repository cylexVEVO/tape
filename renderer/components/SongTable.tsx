import * as React from "react";
import InlinePause from "@img/pause-inline.svg";
import InlinePlay from "@img/play-inline.svg";
import Clock from "@img/clock.svg";
import {addHistory, pause, play, resetSong, resume, removeSong, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {ISong} from "../interfaces";
import Trash from "@img/trash.svg";
import TrashConfirm from "@img/trash-confirm.svg";
import Plus from "@img/plus-circle.svg";
import WithConfirm from "@components/WithConfirm";
import SelectMixtapes from "@components/SelectMixtapes";
import {useEffect, useState} from "react";

const mapState = (state: RootState) => ({
	currentSongId: state.player.currentSongId,
	playing: state.player.playing,
	library: state.library,
	queue: state.queue
});

const mapDispatch = {
	play,
	resume,
	pause,
	addHistory,
	resetSong,
	removeSong
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const SongTable: React.FC<Props> = (props) => {
	const [showSelectMixtape, setShowSelectMixtape] = React.useState(false);
	const {playing, currentSongId, play, pause, resume, addHistory, library, resetSong, removeSong} = props;

	const handleHide = (added: boolean) => {
		setShowSelectMixtape(false);
		if (added) setSelected([]);
	}

	const removeSelected = () => {
		setSelected([]);
		setFilter("");
		if (selected.includes(currentSongId)) resetSong();
		selected.map((id) => removeSong(id));
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
	const [filter, setFilter] = useState("");

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

	let songs = library.songs.filter(({metadata: {title, artist, album}}: ISong) => title.toLowerCase().includes(filter) || artist.toLowerCase().includes(filter) || album.toLowerCase().includes(filter));

	return (
		<div>
			<SelectMixtapes show={showSelectMixtape} hide={(added: boolean) => handleHide(added)} selectedSongs={selected}/>
			{selected.length === 0 &&
				<input className={"bg-transparent bottom-separator w-full mb-2 focus:outline-none pl-1 pb-1"}
					   placeholder={"Search your library..."}
					   type={"text"}
					   value={filter}
					   onChange={(e) => setFilter(e.target.value)}/>
			}
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
					<button className={"flex items-center focus:outline-none hover-opacity"}
							onClick={() => setShowSelectMixtape(true)}>
						<img className={"mr-1"} alt={""} src={Plus}/>
						Add to mixtape
					</button>
				</div>
			}
			<div className={"table-grid opacity-20"}>
				<div/>
				<div className={"-ml-1"}>Title</div>
				<div className={"text-right"}>Album</div>
				<div className={"text-right"}>Artist</div>
				<div className={"flex items-center"}><img className={"ml-auto"} alt={"Length"} src={Clock}/></div>
			</div>
			{songs.map((song: ISong, idx: number) => {
				const {metadata: {title, artist, album, duration}, id} = song;
				let showSeparator = true;

				if (idx === 0) showSeparator = false;
				if (selected.includes(id)) showSeparator = false;
				if (selected.includes(library.songs[idx - 1]?.id)) showSeparator = false;

				return (
					<div className={`top-separator ${!showSeparator ? "border-transparent" : ""}`} key={id}>
						<div className={`table-grid ${selected.includes(id) ? "rounded-md bg-blue-500 p-4 -mx-4" : "p-2 my-2 -mx-2"}`} onClick={() => toggleRow(id)}>
							<div className={"flex items-center z-[200]"}>
								<img id={`inline-control-${id}`} className={"hover-opacity"}
									 alt={playing && currentSongId === id ? "Pause" : "Play"}
									 src={playing && currentSongId === id ? InlinePause : InlinePlay}
									 onClick={() => inlineControlToggle(id)}/>
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

export default connector(SongTable);