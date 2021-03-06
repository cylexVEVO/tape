import * as React from "react";
import InlinePause from "@img/pause-inline.svg";
import InlinePlay from "@img/play-inline.svg";
import Clock from "@img/clock.svg";
import {useGlobalFilter, useRowSelect, useTable} from "react-table";
import {addHistory, pause, play, resetSong, resume, removeSong, RootState} from "../redux";
import {connect, ConnectedProps} from "react-redux";
import {ISong} from "../interfaces";
import Trash from "@img/trash.svg";
import TrashConfirm from "@img/trash-confirm.svg";
import Plus from "@img/plus-circle.svg";
import WithConfirm from "@components/WithConfirm";
import SelectMixtapes from "@components/SelectMixtapes";

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

// @ts-ignore
const SearchBar = ({globalFilter, setGlobalFilter}) => {
	const [value, setValue] = React.useState(globalFilter);

	return (
		<input className={"bg-transparent bottom-separator w-full mb-2 focus:outline-none pl-1 pb-1"}
			   placeholder={"Search your library..."}
			   type={"text"}
			   value={value || ""}
			   onChange={(e) => {
			   		setValue(e.target.value);
				   	setGlobalFilter(e.target.value || undefined);
			   }}/>
	);
};

const Table = (props: Props) => {
	const [showSelectMixtape, setShowSelectMixtape] = React.useState(false);
	const {playing, currentSongId, play, pause, resume, addHistory, library, resetSong, removeSong} = props;

	const handleHide = (added: boolean) => {
		setShowSelectMixtape(false);
		if (added) Object.keys(selectedRowIds).map((id) => toggleRowSelected(Number(id)));
	}

	const removeSelected = () => {
		const selectedIds = Object.keys(selectedRowIds).map((id) => data[Number(id)].col0);
		Object.keys(selectedRowIds).map((id) => toggleRowSelected(Number(id)));
		if (selectedIds.includes(currentSongId)) resetSong();
		selectedIds.map((id) => removeSong(id));
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

	const data = React.useMemo(
		() => {
			const returnValue: {col0: string, col1: JSX.Element, col2: string, col3: string, col4: string, col5: string}[] = [];

			library.songs.map((song: ISong) => {
				const {id, metadata: {title, album, artist, duration}} = song;
				returnValue.push({
					col0: id,
					col1: <img className={"hover-opacity"}
							   alt={playing && currentSongId === id ? "Pause" : "Play"}
							   src={playing && currentSongId === id ? InlinePause : InlinePlay}
							   onClick={() => inlineControlToggle(id)}/>,
					col2: title,
					col3: album,
					col4: artist,
					col5: getLength(duration)
				});
			});

			return returnValue;
		},
		[playing, currentSongId, library.songs]
	);

	const columns = React.useMemo(
		() => [
			{
				Header: "",
				accessor: "col0",
				width: 0,
				Cell: () => {
					return (
						<div/>
					);
				}
			},
			{
				Header: "",
				// @ts-ignore
				Cell: ({cell: {value}}) => {
					return (
						<div className={"text-left z-20"}>{value}</div>
					);
				},
				accessor: "col1"
			},
			{
				Header: () => {
					return (
						<div className={"opacity-20 text-left"}>Title</div>
					);
				},
				// @ts-ignore
				Cell: ({value}) => {
					return (
						<div className={"text-left z-20"}>{value}</div>
					);
				},
				accessor: "col2"
			},
			{
				Header: () => {
					return (
						<div className={"opacity-20 text-right"}>Album</div>
					);
				},
				// @ts-ignore
				Cell: ({value}) => {
					return (
						<div className={"text-right z-20"}>{value}</div>
					);
				},
				accessor: "col3"
			},
			{
				Header: () => {
					return (
						<div className={"opacity-20 text-right"}>Artist</div>
					);
				},
				// @ts-ignore
				Cell: ({value}) => {
					return (
						<div className={"text-right z-20"}>{value}</div>
					);
				},
				accessor: "col4"
			},
			{
				Header: () => {
					return (
						<div><img className={"ml-auto"} alt={"Length"} src={Clock}/></div>
					);
				},
				// @ts-ignore
				Cell: ({value}) => {
					return (
						<div className={"text-right z-20"}>{value}</div>
					);
				},
				accessor: "col5"
			}
		],
		[]
	);

	// @ts-ignore
	const tableInstance = useTable({columns, data}, useGlobalFilter, useRowSelect);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		// @ts-ignore
		setGlobalFilter,
		// @ts-ignore
		state: {selectedRowIds, globalFilter},
		// @ts-ignore
		toggleRowSelected
	} = tableInstance;

	return (
		<>
			<SelectMixtapes show={showSelectMixtape} hide={(added: boolean) => handleHide(added)} selectedSongs={Object.keys(selectedRowIds).map((id) => data[Number(id)].col0)}/>
			{Object.keys(selectedRowIds).length === 0 &&
				<SearchBar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>
			}
			{Object.keys(selectedRowIds).length > 0 &&
				<div className={"flex w-full gap-4"}>
					<WithConfirm action={() => removeSelected()}>
						<button className={"flex items-center gap-1 focus:outline-none hover-opacity"}>
							<img alt={""} src={Trash}/>
							Remove selected
						</button>
						<button className={"flex items-center focus:outline-none text-red-500"}>
							<img className={"mr-1"} alt={""} src={TrashConfirm}/>
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
			<table {...getTableProps()} className={"table-auto w-full"}>
				<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps()}>
								{column.render("Header")}
							</th>
						))}
					</tr>
				))}
				</thead>
				<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row);
					return (
						// @ts-ignore
						<tr {...row.getRowProps()} className={`py-2 bottom-separator max-w-100 ${row.isSelected ? "bg-blue-500" : ""}`} onClick={() => toggleRowSelected(row.id)}>
							{row.cells.map((cell) => {
								return (
									<td {...cell.getCellProps()}>
										<div className={"h-2"}/>
										{cell.render("Cell")}
										<div className={"h-2"}/>
									</td>
								);
							})}
						</tr>
					);
				})}
				</tbody>
			</table>
		</>
	);
};

export default connector(Table);