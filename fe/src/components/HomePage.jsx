import React, { useState, useEffect } from "react";

import "./HomePage.css";

export default function HomePage({ onAccountSelected }) {
  const API = "http://localhost:3000/api/accounts";

  const [accountInput, setAccountInput] = useState("");
  const [accounts, setAccounts] = useState([]);

  /* ---------------------------------------------------------
     Fetch all accounts on load
  --------------------------------------------------------- */
  const loadAccounts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error("Failed loading accounts:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  /* ---------------------------------------------------------
     Submit selected account
  --------------------------------------------------------- */
  const submit = (e) => {
    e.preventDefault();

    if (!accountInput) return;

    onAccountSelected(accountInput);
    setAccountInput("");
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-3">Bank System</h2>

      {/* Input for account selection */}
      <form onSubmit={submit} className="card p-3 shadow-sm mb-4">
        <label className="form-label fw-bold">Enter Account Number</label>

        <input
          type="number"
          className="form-control mb-3"
          value={accountInput}
          onChange={(e) => setAccountInput(e.target.value)}
        />

        <button className="btn btn-primary">Load Account</button>
      </form>

      {/* ---------------------------------------------------------
         LIST OF ALL ACCOUNTS
      --------------------------------------------------------- */}
      <h4>All Accounts</h4>

      {accounts.length === 0 && (
        <div className="alert alert-info">No accounts found.</div>
      )}

      {accounts.length > 0 && (
        <table className="table table-striped table-hover mt-3 shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Account #</th>
              <th>Client Name</th>
              <th>Current Balance</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((acc) => (
              <tr
                key={acc.account_number}
                style={{ cursor: "pointer" }}
                onClick={() => onAccountSelected(acc.account_number)}
              >
                <td>{acc.account_number}</td>
                <td>{acc.client_name}</td>
                <td>{Number(acc.balance || 0).toFixed(2)} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
