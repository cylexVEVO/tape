import * as React from "react";
import * as ReactDOM from "react-dom";

class Modal extends React.Component<{show: boolean, hide: () => void}> {
	render() {
		const {children, show, hide} = this.props;

		if (!show) return null;

		return ReactDOM.createPortal(
			<>
				<div className={"modal-bg"}/>
				<div className={"modal"}>
					<div className={"p-4"}>
						{React.Children.toArray(children)[0]}
					</div>
					<div className={"controls px-4 py-2 flex gap-4"}>
						<div className={"ml-auto"}/>
						<button className={"hover-opacity focus:outline-none"} onClick={() => hide()}>cancel</button>
						{React.Children.toArray(children)[1]}
					</div>
				</div>
			</>,
			document.querySelector("#modal-mount")!
		);
	}
}

export default Modal;