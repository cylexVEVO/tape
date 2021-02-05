import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {playerReducer} from "./player";
import {libraryReducer} from "./library";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";

const reducers = combineReducers({
	player: playerReducer,
	library: libraryReducer
});

const persistConfig = {
	key: "root",
	storage
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer
});

const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export * from "./player";
export * from "./library";

export {
	store,
	persistedStore
};