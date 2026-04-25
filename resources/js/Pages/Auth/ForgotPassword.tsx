import React from "react";

export default function ForgotPassword({ status }) {
    return (
        <div>
            <h1>Forgot Password</h1>
            {status && <div>{status}</div>}
        </div>
    );
}
