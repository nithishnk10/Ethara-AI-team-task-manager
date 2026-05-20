import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { toast } from "react-toastify";

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
        if (
            !formData.email ||
            !formData.password
        ) {

            return toast.error(
                "❌ Email and password required"
            );

        }
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

            toast.success("✅ Login Successful");

            if (response.data.user.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/member");

            }

        } catch (error) {

        toast.error(
            error.response.data.message
        );

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