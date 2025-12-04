import React, { useState, useEffect } from "react";

const API = "http://localhost:3000/api/accounts";

export default function AddAccountPage({ onAccountCreated }) {
  const [name, setName] = useState("");
  const [initialSum, setInitialSum] = useState("");
  const [existing, setExisting] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setExisting)
      .catch(console.error);
  }, []);

  const getNextAccountNumber = () => {
    if (existing.length === 0) return 1001;
    const max = Math.max(...existing.map((a) => a.account_number));
    return max + 1;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!name.trim()) {
      setErr("Client name required.");
      return;
    }

    const newAcc = getNextAccountNumber();
    const sum = Number(initialSum) || 0;

    try {
      const resAcc = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: newAcc,
          client_name: name.trim()
        })
      });
      const accData = await resAcc.json();
      if (accData.error) throw new Error(accData.error);

      if (sum !== 0) {
        await fetch(`${API}/${newAcc}/deposit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: sum })
        });
      }

      setMsg(
        `Account number: ${newAcc} Generated. Total Sum: ${sum.toFixed(2)}`
      );
      setExisting([...existing, accData]);
      onAccountCreated(newAcc);
      setName("");
      setInitialSum("");
    } catch (e) {
      console.error(e);
      setErr("Failed to create account.");
    }
  };

  return (
    <div>
      <h2 className="h4 mb-3">Add Account</h2>

      <form onSubmit={submit} className="card p-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Initial Sum</label>
          <input
            type="number"
            className="form-control"
            value={initialSum}
            onChange={(e) => setInitialSum(e.target.value)}
          />
        </div>

        {err && <div className="alert alert-danger">{err}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}

        <button className="btn btn-success">Create Account</button>
      </form>
    </div>
  );
}
