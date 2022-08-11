import React from "react";
import ReactDOM from "react-dom";
import {
  Newsletters,
  App,
  Friends,
  Profile,
  Settings,
} from "./components/App/App";
import {
  Expenses,
  InvoiceFilterableList,
  Invoices,
  Movie,
  MovieMe,
  Movies,
  Page404,
  TestComponent,
} from "./components/App/App2";
import { Home, About } from "./components/App/App2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const Dashboard = React.lazy(() => import("../src/components/App/app-imports"));

const Loading = () => <h1>Loading...</h1>;
// ReactDOM.render(
//   <React.StrictMode>
//     <Router>
//       <React.Suspense fallback={<Loading />}>
//         <AppWithRoutes />
//       </React.Suspense>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/*" element={<App />}>
            {/* <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} /> */}
            {/* <Route path="people/*" element={<PersonContainer />} /> */}
            {/* <Route path="people" element={<PersonContainerOutlet />}>
            <Route path=":id" element={<QuotesContainer />} />
          </Route> */}
            {/* <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} /> */}
            {/* <Route path="search/" element={<User />} /> */}
          </Route>
        </Routes>
      </React.Suspense>
      {/* <Routes>
        <Route path="/" element={<App />}>
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
          <Route path="filters" element={<TestComponent />} />
          <Route path="movies/*" element={<Movies />} />
          <Route path="Invoices/*" element={<Invoices />} />

          <Route path="invoices" element={<Invoices />}>
            <Route index element={<InvoiceFilterableList />} />
            <Route path=":invoiceId" element={<Invoice />} />
          </Route>
          <Route path="Expenses" element={<Expenses />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes> */}
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
