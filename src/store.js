import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './redux/authSlice';
import currentReducer from './redux/current';

import logger from 'redux-logger';
const reducer = combineReducers({
    current: currentReducer,
    user: userReducer,
})
const store = configureStore({
    // reducer: {
    //     user: userReducer
    // },
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store;

// import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

// import monitorReducersEnhancer from './enhancers/monitorReducers'
// import loggerMiddleware from './middleware/logger';


// // import rootReducer from './reducers'

// export default function configureAppStore(preloadedState) {
//     const store = configureStore({
//         reducer: { userReducer },
//         // middleware: [thunk, loggerMiddleware],
//         // middleware: (getDefaultMiddleware) =>
//         //     getDefaultMiddleware().concat(routerMiddleware(history)),
//         middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
//         preloadedState,
//         // enhancers: [monitorReducersEnhancer]
//     })

//     // if (process.env.NODE_ENV !== 'production' && module.hot) {
//     //     module.hot.accept('./reducers', () => store.replaceReducer(userReducer))
//     // }

//     return store
// }