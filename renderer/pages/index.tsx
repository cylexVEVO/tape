import * as React from "react";
import Tape from "@components/Tape";
import {setupAudioContext} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import BottomPanel from "@components/BottomPanel";

let platform: string;

const connector = connect(null, {setupAudioContext});

type Props = ConnectedProps<typeof connector>;

class Index extends React.Component<Props> {
	componentDidMount() {
		this.props.setupAudioContext();
	}

	render() {
		if (!platform) platform = window.require("@electron/remote").process.platform;

		return (
			<div className={"h-full bg-black flex items-center justify-center text-white font-sans"}>
				{platform === "darwin" &&
					<div className={"fixed w-full top-0 drag-region"}/>
				}
				<div id={"modal-mount"} className={"modal-mount"}/>
				<audio id={"audio"}/>
				<Tape/>
				<BottomPanel/>
			</div>
		);
	}
}

export default connector(Index);