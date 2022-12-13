import { createSlice } from '@reduxjs/toolkit';

/*const initialState=[
    {id:101, fam:"Иванов", im:"Иван", otch:"Иванович", balance:-200},
    {id:105, fam:"Сидоров", im:"Сидор", otch:"Сидорович", balance:250},
    {id:110, fam:"Петров", im:"Пётр", otch:"Петрович", balance:180},
    {id:120, fam:"Григорьев", im:"Григорий", otch:"Григорьевич", balance:-220}
]*/

const initialState={
    dataLoadState: 0, // 0 - not loaded, 1 - is loading, 2 - loaded, 3 - error
    dataLoadError: null,
    dataCurrent: null,
    dataCompleted: null
}

export const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {

        /*clientAdd: (state,action) => {
            state.push(action.payload);

        },

        clientChange: (state,action) => {
            let ind;
            state.forEach((client, i) => {
                if (client.id == action.payload.id) {
                    ind = i;
                }
            })
            state[ind] = action.payload;
        },*/

        /*clientDelete: (state,action) => {
            let delClientIndex;
            for ( let i=0; state.length; i++) {
                let client = state[i];
                if (client.id == action.payload) {
                    delClientIndex = i;
                    break;
                }
            };
            state.splice(delClientIndex, 1);
        },*/

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

export const { clientAdd, clientChange, clientDelete, updateLoadState, updateData} = clientsSlice.actions;
export default clientsSlice.reducer;

