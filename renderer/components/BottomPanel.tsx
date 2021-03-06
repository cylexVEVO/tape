import * as React from "react";
import {
	RootState,
	resume,
	pause,
	changeVolume,
	clearQueue,
	clearHistory,
	dequeue,
	play,
	removeHistory,
	addHistory,
	queue
} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import Library from "./Library";
import Rewind from "@img/rewind.svg";
import Play from "@img/play.svg";
import Pause from "@img/pause.svg";
import FastForward from "@img/fast-forward.svg";
import Volume from "@img/volume-up.svg";
import Queue from "@components/Queue";
import Mixtape from "@components/Mixtape";

const mapState = (state: RootState) => ({
	playing: state.player.playing,
	currentSongId: state.player.currentSongId,
	player: state.player,
	queue: state.queue
});

const mapDispatch = {
	play,
	resume,
	pause,
	changeVolume,
	clearQueue,
	clearHistory,
	dequeue,
	removeHistory,
	addHistory,
	queueSong: queue
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class NavTab extends React.Component<{show: boolean}> {
	render() {
		const {show, children} = this.props;

		if (show) {
			return (
				<>
					{children}
				</>
			);
		} else {
			return null;
		}
	}
}

class NavItem extends React.Component<{switchTo: () => void, selected: boolean}> {
	render() {
		// TODO: move selected tab to redux store and just pass tab number to this component
		const {switchTo, selected, children} = this.props;

		return (
			<div onClick={() => switchTo()} className={`hover-opacity nav-item ${selected ? "selected" : ""}`}>
				{children}
			</div>
		);
	}
}

class BottomPanel extends React.Component<Props, {expanded: boolean, selectedTab: number, showVolume: boolean, volumeHideTimeout: number}> {
	state = {
		expanded: true,
		selectedTab: 2,
		showVolume: false,
		volumeHideTimeout: 0
	};

	toggleVolume() {
		const {showVolume, volumeHideTimeout} = this.state;

		document.querySelector<HTMLDivElement>("#volume")!.addEventListener("mouseenter", () => {
			if (this.state.volumeHideTimeout !== 0) {
				window.clearTimeout(this.state.volumeHideTimeout);
				const timeout = window.setTimeout(() => {
					this.setState({showVolume: false, volumeHideTimeout: 0});
				}, 10 * 1000);
				this.setState({volumeHideTimeout: timeout});
			}
		});

		if (showVolume) {
			window.clearTimeout(volumeHideTimeout);
			this.setState({showVolume: false, volumeHideTimeout: 0});
		} else {
			const timeout = window.setTimeout(() => {
				this.setState({showVolume: false, volumeHideTimeout: 0});
			}, 10 * 1000);
			this.setState({showVolume: true, volumeHideTimeout: timeout});
		}
	}

	playNext() {
		const {play, queue, dequeue, currentSongId, addHistory} = this.props;
		const next = queue.songs[0];

		if (queue.songs.length && next) {
			addHistory(currentSongId);
			play(next);
			dequeue(0);
		}
	}

	playPrevious() {
		const {play, queue, removeHistory, currentSongId, queueSong} = this.props;
		const previous = queue.history[0];

		if (queue.history.length && previous) {
			queueSong({id: currentSongId, position: "first"});
			play(previous);
			removeHistory(0);
		}
	}

	render() {
		const {player, playing, resume, pause, currentSongId, changeVolume, queue} = this.props;
		const {expanded, selectedTab, showVolume} = this.state;

		return (
			<div id={"bottom-panel"} className={`fixed w-full bottom-panel pt-28 ${expanded ? "expanded" : ""}`}>
				<div className={"absolute top-0 w-full"}>
					<div className={"flex h-20 items-center justify-center bottom-separator"}>
						<div className={"absolute top-0 w-20 flex justify-center expand-button-area z-20"} onClick={() => this.setState({expanded: !expanded})}>
							{/* TODO: move as many styles as possible out of css and into className */}
							<div className={"expand-button"}/>
						</div>
						<img className={`absolute left-8 ${showVolume ? "" : "hover-opacity"}`}
							 alt={"Volume"}
							 src={Volume}
							 onClick={() => this.toggleVolume()}/>
						<div id={"volume"} style={{top: 2}} className={`flex justify-center items-center absolute left-16 right-8 bottom-10 z-10 transition ease duration-150 ${showVolume ? "" : "opacity-0 pointer-events-none"}`}>
							<input id={"volume-bar"} min={0} max={1} step={0.001} className={"w-full"} type={"range"} value={player.volume} onChange={(e) => changeVolume(e.target.valueAsNumber)}/>
						</div>
						<div className={`inline-flex gap-5 transition ease duration-150 ${showVolume ? "blur" : ""}`}>
							{/* TODO: disable previous song if no recent play history, toggle if no current queue, next song if no queue after current song */}
							<img className={queue.history.length ? "" : "cursor-not-allowed opacity-20"} alt={"Previous Song"} src={Rewind} onClick={() => this.playPrevious()}/>
							{playing &&
								<img className={currentSongId ? "" : "cursor-not-allowed opacity-20"} alt={"Pause"} src={Pause} onClick={() => pause()}/>
							}
							{!playing &&
								<img className={currentSongId ? "" : "cursor-not-allowed opacity-20"} alt={"Play"} src={Play} onClick={() => resume()}/>
							}
							<img className={queue.songs.length ? "" : "cursor-not-allowed opacity-20"} alt={"Next Song"} src={FastForward} onClick={() => this.playNext()}/>
						</div>
					</div>
					<div className={"flex gap-5 nav items-center justify-center bottom-separator"}>
						<NavItem switchTo={() => this.setState({selectedTab: 1})} selected={selectedTab === 1}>
							Library
						</NavItem>
						<NavItem switchTo={() => this.setState({selectedTab: 2})} selected={selectedTab === 2}>
							Mixtapes
						</NavItem>
						<NavItem switchTo={() => this.setState({selectedTab: 3})} selected={selectedTab === 3}>
							Queue
						</NavItem>
					</div>
				</div>
				{/* whatever */}
				<div className={"h-px"}/>
				<div className={"mt-1 pb-2 h-full overflow-y-auto sick-nasty-scrollbar-dude"}>
					<NavTab show={selectedTab === 1}>
						<Library/>
					</NavTab>
					<NavTab show={selectedTab === 2}>
						<Mixtape/>
					</NavTab>
					<NavTab show={selectedTab === 3}>
						<Queue/>
					</NavTab>
				</div>
			</div>
		);
	}
}

export default connector(BottomPanel);