import * as React from "react";
import Tape from "../components/Tape";
import {setupAudioContext} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import BottomPanel from "../components/BottomPanel";

const connector = connect(null, {setupAudioContext});

type Props = ConnectedProps<typeof connector>;

class Index extends React.Component<Props> {
	componentDidMount() {
		this.props.setupAudioContext();
	}

	render() {
		return (
			<div className={"h-full bg-black flex items-center justify-center text-white font-sans"}>
				<audio id={"audio"}/>
				<Tape/>
				<BottomPanel/>
			</div>
		);
	}
}

export default connector(Index);