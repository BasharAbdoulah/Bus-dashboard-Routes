import React from "react";
// components
import { Route, Switch, useHistory } from "react-router-dom";
// redux
import { connect } from "react-redux";
// layouts
import DashLayout from "../layouts/dashboard/DashLayout";

const MainRoutes = ({ id, component: Component, ...rest }) => {
  const history = useHistory();

  if (id === null) history.push("/Login");

  return (
    <Route
      {...rest}
      render={(props) => (
        <Switch>
          <Route path={["/"]}>
            <DashLayout>
              <Component {...props} />
            </DashLayout>
          </Route>
        </Switch>
      )}
    />
  );
};

const mapStateToProps = (state) => ({
  id: state.auth.id,
});

export default connect(mapStateToProps, {})(MainRoutes);
