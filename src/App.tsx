import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/TailAdminComponents/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/TailAdminPages/AuthPages/SignIn";
import SignUp from "./pages/TailAdminPages/AuthPages/SignUp";
import BarChart from "./pages/TailAdminPages/Charts/BarChart";
import LineChart from "./pages/TailAdminPages/Charts/LineChart";
import Home from "./pages/Home"
import FormElements from "./pages/TailAdminPages/Forms/FormElements";
import Blank from "./pages/TailAdminPages/OtherPage/Blank";
import NotFound from "./pages/TailAdminPages/OtherPage/NotFound";
import BasicTables from "./pages/TailAdminPages/Tables/BasicTables";
import Avatars from "./pages/TailAdminPages/UiElements/Avatars";
import Badges from "./pages/TailAdminPages/UiElements/Badges";
import Buttons from "./pages/TailAdminPages/UiElements/Buttons";
import Images from "./pages/TailAdminPages/UiElements/Images";
import Videos from "./pages/TailAdminPages/UiElements/Videos";
import UserProfiles from "./pages/TailAdminPages/UserProfiles";
import Bolmen from "./pages/Locations/Bolmen";
import Vomb from "./pages/Locations/Vomb";
import Ringsjon from "./pages/Locations/Ringsjon";
import Kommuner from "./pages/Kommuner/Kommuner";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* locationOverview */}
            <Route path="/bolmen" element={<Bolmen/>} />
            <Route path="/vomb" element={<Vomb/>} />
            <Route path="/ringsjon" element={<Ringsjon/>} />
            <Route path="/kommuner" element={<Kommuner/>} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
