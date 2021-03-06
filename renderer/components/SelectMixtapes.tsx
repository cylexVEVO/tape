import * as React from "react";
import {RootState, mixtape_addSong} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {IMixtape} from "../interfaces";
import {ChangeEvent} from "react";
import Modal from "@components/Modal";

const mapState = (state: RootState) => ({
	mixtapes: state.library.mixtapes
});

const mapDispatch = {
	mixtape_addSong
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class SelectMixtapes extends React.Component<Props & {show: boolean, selectedSongs: string[], hide: (added: boolean) => void}, {selectedMixtapes: string[]}> {
	state = {
		selectedMixtapes: [""]
	};

	componentDidMount() {
		this.setState({selectedMixtapes: []});
	}

	handleCheckChange(e: ChangeEvent<HTMLInputElement>, id: string) {
		const {selectedMixtapes} = this.state;

		if (e.target.checked) {
			if (!selectedMixtapes.includes(id)) {
				this.setState({selectedMixtapes: [...selectedMixtapes, id]});
			}
		} else {
			if (selectedMixtapes.includes(id)) {
				this.setState({selectedMixtapes: selectedMixtapes.filter((id2) => id2 !== id)});
			}
		}
	}

	addSelectedToMixtape() {
		const {mixtape_addSong, selectedSongs, hide} = this.props;
		const {selectedMixtapes} = this.state;

		selectedMixtapes.map((mixtape) => {
			selectedSongs.map((song) => {
				mixtape_addSong({mixtape, song});
			});
		});

		setTimeout(() => hide(true), 100);
	}

	render() {
		const {mixtapes, show, hide} = this.props;
		const {selectedMixtapes} = this.state;

		return (
			<Modal show={show} hide={() => hide(false)}>
				<>
					<div className={"text-xl"}>
						Add to mixtapes
					</div>
					<table className={"table-auto w-full"}>
						<thead>
							<tr>
								<th/>
								<th className={"font-normal opacity-20 text-left w-full"}>Mixtape</th>
							</tr>
						</thead>
						<tbody>
							{mixtapes.map((mixtape: IMixtape) => {
								return (
									<>
										<tr key={mixtape.id}>
											<td>
												<input className={"mr-2"}
													   type={"checkbox"}
													   checked={selectedMixtapes.includes(mixtape.id)}
													   onChange={(e) => this.handleCheckChange(e, mixtape.id)}/>
											</td>
											<td>{mixtape.name}</td>
										</tr>

										{mixtapes.indexOf(mixtape) !== mixtapes.length - 1 &&
											<tr key={`${mixtape.id}-separator`}>
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
				</>
				<button className={"hover-opacity"} onClick={() => this.addSelectedToMixtape()}>add to mixtape</button>
			</Modal>
		)
	}
}

export default connector(SelectMixtapes);