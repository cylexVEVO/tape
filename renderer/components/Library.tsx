import * as React from "react";
import Table from "@components/Table";
import ImportSongs from "@components/ImportSongs";

class Library extends React.Component {
	render() {
		// TODO: add sorting
		return (
			<div className={"px-8 pt-2 text-white"}>
				<Table/>
				<ImportSongs/>
			</div>
		);
	}
}

export default Library;