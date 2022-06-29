import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";

function AdminPage() {
  const [auth] = useContext(AuthContext);
  return (
    <div>
      {auth ? (
        <div className="container">
          <AdminDashboard />
        </div>
      ) : (
        <div className="container text-center my-5">
          <h1>Not Logged in</h1>
          <p>Please log in to access admin pages</p>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
