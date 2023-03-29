import { Component, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { pb } from "../../utils/pocketbase";
import { useUser } from "../../contexts/UserContext";
import styles from "./styles.module.css";

const Dashboard: Component = () => {
    const { user, isVerified, setIsVerified } = useUser();

    onMount(() => {
        if (!user()) {
            window.location.href = "/auth";
            return;
        }

        pb.collection("users").subscribe(
            user()!.id,
            async ({ action, record }) => {
                if (action === "update" && record.verified) {
                    localStorage.setItem("isVerified", JSON.parse("true"));
                    setIsVerified(true);
                }
            }
        );
    });

    onCleanup(() => pb.collection("users").unsubscribe(user()!.id));

    const handleSignout = () => {
        pb.authStore.clear();
        window.location.href = "/";
    };

    return (
        <div class={styles.container}>
            <Show when={user()}>
                <div class={styles.utils}>
                    <h1>{user().username}'s Dashboard</h1>
                    <div class={styles.buttons}>
                        <Show when={isVerified()}>
                            <A href="/create" class={styles.buttonGreen}>
                                Create
                            </A>
                        </Show>
                        <button
                            onClick={() => handleSignout()}
                            class={styles.buttonRed}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <Show
                    when={isVerified()}
                    fallback={
                        <p>
                            Please check your email for the verification link!
                        </p>
                    }
                >
                    <div class={styles.grid}>
                        {/* // TODO: https://www.solidjs.com/tutorial/flow_for */}
                    </div>
                </Show>
            </Show>
        </div>
    );
};

export default Dashboard;
