import { Component } from "solid-js";
import { lazy } from "solid-js";
import { Routes, Route, Navigate } from "@solidjs/router";
import { UserProvider } from "./contexts/UserContext";
import styles from "./App.module.css";

const Auth = lazy(() => import("./routes/auth"));
const Dashboard = lazy(() => import("./routes/dashboard"));
const Create = lazy(() => import("./routes/create"));

const App: Component = () => {
    return (
        <div class={styles.app}>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Navigate href="/auth" />} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/create" component={Create} />
                </Routes>
            </UserProvider>
        </div>
    );
};

export default App;
