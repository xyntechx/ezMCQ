import type { Component } from "solid-js";
import { lazy } from "solid-js";
import { Routes, Route, Navigate } from "@solidjs/router";
import styles from "./App.module.css";

const Dashboard = lazy(() => import("./routes/dashboard"));
const Create = lazy(() => import("./routes/create"));

const App: Component = () => {
    return (
        <div class={styles.app}>
            <Routes>
                <Route path="/" element={<Navigate href="/dashboard" />} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/create" component={Create} />
            </Routes>
        </div>
    );
};

export default App;
