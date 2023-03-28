import { Component, createSignal } from "solid-js";
import { lazy } from "solid-js";
import { Routes, Route, Navigate } from "@solidjs/router";
import { pb } from "./utils/pocketbase";
import styles from "./App.module.css";

const Auth = lazy(() => import("./routes/auth"));
const Dashboard = lazy(() => import("./routes/dashboard"));
const Create = lazy(() => import("./routes/create"));

const App: Component = () => {
    const [user, setUser] = createSignal(pb.authStore.model);

    pb.authStore.onChange(() => setUser(pb.authStore.model));

    return (
        <div class={styles.app}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate href={user() ? "/dashboard" : "/auth"} />
                    }
                />
                <Route path="/auth" component={Auth} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/create" component={Create} />
            </Routes>
        </div>
    );
};

export default App;
