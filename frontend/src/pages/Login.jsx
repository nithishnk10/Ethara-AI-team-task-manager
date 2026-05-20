import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );

            // Save token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Login successful");

            if (response.data.user.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/member");

            }

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

            <h1>Login</h1>

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

            <button type="submit">
                Login
            </button>

        </form>

    );
}

export default Login;