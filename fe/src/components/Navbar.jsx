import React from "react";

export default function Navbar({
  onHome,
  onActivities,
  onAddAccount,
  canOpenActivities,
  onReset
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand d-flex align-items-center">
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid #fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
              fontSize: 18
            }}
          >
            🪙
          </span>
          My Friendly Bank
        </span>

        <div className="navbar-nav ms-auto d-flex align-items-center">
          <button className="btn btn-link nav-link" onClick={onHome}>
            Home
          </button>
          <button
            className="btn btn-link nav-link"
            onClick={onActivities}
            disabled={!canOpenActivities}
          >
            Activities
          </button>
          <button
            className="btn btn-link nav-link"
            onClick={onAddAccount}
          >
            Add Account
          </button>
          <button
            className="btn btn-outline-light ms-3"
            onClick={onReset}
          >
            New / Reset
          </button>
        </div>
      </div>
    </nav>
  );
}
