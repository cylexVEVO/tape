import * as React from "react";
import {RootState, resume, pause} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import Library from "./Library";
import Rewind from "../../assets/img/rewind.svg";
import Play from "../../assets/img/play.svg";
import Pause from "../../assets/img/pause.svg";
import FastForward from "../../assets/img/fast-forward.svg";

const mapState = (state: RootState) => ({
	playing: state.player.playing,
	currentSongId: state.player.currentSongId
});

const mapDispatch = {
	resume,
	pause
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
			<div onClick={() => switchTo()} className={`nav-item ${selected ? "selected" : ""}`}>
				{children}
			</div>
		);
	}
}

class BottomPanel extends React.Component<Props, {expanded: boolean, selectedTab: number}> {
	state = {
		expanded: true,
		selectedTab: 1
	};

	render() {
		const {playing, resume, pause, currentSongId} = this.props;
		const {expanded, selectedTab} = this.state;

		let ToggleIcon = () => playing ?
			<img className={currentSongId ? "" : "cursor-not-allowed transition ease duration-200 opacity-20"} alt={"Pause"} src={Pause} onClick={() => pause()}/> :
			<img className={currentSongId ? "" : "cursor-not-allowed transition ease duration-200 opacity-20"} alt={"Play"} src={Play} onClick={() => resume()}/>;

		return (
			<div className={`fixed w-full bottom-panel pt-28 ${expanded ? "expanded" : ""}`}>
				<div className={"absolute top-0 w-full"}>
					<div className={"flex h-20 items-center justify-center bottom-separator"}>
						<div className={"absolute top-0 w-20 flex justify-center expand-button-area"} onClick={() => this.setState({expanded: !expanded})}>
							{/* TODO: move as many styles as possible out of css and into className */}
							<div className={"expand-button"}/>
						</div>
						<div className={"inline-flex gap-5"}>
							{/* TODO: disable previous song if no recent play history, toggle if no current queue, next song if no queue after current song */}
							<img alt={"Previous Song"} src={Rewind}/>
							<ToggleIcon/>
							<img alt={"Next Song"} src={FastForward}/>
						</div>
					</div>
					<div className={"flex gap-5 nav items-center justify-center bottom-separator"}>
						<NavItem switchTo={() => this.setState({selectedTab: 1})} selected={selectedTab === 1}>
							Library
						</NavItem>
						<NavItem switchTo={() => this.setState({selectedTab: 2})} selected={selectedTab === 2}>
							Playlists
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
						Playlists
					</NavTab>
					<NavTab show={selectedTab === 3}>
						Queue
					</NavTab>
				</div>
			</div>
		);
	}
}

export default connector(BottomPanel);