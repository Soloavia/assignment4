import React, { useState } from "react";

export default function HomePage({ onAccountSelected }) {
  const [account, setAccount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const num = Number(account);
    if (!num) return;
    onAccountSelected(num);
  };

  return (
    <div className="card p-3 shadow-sm">
      <h2 className="h4 mb-3">Find Account</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Account Number</label>
          <input
            type="number"
            className="form-control"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Show Activities</button>
      </form>
    </div>
  );
}
