import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

function UserForm() {
    const [name, setName] = useState("");
    const [socialMediaHandle, setSocialMediaHandle] = useState("");
    const [images, setImages] = useState([]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("socialMediaHandle", socialMediaHandle);
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            await axios.post("https://demo-project-backend-three.vercel.app/submit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Submission Successful!");
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div>
            <h1>User Submission Form</h1>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Social Media Handle"
                    value={socialMediaHandle}
                    onChange={(e) => setSocialMediaHandle(e.target.value)}
                    required
                />
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <Link to="/dashboard">Go to Admin Dashboard</Link>
        </div>
    );
}

function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);

    // Fetch submissions from the backend
    const fetchSubmissions = async () => {
        try {
            const response = await axios.get("https://demo-project-backend-three.vercel.app/submissions");
            setSubmissions(response.data);
        } catch (error) {
            console.error("Error fetching submissions", error);
        }
    };

    // Fetch submissions when the component mounts
    useEffect(() => {
        fetchSubmissions();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <Link to="/" style={{ marginBottom: "20px", display: "inline-block" }}>
                Go to User Submission Form
            </Link>
            <div style={{ marginTop: "20px" }}>
                {submissions.length === 0 ? (
                    <p>No submissions available.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                        {submissions.map((submission) => (
                            <div
                                key={submission._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3 style={{ marginBottom: "10px" }}>{submission.name}</h3>
                                <p>
                                    <strong>Social Media Handle:</strong> {submission.socialMediaHandle}
                                </p>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                                    {submission.images.map((image, index) => (
                                        <a
                                            key={index}
                                            href={`https://demo-project-backend-three.vercel.app/${image}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={`https://demo-project-backend-three.vercel.app/${image}`}
                                                alt={`Uploaded ${index + 1}`}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "5px",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserForm />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
