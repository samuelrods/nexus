import React from "react";

export default function VerifyEmail({ status }) {
    return (
        <div>
            <h1>Verify Email</h1>
            {status && <div>{status}</div>}
        </div>
    );
}
