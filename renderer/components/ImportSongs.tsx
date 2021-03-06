import * as React from "react";
import {addSong} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import Open from "@img/folder-open.svg";

const mapDispatch = {
	addSong
};

const connector = connect(null, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class ImportSongs extends React.Component<Props> {
	importSongs() {
		// TODO: add message when importing songs with titles of songs already in libraries,
		// 	smth like "you're importing songs that appear to already be in your library. do you want to skip these or add them anyways? [skip duplicates/add anyways]"
		const remote = window.require("@electron/remote");

		remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
			filters: [
				{
					name: "Audio Files",
					extensions: ["mp3", "aac", "wav", "ogg", "m4a", "flac"]
				}
			],
			properties: ["openFile", "multiSelections"]
		}).then((selection: any) => {
			if (selection.canceled) return;
			selection.filePaths.map((pathName: string) => this.props.addSong(pathName));
		});
	}

	render() {
		return (
			<div className={"text-center py-2"}>
				<div className={"inline-flex items-center gap-2 hover-opacity"} onClick={() => this.importSongs()}>
					<img alt={""} src={Open}/>
					Import music
				</div>
			</div>
		);
	}
}

export default connector(ImportSongs);