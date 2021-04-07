import * as React from "react";
import {addMixtape} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import Modal from "@components/Modal";

const mapDispatch = {
	addMixtape
};

const connector = connect(null, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class CreateMixtape extends React.Component<Props & {show: boolean, hide: () => void}, {name: string}> {
	state = {
		name: ""
	};

	create() {
		// TODO: provide feedback 4 invalid fields
		if (Object.values(this.state).includes("")) return;
		this.props.addMixtape({...this.state, ...{icon: "", dynamic: false, songs: [], include: []}});
		setTimeout(() => this.props.hide(), 100);
	}

	render() {
		// TODO: add other fields
		const {show, hide} = this.props;
		const {name} = this.state;

		return (
			<Modal show={show} hide={() => hide()}>
				<>
					<div className={"text-xl"}>
						Create a Mixtape
					</div>
					<input type={"text"} value={name} onChange={(e) => this.setState({name: e.target.value})} placeholder={"Mixtape name"} className={"my-2"}/>
				</>
				<button className={"hover-opacity"} onClick={() => this.create()}>create mixtape</button>
			</Modal>
		)
	}
}

export default connector(CreateMixtape);