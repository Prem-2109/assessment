import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formData: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
    },
    errors: {},
    message: "",
};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        updateField: (state, action) => {
            state.formData[action.payload.field] = action.payload.value;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        resetForm: (state, action) => {
            state.formData = initialState.formData;
            state.errors = {};
            state.message = action.payload || "";
        },
    },
});

export const { updateField, setErrors, resetForm } = formSlice.actions;
export default formSlice.reducer;
