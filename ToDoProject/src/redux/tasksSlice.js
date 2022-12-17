import { createSlice } from '@reduxjs/toolkit';

const initialState={
    dataLoadState: 0, // 0 - not loaded, 1 - is loading, 2 - loaded, 3 - error
    dataLoadError: null,
    dataCurrent: null,
    dataCompleted: null
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        updateLoadState: (state,action) => {
            state.dataLoadState = action.payload.state;
            state.dataLoadError = action.payload.error;
        },

        updateData: (state,action) => {
            state.dataCurrent = action.payload.current;
            state.dataCompleted = action.payload.completed;
        },
    },
});

export const { updateLoadState, updateData} = tasksSlice.actions;
export default tasksSlice.reducer;

