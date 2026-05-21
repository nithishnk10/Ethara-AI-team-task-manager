import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "member"
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!name || !email || !password) {

            return toast.error(
                "❌ All fields are required"
            );

        }

        try {

            const response = await API.post(
                "/auth/signup",
                formData
            );

            alert(response.data.message);

            navigate("/");

        } catch (error) {

            alert(error.response.data.message);

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "300px",
                margin: "100px auto"
            }}
        >

            <h1>Signup</h1>

            <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <select
                name="role"
                onChange={handleChange}
            >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
            </select>

            <button type="submit">
                Signup
            </button>

        </form>

    );
}

export default Signup;