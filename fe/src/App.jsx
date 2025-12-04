import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ActivitiesPage from "./components/ActivitiesPage";
import AddAccountPage from "./components/AddAccountPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const goHome = () => setCurrentPage("home");

  const handleAccountSelected = (accountNumber) => {
    setSelectedAccount(accountNumber);
    setCurrentPage("activities");
  };

  const handleAccountCreated = (accountNumber) => {
    setSelectedAccount(accountNumber);
    setCurrentPage("activities");
  };

  const resetApp = () => {
    setSelectedAccount(null);
    setCurrentPage("home");
  };

  return (
    <>
      <Navbar
        onHome={goHome}
        onActivities={() => setCurrentPage("activities")}
        onAddAccount={() => setCurrentPage("add")}
        canOpenActivities={!!selectedAccount}
        onReset={resetApp}
      />
      <div className="container mt-4">
        {currentPage === "home" && (
          <HomePage onAccountSelected={handleAccountSelected} />
        )}
        {currentPage === "activities" && selectedAccount && (
          <ActivitiesPage account={selectedAccount} />
        )}
        {currentPage === "add" && (
          <AddAccountPage onAccountCreated={handleAccountCreated} />
        )}
        {currentPage === "activities" && !selectedAccount && (
          <div className="alert alert-info mt-3">
            Please select or create an account first.
          </div>
        )}
      </div>
    </>
  );
}
