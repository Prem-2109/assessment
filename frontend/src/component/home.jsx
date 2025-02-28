import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetForm, setErrors } from "../redux/formSlice";
import axios from "axios";

const Home = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.form.formData);
    const errors = useSelector((state) => state.form.errors);
    const message = useSelector((state) => state.form.message);
    const [showForm, setShowForm] = useState(true); // Toggle between form and user data
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://assessment-iwgp.onrender.com/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const is18OrOlder = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleChange = (e) => {
        dispatch(updateField({ field: e.target.name, value: e.target.value }));
    };

    const validate = () => {
        const validationErrors = {};

        if (!formData.firstName.trim()) validationErrors.firstName = "First Name is required";
        else if (formData.firstName.length > 50) validationErrors.firstName = "First Name cannot exceed 50 characters";

        if (!formData.lastName.trim()) validationErrors.lastName = "Last Name is required";
        else if (formData.lastName.length > 50) validationErrors.lastName = "Last Name cannot exceed 50 characters";

        if (!formData.email.trim()) validationErrors.email = "Email is required";
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) validationErrors.email = "Please enter a valid email";
        }

        if (!formData.password) validationErrors.password = "Password is required";
        else if (formData.password.length < 8) validationErrors.password = "Password must be at least 8 characters";

        if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

        if (!formData.dateOfBirth) validationErrors.dateOfBirth = "Date of Birth is required";
        else if (!is18OrOlder(formData.dateOfBirth)) validationErrors.dateOfBirth = "You must be at least 18 years old";

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setErrors({}));

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            dispatch(setErrors(validationErrors));
            return;
        }

        try {
            const response = await axios.post("https://assessment-iwgp.onrender.com/register", formData);
            dispatch(resetForm(response.data.message));
            const updatedUsers = await axios.get("https://assessment-iwgp.onrender.com/users");
            setUsers(updatedUsers.data);
        } catch (error) {
            dispatch(setErrors({ general: error.response?.data?.message || "Something went wrong!" }));
        }
    };

    return (
        <div className="container pt-5">
            <div className="row">
                <div className="col-lg-2 col-md-2"></div>
                <div className="col-lg-8 col-md-8">
                    {showForm ? (
                        <div className="card">
                            <div className="card-header">
                                <span className="h4">Registration</span>
                            </div>
                            <div className="card-body">
                                {message && <p className="text-success">{message}</p>}
                                {errors.general && <p className="text-danger">{errors.general}</p>}
                                <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="firstName">First Name</label>
                                        <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
                                        {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                                    </div>
                                </div>
                                <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                        {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                    </div>
                                </div>
                                <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                    {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
                                </div>
                                </div>
                                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                    <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={() => setShowForm(false)}>View Data</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="card mt-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span className="h4">Registered Users</span>
                                <button className="btn btn-primary" onClick={() => setShowForm(true)}>Back to Form</button>
                            </div>
                            <div className="card-body">
                                {users.length === 0 ? (
                                    <p>No users registered yet.</p>
                                ) : (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Date of Birth</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id}>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-lg-2 col-md-2"></div>
            </div>
        </div>
    );
};

export default Home;
