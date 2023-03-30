import { Component } from "solid-js";
import { lazy } from "solid-js";
import { Routes, Route, Navigate, A } from "@solidjs/router";
import { UserProvider } from "./contexts/UserContext";
import styles from "./App.module.css";

const Auth = lazy(() => import("./routes/auth"));
const Dashboard = lazy(() => import("./routes/dashboard"));
const Create = lazy(() => import("./routes/create"));
const Paper = lazy(() => import("./routes/paper"));

const App: Component = () => {
    return (
        <div class={styles.app}>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Navigate href="/auth" />} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/create" component={Create} />
                    <Route
                        path="/paper"
                        element={<Navigate href="/dashboard" />}
                    />
                    <Route path="/paper/:id" component={Paper} />
                    <Route
                        path="/*"
                        element={
                            <p>
                                Oops! This page doesn't exist.{" "}
                                <A href="/" class={styles.link}>
                                    Back to home
                                </A>
                                .
                            </p>
                        }
                    />
                </Routes>
            </UserProvider>
        </div>
    );
};

export default App;
