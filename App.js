import React, { useState, useEffect } from "react";

export default function App() {
  const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  const defaultTasks = {
    Daniel: [
      { text: "Tisch decken", days: ["Montag", "Mittwoch", "Freitag"], done: {} },
      { text: "Zimmer aufräumen", days: ["Sonntag"], done: {} },
    ],
    Simon: [
      { text: "Müll rausbringen", days: ["Dienstag", "Donnerstag"], done: {} },
      { text: "Hund füttern", days: weekdays, done: {} },
    ],
  };

  const defaultCoins = { Daniel: 0, Simon: 0 };

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    let data = saved ? JSON.parse(saved) : defaultTasks;

    // Sicherstellen, dass alle Felder sauber initialisiert sind
    for (const child in data) {
      data[child] = data[child].map((task) => ({
        text: task.text,
        days: Array.isArray(task.days) ? task.days : weekdays,
        done: typeof task.done === "object" && task.done !== null ? task.done : {},
      }));
    }

    return data;
  });

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? JSON.parse(saved) : defaultCoins;
  });

  const [newTask, setNewTask] = useState({ Daniel: "", Simon: "" });
  const [selectedDay, setSelectedDay] = useState("Montag");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = "geheim123";

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("coins", JSON.stringify(coins));
  }, [coins]);

  const toggleTask = (child, index) => {
    const updatedTasks = [...tasks[child]];
    const task = { ...updatedTasks[index] };

    const newDone = { ...(task.done || {}) };
    const current = !!newDone[selectedDay];
    newDone[selectedDay] = !current;

    task.done = newDone;
    updatedTasks[index] = task;

    const coinChange = current ? -5 : 5;
    setCoins((prev) => ({ ...prev, [child]: prev[child] + coinChange }));
    setTasks((prev) => ({ ...prev, [child]: updatedTasks }));
  };

  const deleteTask = (child, index) => {
    const updatedTasks = tasks[child].filter((_, i) => i !== index);
    setTasks({ ...tasks, [child]: updatedTasks });
  };

  const handleAddTask = (child) => {
    const taskText = newTask[child].trim();
    if (taskText) {
      const newEntry = {
        text: taskText,
        days: [selectedDay],
        done: { [selectedDay]: false },
      };
      const updatedTasks = [...tasks[child], newEntry];
      setTasks({ ...tasks, [child]: updatedTasks });
      setNewTask({ ...newTask, [child]: "" });
    }
  };

  const resetAllTasks = () => {
    const resetTasks = { ...tasks };
    for (const child in resetTasks) {
      resetTasks[child] = resetTasks[child].map((task) => ({
        ...task,
        done: {}
      }));
    }
    setTasks(resetTasks);

    const resetCoins = {};
    for (const child in coins) {
      resetCoins[child] = 0;
    }
    setCoins(resetCoins);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f9f9fb", color: "#333" }}>
      <h1 style={{ textAlign: "center", color: "#3366cc" }}>🧹 Haushaltsaufgaben</h1>

      {!isAuthenticated && (
        <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
          <input
            type="password"
            placeholder="Passwort eingeben"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc", marginRight: "0.5rem" }}
          />
          <button
            onClick={() => {
              if (passwordInput === ADMIN_PASSWORD) {
                setIsAuthenticated(true);
              } else {
                alert("Falsches Passwort!");
              }
            }}
            style={{
              backgroundColor: "#3366cc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.4rem 1rem",
              cursor: "pointer"
            }}
          >
            Freischalten
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            onClick={resetAllTasks}
            style={{
              backgroundColor: "#cc3300",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer"
            }}
          >
            🔄 Woche zurücksetzen (Aufgaben & Münzen)
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              backgroundColor: "#888",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.4rem 1rem",
              cursor: "pointer",
              marginLeft: "1rem"
            }}
          >
            🧹 Gesamten Speicher löschen
          </button>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <label><strong>Wochentag wählen:</strong></label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{
          marginLeft: "0.5rem",
          padding: "0.4rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}>
          {weekdays.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {Object.keys(tasks).map((child) => (
        <div key={child} style={{
          marginBottom: "2rem",
          border: "1px solid #cce0ff",
          padding: "1rem",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}>
          <h2 style={{ color: "#0044cc" }}>{child}</h2>
          <p style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>Münzen: 🪙 <strong>{coins[child]}</strong></p>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {tasks[child]
              .filter((task) => task.days.includes(selectedDay))
              .map((task) => {
                const trueIndex = tasks[child].findIndex(t =>
                  t.text === task.text &&
                  JSON.stringify(t.days) === JSON.stringify(task.days)
                );
                const checkboxId = `${child}-${trueIndex}-${selectedDay}`;
                return (
                <li key={checkboxId} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.6rem",
                  padding: "0.3rem 0.5rem",
                  backgroundColor: task.done[selectedDay] ? "#e0e7ff" : "#f0f5ff",
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                    <input
                      type="checkbox"
                      id={checkboxId}
                      checked={!!task.done[selectedDay]}
                      onChange={() => toggleTask(child, trueIndex)}
                    />
                    <label htmlFor={checkboxId} style={{ cursor: "pointer", flex: 1, textDecoration: task.done[selectedDay] ? "line-through" : "none", color: task.done[selectedDay] ? "#999" : "#000" }}>
                      {task.text}
                    </label>
                  </div>
                  <button
                    onClick={() => deleteTask(child, trueIndex)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                      fontSize: "1.2rem"
                    }}
                    title="Aufgabe löschen"
                  >
                    🗑️
                  </button>
                </li>
              )})}
          </ul>
          {isAuthenticated && (
            <div style={{ marginTop: "0.7rem", display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newTask[child]}
                onChange={(e) => setNewTask({ ...newTask, [child]: e.target.value })}
                placeholder={`Neue Aufgabe für ${selectedDay}`}
                style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <button onClick={() => handleAddTask(child)} style={{
                backgroundColor: "#3366cc",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.4rem 1rem",
                cursor: "pointer"
              }}>
                Hinzufügen
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
