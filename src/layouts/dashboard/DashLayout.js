import React, { useEffect } from "react";
// componets
import { Breadcrumb, Dropdown, Button, Layout, Menu } from "antd";
// icons
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  CaretDownFilled,
  MessageFilled,
  NotificationFilled,
  SearchOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShareAltOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { FaRoute } from "react-icons/fa";
// redux
import { connect } from "react-redux";
import { startLogout, startLogin } from "redux/auth/action";
// redux-actions
import { openSider, closeSider } from "../../redux/sider/actions";
import { Link } from "react-router-dom";
// services
import { useLocation, useHistory } from "react-router-dom";
//redux  actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

// styles
import "styles/dashLayout.css";

const { Sider, Header, Content } = Layout;

const DashboardLayout = ({
  children,
  isOpen,
  openSider,
  closeSider,
  lang = "en",
  switchLanguage,
  isLoggedIn,
  startLogout,
  startLogin,
  role,
  UserName,
  openModal,
}) => {
  // const [collapsed, setCollapsed] = useState(true);
  const history = useHistory();
  const location = useLocation();

  // useEffect(() => {
  //   if (!role.includes("Company")) history.push("/403");
  // }, [location.pathname]);

  const isProfilePage = location.pathname === "/Dash/Profile";
  const isHomePage =
    location.pathname === "/Dash" ? true : location.pathname === "/Dash/";

  console.log(location.pathname.split("/"));
  const toggle = () => {
    if (isOpen) closeSider();
    else openSider();
  };

  // const changeLanguage_ = (ln) => {
  //   i18n.changeLanguage(ln);
  //   switchLanguage(ln);
  //   localStorage.setItem("i18nextLng", ln);
  //   window.location.reload();
  // };

  // menu for languages
  const languagesMenu = (
    <Menu>
      <Menu.Item key="0">
        {/* <a onClick={() => changeLanguage_("tr")}>Türkçe</a> */}
        <a>Türkçe</a>
      </Menu.Item>
      {/* <Menu.Item key="1">
        <a onClick={() => changeLanguage_("ar")}>العربية</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a onClick={() => changeLanguage_("en")}>English</a>
      </Menu.Item> */}
    </Menu>
  );
  console.log("role");
  console.log(role);
  return (
    <Layout
      className={`main_layout ${lang === "ar" ? "rtl" : ""} ${
        isProfilePage || isHomePage ? "no_bg_" : ""
      }`}
    >
      <Sider
        className={`lay_sider`}
        trigger={null}
        collapsible
        collapsed={!isOpen}
      >
        <div className="logo">
          <a href="/">{isOpen && <h3>Kuwait</h3>} </a>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%" }}
          theme="dark"
        >
          {role?.includes("Company") ? (
            <>
              <Menu.Item key="22">
                <Link to="/DriverCompany"> Driver </Link>
              </Menu.Item>
              <Menu.Item key="23">
                <Link to="/BusByCompany"> Bus </Link>
              </Menu.Item>
              <Menu.Item key="25">
                <span
                  // style={{ backgrounColor: "#blue" }}
                  onClick={() => {
                    openModal(constants.modalType_RequestRoute);
                  }}
                >
                  Request For Route
                </span>
              </Menu.Item>
              <Menu.SubMenu key="sub00" title="Packages">
                <Menu.Item>
                  <Link to={"/AddPackage"}>Add Package</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to={"/AllPackages"}>All Packages</Link>
                </Menu.Item>
              </Menu.SubMenu>
              {/* <Menu.Item key="18">
                <Link to="/PaymentOfCompany">Payment Of Company </Link>
              </Menu.Item> */}
            </>
          ) : (
            <>
              <Menu.Item key="1">
                <Link to="/">Control Panel</Link>
              </Menu.Item>

              <Menu.SubMenu key="sub1" title="Routes">
                <Menu.Item key="2">
                  <Link to="/Route">Routes</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu
                key="sub2"
                // icon={<NotificationFilled />}
                title="Station"
              >
                <Menu.Item key="3">
                  <Link to="/Station">Station</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub3" title="RouteStation">
                <Menu.Item key="4">
                  <Link to="/RouteStation">RouteStation</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub4" title="Roles">
                <Menu.Item key="5">
                  <Link to="/Role">Roles</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub5" title="Users">
                <Menu.Item key="6">
                  <Link to="/Users">Users</Link>
                </Menu.Item>
                <Menu.Item key="6-0">
                  <Link to="/DeletedUsers">Deleted Users</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub6" title="Passengers">
                <Menu.Item key="7">
                  <Link style={{ position: "relative" }} to="/OnlinePassengers">
                    <span className="online-dot"></span>
                    Online Passengers{" "}
                  </Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to="/OfflinePassengers">Ofline Passengers</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub7" title="Trips">
                <Menu.Item key="9">
                  <Link to="/Trips">Trips</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub8" title="Map">
                <Menu.Item key="10">
                  <Link to="/Map">Map</Link>
                </Menu.Item>
                {/* <Menu.Item key="9">
            <Link to="/MultiMap">MultiMap</Link>
          </Menu.Item> */}
              </Menu.SubMenu>
              <Menu.SubMenu key="sub9" title="Bus">
                <Menu.Item key="11">
                  <Link to="/Bus">Bus</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub10" title="Company">
                <Menu.Item key="12">
                  <Link to="/Company">Company</Link>
                </Menu.Item>
                <Menu.Item key="13">
                  <Link to="/UserCompany">User of Company</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub11" title="Payment">
                <Menu.Item key="16">
                  <Link to="/Payments">Payments</Link>
                </Menu.Item>
                <Menu.Item key="17">
                  <Link to="/Send">Send</Link>
                </Menu.Item>
              </Menu.SubMenu>

              <Menu.Item key="15">
                <Link to="/Chargingwallet">Charging Wallet</Link>
              </Menu.Item>
              <Menu.SubMenu key="sub12" title="Subscripions">
                <Menu.Item key="116">
                  <Link to="/Subscripions">All Subscripions</Link>
                </Menu.Item>
              </Menu.SubMenu>

              <Menu.Item key="14">
                <Link to="/Driver">Driver</Link>
              </Menu.Item>

              <Menu.Item key="18">
                <Link to="/Promoter"> Promoter</Link>
              </Menu.Item>
              <Menu.Item key="19">
                <Link to="/Inspector"> Inspector</Link>
              </Menu.Item>
              <Menu.Item key="20">
                <Link to="/RequestRoute"> Route Requests </Link>
              </Menu.Item>
            </>
          )}

          <Menu.Item key="21">
            <Link
              to="d#"
              onClick={(e) => {
                e.preventDefault();
                startLogout();
              }}
            >
              <span>
                <LogoutOutlined />
              </span>
              <span>{""}logout</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={`site-layout ${isOpen === false ? "collapsed" : ""}`}>
        <Header
          className="site-layout-background lay_header_con"
          style={{
            padding: 0,
            position: "fixed",
            width: "100%",
            zIndex: 1000,
          }}
        >
          <div className="lay_header">
            <div>
              {React.createElement(
                !isOpen ? MenuFoldOutlined : MenuUnfoldOutlined,
                {
                  id: "components-layout-trigger",
                  onClick: toggle,
                }
              )}
            </div>
            <div>
              <ul className="nav_list">
                <li>
                  <a>
                    <NotificationFilled />
                  </a>
                </li>
                <li>
                  <Link
                    to="d#"
                    onClick={(e) => {
                      e.preventDefault();
                      startLogout();
                    }}
                  >
                    <span>
                      <LogoutOutlined />
                      {""}
                    </span>
                    <span></span>
                  </Link>
                </li>
                <li>
                  <Dropdown
                    placement="bottomCenter"
                    arrow
                    trigger={["click"]}
                    overlay={languagesMenu}
                  >
                    <a>
                      <GlobalOutlined />
                    </a>
                  </Dropdown>
                </li>
              </ul>
              <div className="account_">
                <Link to="/Dash/Profile" className="content">
                  {/* <span className="img">
                    <img src={lib} />
                  </span> */}
                  <span className="text">{UserName}</span>
                </Link>
              </div>
            </div>
          </div>
        </Header>
        <div style={{ marginTop: 88, marginLeft: 24 }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/${location.pathname.split("/")[1]}`}>
                {location.pathname.split("/")[1]}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{location.pathname.split("/")[2]}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            // marginTop: ,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProp = (state) => ({
  isOpen: state.sider.open,
  isLoggedIn: state.auth.isLoggedIn,
  role: state.auth.role,
  UserName: state.auth.UserName,
});

export default connect(mapStateToProp, {
  openSider,
  closeSider,
  startLogout,
  startLogin,
  openModal,
})(DashboardLayout);
