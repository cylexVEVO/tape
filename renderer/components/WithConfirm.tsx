import * as React from "react";

class WithConfirm extends React.Component<{action: () => void}, {confirm: boolean}> {
	state = {
		confirm: false
	};

	render() {
		const {action, children} = this.props;
		const {confirm} = this.state;

		if (!confirm) {
			return (
				<div onClick={() => this.setState({confirm: true})}>
					{React.Children.toArray(children)[0]}
				</div>
			);
		}

		return (
			<div onClick={() => action()}>
				{React.Children.toArray(children)[1]}
			</div>
		);
	}
}

export default WithConfirm;