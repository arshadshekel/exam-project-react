import EditHotelForm from "../forms/EditHotelForm";
import AuthContext from "../../context/AuthContext";
import {useContext} from "react";

function AdminEditHotels() {
  const [auth] = useContext(AuthContext);
  
  return (
    <div>
      {auth ? (
        <div>
          <EditHotelForm />
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

export default AdminEditHotels;
