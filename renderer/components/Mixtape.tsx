import * as React from "react";
import {RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {IMixtape} from "../interfaces";
import Song from "@components/Song";
import InlinePause from "@img/pause-inline.svg";
import InlinePlay from "@img/play-inline.svg";
import Clock from "@img/clock.svg";
import CreateMixtape from "@components/CreateMixtape";

const mapState = (state: RootState) => ({
	library: state.library,
	currentSongId: state.player.currentSongId,
	playing: state.player.playing
});

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>;

class Mixtape extends React.Component<Props, {selected: string, showCreateMixtape: boolean}> {
	state = {
		selected: "",
		showCreateMixtape: false
	};

	playlistView() {
		const {library: {mixtapes}, playing, currentSongId} = this.props;
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
					</div>
				</div>
				<table className={"table-auto w-full"}>
					<thead>
					<tr>
						<th/>
						<th className={"font-normal text-left"}>
							<div className={"opacity-20"}>Title</div>
						</th>
						<th className={"font-normal opacity-20 text-right"}>Album</th>
						<th className={"font-normal opacity-20 text-right"}>Artist</th>
						<th><img className={"ml-auto"} alt={"Length"} src={Clock}/></th>
					</tr>
					</thead>
					<tbody>
						{songs.map((id: string) => {
							return (
								<>
									<Song key={id} id={id} icon={
										<img className={"hover-opacity mr-2"}
											 alt={playing && currentSongId === id ? "Pause" : "Play"}
											 src={playing && currentSongId === id ? InlinePause : InlinePlay}/>
									}/>

									{songs.indexOf(id) !== songs.length - 1 &&
										<tr key={`${id}-separator`}>
											<td className={"py-1"} colSpan={5}>
												<div className={"bottom-separator"}/>
											</td>
										</tr>
									}
								</>
							);
						})}
					</tbody>
				</table>
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
						<div className={"hover-opacity"} onClick={() => this.setState({showCreateMixtape: true})}>
							create playlist
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