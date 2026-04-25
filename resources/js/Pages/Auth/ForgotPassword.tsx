import React from "react";

export default function ForgotPassword({ status }: any) {
    return (
        <div>
            <h1>Forgot Password</h1>
            {status && <div>{status}</div>}
        </div>
    );
}
