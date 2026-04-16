import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routeTable } from "./routeTable.jsx";

function RouteLoader() {
  return <div className="w-full min-h-screen" />;
}

function withSuspense(node) {
  return <Suspense fallback={<RouteLoader />}>{node}</Suspense>;
}

function toRoutes(entries) {
  return entries.flatMap((entry, idx) => {
    if (!entry) return [];

    const paths = entry.paths ?? (entry.path ? [entry.path] : []);
    const component = entry.component;
    const element = entry.element;
    const props = entry.props;
    const propsByPath = entry.propsByPath;

    if (entry.index) {
      const IndexComponent = component;
      return [
        <Route
          key={`idx-${idx}`}
          index
          element={withSuspense(
            element ??
              (IndexComponent ? <IndexComponent {...(props ?? {})} /> : null)
          )}
        />,
      ];
    }

    if (!paths.length) return [];

    return paths.map((path) => {
      const PathComponent = component;
      const perPathProps = propsByPath?.[path] ?? props ?? {};
      const node =
        element ?? (PathComponent ? <PathComponent {...perPathProps} /> : null);
      return (
        <Route
          key={`${path}-${idx}`}
          path={path}
          element={withSuspense(node)}
        />
      );
    });
  });
}

export default function AppRoutes() {
  const Web3Layout = routeTable.web3.layout;
  const AdminLayout = routeTable.admin.layout;

  return (
    <Routes>
      {toRoutes(routeTable.public)}

      <Route element={withSuspense(<Web3Layout />)}>
        {toRoutes(routeTable.web3.routes)}
        <Route path={routeTable.admin.path} element={withSuspense(<AdminLayout />)}>
          {toRoutes(routeTable.admin.routes)}
        </Route>
      </Route>
    </Routes>
  );
}
