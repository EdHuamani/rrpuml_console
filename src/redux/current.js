import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";


const current = createSlice({
    name: 'current',
    initialState: { uid: '', name: '', profile: '', section: '' },
    reducers: {
        setUserName: (state, action) => {
            state.name = action.payload // mutate the state all you want with immer
        },
        setProfile: (state, action) => {
            state.profile = action.payload // mutate the state all you want with immer
        },
        setSection: (state, action) => {
            state.section = action.payload.section;
            state.profile = action.payload.profile;
            state.name = action.payload.name;
            state.uid = action.payload.uid;
        },
    },
    // "map object API"
    // extraReducers: {
    //     [counter.actions.increment]: (
    //         state,
    //         action /* action will be inferred as "any", as the map notation does not contain type information */
    //     ) => {
    //         state.age += 1
    //     },
    // },
})
export default current.reducer;



export function onUserStateChanged({ userAuth }) {

    return async dispatch => {
        // dispatch(ser.actions.starLoading);

        try {
            if (userAuth) {
                const docRef = doc(db, "users", userAuth.uid);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                // dispatch(current.actions?.setUserName(data.name));
                // dispatch(current.actions?.setProfile(data.profile));
                dispatch(current.actions?.setSection({
                    uid: userAuth.uid,
                    section: data.section,
                    name: data.name,
                    profile: data.profile,
                }));
            }
            else {

                // dispatch(current.actions?.setUserName(''));
                // dispatch(current.actions?.setProfile(''));
                dispatch(current.actions?.setSection({
                    uid: '',
                    section: '',
                    name: '',
                    profile: '',
                }));
            }
        } catch (error) {
            console.log(error);
            // dispatch(userSlice.actions.stopLoading);
        }
    }
}
