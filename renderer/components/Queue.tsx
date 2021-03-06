import * as React from "react";
import Clock from "@img/clock.svg";
import Trash from "@img/trash.svg";
import {clearHistory, clearQueue, dequeue, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {ISong} from "../interfaces";

const mapState = (state: RootState) => ({
	queue: state.queue,
	library: state.library
});

const mapDispatch = {
	dequeue,
	clearHistory,
	clearQueue
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

class Queue extends React.Component<Props, {showHistory: boolean}> {
	state = {
		showHistory: false
	};

	getLength(length: number) {
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
	}

	render() {
		const {queue, dequeue, library, clearHistory, clearQueue} = this.props;
		const {showHistory} = this.state;

		return (
			<div className={"flex flex-col justify-center px-8 py-2 text-white"}>
				<button className={"w-max-content hover-opacity focus:outline-none"}
						onClick={() => this.setState({showHistory: !showHistory})}>
					{showHistory &&
						"hide history"
					}
					{!showHistory &&
						"show history"
					}
				</button>
					{showHistory &&
						<>
							<div className={"flex gap-2 text-xl"}>
								History
								<img className={"hover-opacity mr-2"}
									 alt={"Clear history"}
									 src={Trash}
									 onClick={() => clearHistory()}/>
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
								{queue.history.map((id: string, i: number) => {
									const {
										metadata: {
											title,
											album,
											artist,
											duration
										}
									} = library.songs.find((song: ISong) => song.id === id);
									return (
										<>
											<tr>
												<td className={"w-8 mr-2"}/>
												<td>{title}</td>
												<td className={"text-right"}>{album || "No Album"}</td>
												<td className={"text-right"}>{artist || "No Artist"}</td>
												<td className={"text-right"}>{this.getLength(duration)}</td>
											</tr>

											{i !== queue.history.length - 1 &&
											<tr key={`${i}-separator`}>
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
							<div className={"my-2 bottom-separator"}/>
						</>
					}
				<div className={"flex gap-2 text-xl"}>
					Queue
					<img className={"hover-opacity mr-2"}
						 alt={"Clear queue"}
						 src={Trash}
						 onClick={() => clearQueue()}/>
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
						{queue.songs.map((id: string, i: number) => {
							const {
								metadata: {
									title,
									album,
									artist,
									duration
								}
							} = library.songs.find((song: ISong) => song.id === id);
							return (
								<>
									<tr>
										<td>
											<img className={"hover-opacity mr-2"}
												 alt={"Remove"}
												 src={Trash}
												 onClick={() => dequeue(i)}/>
										</td>
										<td>{title}</td>
										<td className={"text-right"}>{album || "No Album"}</td>
										<td className={"text-right"}>{artist || "No Artist"}</td>
										<td className={"text-right"}>{this.getLength(duration)}</td>
									</tr>

									{i !== queue.songs.length - 1 &&
									<tr key={`${i}-separator`}>
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

}

export default connector(Queue);