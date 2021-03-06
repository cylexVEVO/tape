// TODO: cleanup reducers
// @ts-ignore
import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {playerReducer} from "./player";
import {libraryReducer} from "./library";
import {queueReducer} from "./queue";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist";

const reducers = combineReducers({
	player: playerReducer,
	library: libraryReducer,
	queue: queueReducer
});

const persistConfig = {
	key: "root",
	storage
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
		}
	})
});

const persistedStore = persistStore(store);

// @ts-ignore
export type RootState = ReturnType<typeof store.getState>;

export * from "./player";
export * from "./library";
export * from "./queue";

export {
	store,
	persistedStore
};