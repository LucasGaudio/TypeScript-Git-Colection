import React from "react";
import { Switch, Route } from "react-router-dom";
import spinner from "../assets/spinner.svg";
const Dashboard = React.lazy(
	() =>
		import(
			/* webpackPrefetch: true */
			/* webpackChunkName: "dashboard" */ "../pages/Dashboard")
);
const Repo = React.lazy(() => import( 
	/* webpackPrefetch: true */
	/* webpackChunkName: "repo" */ "../pages/Repo"));

export const Routes: React.FC = () => {
	return (
		<React.Suspense
			fallback={
				<img
					style={{
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						margin: "auto",
					}}
					src={spinner}
					alt="Loading..."
				/>
			}
		>
			<Switch>
				<Route component={Dashboard} path="/" exact />
				<Route component={Repo} path="/repositories/:repository+" />
			</Switch>
		</React.Suspense>
	);
};
