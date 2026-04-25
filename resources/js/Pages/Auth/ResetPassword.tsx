import React from "react";

export default function ResetPassword({ token, email }: any) {
    return (
        <div>
            <h1>Reset Password</h1>
            <p>Token: {token}</p>
            <p>Email: {email}</p>
        </div>
    );
}
