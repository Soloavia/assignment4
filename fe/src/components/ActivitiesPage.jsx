import React, { useState, useEffect } from "react";
import "./ActivitiesPage.css";

export default function ActivitiesPage({ account }) {
  const API = "http://localhost:3000/api/accounts";

  const [activities, setActivities] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [amount, setAmount] = useState("");
  const [loanSum, setLoanSum] = useState("");
  const [loanPayments, setLoanPayments] = useState("");
  const [loanInterest, setLoanInterest] = useState("");
  const [balance, setBalance] = useState(0);
  const [warning, setWarning] = useState("");

  /* ---------------------------------------------------------
     Load Activities & Current Balance
  --------------------------------------------------------- */
  const loadActivities = async () => {
    try {
      const res = await fetch(`${API}/${account}/activities`);
      const data = await res.json();

      setActivities(data);

      const total = data.reduce((acc, act) => acc + act.sum, 0);
      setBalance(total.toFixed(2));
    } catch (err) {
      console.error("Failed loading activities:", err);
    }
  };

  useEffect(() => {
    if (account) loadActivities();
  }, [account]);

  /* ---------------------------------------------------------
     Deposit
  --------------------------------------------------------- */
  const doDeposit = async () => {
    try {
      const res = await fetch(`${API}/${account}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
      });

      const data = await res.json();

      if (data.error) return alert(data.error);

      setBalance(data.balance);
      setWarning(data.warning || "");
      loadActivities();
      setAmount("");
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  /* ---------------------------------------------------------
     Draw
  --------------------------------------------------------- */
  const doDraw = async () => {
    try {
      const res = await fetch(`${API}/${account}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
      });

      const data = await res.json();
      if (data.error) return alert(data.error);

      setBalance(data.balance);
      setWarning(data.warning || "");
      loadActivities();
      setAmount("");
    } catch (err) {
      console.error("Draw error:", err);
    }
  };

  /* ---------------------------------------------------------
     Loan
  --------------------------------------------------------- */
  const doLoan = async () => {
    try {
      const res = await fetch(`${API}/${account}/loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sum: Number(loanSum),
          payments: Number(loanPayments),
          interest: Number(loanInterest)
        })
      });

      const data = await res.json();
      if (data.error) return alert(data.error);

      setBalance(data.balance);
      loadActivities();
      setWarning("");

      setLoanSum("");
      setLoanPayments("");
      setLoanInterest("");
    } catch (err) {
      console.error("Loan error:", err);
    }
  };

  /* ---------------------------------------------------------
     Helper for Card Colors
  --------------------------------------------------------- */
  const getCardColor = (type) => {
    switch (type) {
      case "deposit":
        return "success";
      case "draw":
        return "danger";
      case "loan":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h2>Account #{account}</h2>
      <h4>Current Balance: {balance} ₪</h4>

      {warning && <div className="alert alert-warning">{warning}</div>}

      {/* ACTION SELECTOR */}
      <div className="card p-3 mt-4 shadow-sm">
        <label className="form-label fw-bold">Choose Action</label>

        <select
          className="form-select mb-3"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="" disabled>
            Please select
          </option>
          <option value="deposit">Deposit</option>
          <option value="draw">Draw</option>
          <option value="loan">Get Loan</option>
        </select>

        {(selectedAction === "deposit" || selectedAction === "draw") && (
          <>
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control mb-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {selectedAction === "deposit" ? (
              <button className="btn btn-success" onClick={doDeposit}>
                Deposit
              </button>
            ) : (
              <button className="btn btn-danger" onClick={doDraw}>
                Draw
              </button>
            )}
          </>
        )}

        {selectedAction === "loan" && (
          <>
            <label className="form-label">Loan Sum</label>
            <input
              type="number"
              className="form-control mb-2"
              value={loanSum}
              onChange={(e) => setLoanSum(e.target.value)}
            />

            <label className="form-label">Payments</label>
            <input
              type="number"
              className="form-control mb-2"
              value={loanPayments}
              onChange={(e) => setLoanPayments(e.target.value)}
            />

            <label className="form-label">Interest (%)</label>
            <input
              type="number"
              step="0.01"
              className="form-control mb-3"
              value={loanInterest}
              onChange={(e) => setLoanInterest(e.target.value)}
            />

            <button className="btn btn-primary" onClick={doLoan}>
              Apply Loan
            </button>
          </>
        )}
      </div>

      {/* ---------------------------------------------------------
          GROUPED ACTIVITY CARDS
      --------------------------------------------------------- */}
      <h3 className="mt-5">Activity Log</h3>

      <div className="activities-grid mt-3">

        {/* DEPOSITS */}
        {activities.filter(a => a.action_name === "deposit").length > 0 && (
          <div className="card activity-card border-success shadow-sm">
            <div className="card-header bg-success text-white">DEPOSITS</div>
            <div className="card-body">
              {activities
                .filter(a => a.action_name === "deposit")
                .map(a => (
                  <p key={a.id} className="mb-1">
                    <strong>{Number(a.sum).toFixed(2)} ₪</strong>
                    <span className="text-muted"> — {new Date(a.date).toLocaleString()}</span>
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* DRAWS */}
        {activities.filter(a => a.action_name === "draw").length > 0 && (
          <div className="card activity-card border-danger shadow-sm">
            <div className="card-header bg-danger text-white">DRAWS</div>
            <div className="card-body">
              {activities
                .filter(a => a.action_name === "draw")
                .map(a => (
                  <p key={a.id} className="mb-1">
                    <strong>{Number(a.sum).toFixed(2)} ₪</strong>
                    <span className="text-muted"> — {new Date(a.date).toLocaleString()}</span>
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* LOANS */}
        {activities.filter(a => a.action_name === "loan").length > 0 && (
          <div className="card activity-card border-info shadow-sm">
            <div className="card-header bg-info text-white">LOANS</div>
            <div className="card-body">
              {activities
                .filter(a => a.action_name === "loan")
                .map(a => (
                  <div key={a.id} className="mb-2">
                    <strong>{Number(a.sum).toFixed(2)} ₪</strong>
                    <span className="text-muted"> — {new Date(a.date).toLocaleString()}</span>
                    <div>Interest: {a.interest}%</div>
                    <div>Payments: {a.payments}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}