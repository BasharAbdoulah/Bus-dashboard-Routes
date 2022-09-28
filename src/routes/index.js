// react router
import { Switch, Route as Routerr } from "react-router-dom";

// layouts
import MainRoutes from "../routes/MainRoutes";
// pages
import Home from "../views/Home/Home";
import Route from "views/Route/Route";
import Station from "views/Route/Station";
import StationsForRoute from "views/Route/StationsForRoute";
import RouteForStation from "views/Route/RouteForStation";
import RouteStation from "views/Route/RouteStation";
import Trips from "views/Trips/Trip";
import Role from "views/Role/Role";
import Users from "views/Role/Users";
import Login from "views/Login/Login";
import Chargingwallet from "views/ChargingWallet/Chargingwallet";
import Payments from "views/Paymentwallet/Payments";
import Map from "views/Map/Map";
import MultiMap from "views/Map/MultiMap";
import Bus from "views/Bus/Bus";
import BusCompany from "views/Bus/BusCompany";
import PaymentByCompany from "views/Bus/PaymentByCompany";
import Driver from "views/Driver/Driver";
import Company from "views/Company/Company";
import UserCompany from "views/Company/UserCompany";
import DriverCompany from "views/Company/DriverCompany";
import RequestRoute from "views/Company/RequestRoute";
import BusByCompany from "views/Company/BusByCompany";
import Promoter from "views/Promoter/Promoter";
import ListPaymentUser from "views/Role/PaymentUser";
import ListChargingUser from "views/Role/ChargingUser";
import ListTripUser from "views/Role/TripUser";
import PaymentCompany from "views/Company/PaymentOfCompany";
import RequestDetails from "views/Company/RequestDetails";
import PromoterCharge from "views/Promoter/PromoterCharge";
import PromoterStatistic from "views/Promoter/PromoterStatistic";
import Inspector from "views/Inspector/Inspector";
import InspectorBus from "views/Inspector/InspectorBus";
import InspectorUser from "views/Inspector/InspectorUser";

import OfflinePassengers from "views/Role/OfflinePassengers";
import OnlinePassengers from "views/Role/OnlinePassengers";
import Send from "views/Paymentwallet/Send";
import DeletedUsers from "views/Role/DeletedUsers";
import Subscripions from "views/Subscripions/Subscripions";
import SubscripionsDetails from "views/Subscripions/SubscripionsDetails";

const Router = () => {
    return (
        <Switch>
            <MainRoutes exact path="/" component={Home} />
            <MainRoutes exact path="/Route" component={Route} />
            <MainRoutes exact path="/Station" component={Station} />
            <MainRoutes
                exact
                path="/StationsForRoute"
                component={StationsForRoute}
            />
            <MainRoutes
                exact
                path="/RouteForStation"
                component={RouteForStation}
            />
            <MainRoutes exact path="/RouteStation" component={RouteStation} />
            <MainRoutes exact path="/Role" component={Role} />
            <MainRoutes exact path="/Trips" component={Trips} />
            <MainRoutes exact path="/Users" component={Users} />
            <MainRoutes exact path="/Map" component={Map} />
            <MainRoutes exact path="/MultiMap" component={MultiMap} />
            <MainRoutes exact path="/Bus" component={Bus} />
            <MainRoutes exact path="/BusCompany" component={BusCompany} />
            <MainRoutes exact path="/Driver" component={Driver} />
            <MainRoutes
                exact
                path="/OfflinePassengers"
                component={OfflinePassengers}
            />
            <MainRoutes
                exact
                path="/OnlinePassengers"
                component={OnlinePassengers}
            />
            <MainRoutes
                exact
                path="/DeletedUsers"
                component={DeletedUsers}
            />
            <MainRoutes
                exact
                path="/Subscripions"
                component={Subscripions}
            />
            <MainRoutes
                exact
                path="/Subscripions/SubscripionsDetails"
                component={SubscripionsDetails}
            />
            <MainRoutes
                exact
                path="/Chargingwallet"
                component={Chargingwallet}
            />
            <MainRoutes exact path="/Payments" component={Payments} />
            <MainRoutes exact path="/Send" component={Send} />
            <MainRoutes
                exact
                path="/PaymentByCompany"
                component={PaymentByCompany}
            />
            <MainRoutes
                exact
                path="/PaymentOfCompany"
                component={PaymentCompany}
            />
            <MainRoutes exact path="/Company" component={Company} />
            <MainRoutes exact path="/UserCompany" component={UserCompany} />
            <MainRoutes exact path="/DriverCompany" component={DriverCompany} />
            <MainRoutes exact path="/BusByCompany" component={BusByCompany} />
            <MainRoutes exact path="/Promoter" component={Promoter} />
            <MainRoutes exact path="/Inspector" component={Inspector} />
            <MainRoutes exact path="/InspectorBus" component={InspectorBus} />
            <MainRoutes exact path="/InspectorUser" component={InspectorUser} />
            <MainRoutes
                exact
                path="/PromoterCharge"
                component={PromoterCharge}
            />
            <MainRoutes
                exact
                path="/PromoterStatistic"
                component={PromoterStatistic}
            />
            <MainRoutes exact path="/PaymentUser" component={ListPaymentUser} />
            <MainRoutes exact path="/TripUser" component={ListTripUser} />
            <MainRoutes
                exact
                path="/ChargingUser"
                component={ListChargingUser}
            />
            <MainRoutes exact path="/RequestRoute" component={RequestRoute} />
            <MainRoutes
                exact
                path="/RequestDetails"
                component={RequestDetails}
            />

            <Routerr exact path="/Login" component={Login} />
        </Switch>
    );
};

export default Router;
