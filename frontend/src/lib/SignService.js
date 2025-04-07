const BASE = "http://localhost:8080";

export async function SignIn(formData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const response = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();
    if (response.ok) {
        localStorage.setItem("token", result.token);
        console.log("User logged in successfully:", result);
    } else {
        console.error("Login error:", result);
    }
    return {
        status: response.status,
        data: result
    };
}

export async function SignUp(formData) {
        const response = await fetch(`${BASE}/register`, {
            method: "POST",
            body: formData
        });
   
        const result = await response.json();
        if (response.ok) {
            console.log("User registered successfully:", result);
            return {
                status: response.status,
                data: result
            };
        } else {
            console.error("Error:", result.error);
            return {
                status: response.status,
                error: result.error
            };
        }
}
