import { Switch, Route } from "wouter";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏥 MediCare HMS - Working!</h1>
      <p>Your hospital management system is running successfully!</p>
      
      <nav style={{ margin: "20px 0" }}>
        <a href="/" style={{ marginRight: "15px" }}>Dashboard</a>
        <a href="/bed-management" style={{ marginRight: "15px" }}>Beds</a>
        <a href="/patients" style={{ marginRight: "15px" }}>Patients</a>
        <a href="/doctors">Doctors</a>
      </nav>
      
      <Switch>
        <Route path="/">
          <h2>Dashboard</h2>
          <p>Welcome to your hospital dashboard!</p>
        </Route>
        <Route path="/bed-management">
          <h2>Bed Management</h2>
          <p>Bed management page is working!</p>
        </Route>
        <Route path="/patients">
          <h2>Patients</h2>
          <p>Patients page is working!</p>
        </Route>
        <Route path="/doctors">
          <h2>Doctors</h2>
          <p>Doctors page is working!</p>
        </Route>
        <Route>
          <h2>404 - Page Not Found</h2>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
