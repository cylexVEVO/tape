import * as React from "react";
import {AppProps} from "next/app";
import "../styles/globals.css";
import {Provider} from "react-redux";
import {persistedStore, store} from "../redux";
import {PersistGate} from "redux-persist/integration/react";

class App extends React.Component<AppProps> {
	render() {
		const {Component, pageProps} = this.props;

		return (
			<Provider store={store}>
				<PersistGate persistor={persistedStore}>
					<Component {...pageProps}/>
				</PersistGate>
			</Provider>
		);
	}
}

export default App;