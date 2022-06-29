import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Hotels from "./components/pages/Hotels";
import "./sass/style.scss";
import ContactUs from "./components/pages/ContactUs";
import Hoteldetails from "./components/hotel/Hoteldetails";
import { AuthProvider } from "./context/AuthContext";
import AdminPage from "./components/admin/AdminPage";
import AdminAddHotels from "./components/admin/AdminAddHotels";
import AdminEditHotels from "./components/admin/AdminEditHotels";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route exact path="/hotels">
            <Hotels />
          </Route>
          <Route path="/contact-us">
            <ContactUs />
          </Route>
          <Route path="/hotels/:slug">
            <Hoteldetails />
          </Route>
          <Route exact path="/admin">
            <AdminPage />
          </Route>
          <Route path="/admin/add">
            <AdminAddHotels />
          </Route>
          <Route path="/admin/edit/:slug">
            <AdminEditHotels />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
