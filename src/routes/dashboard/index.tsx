import { Component, For, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { pb } from "../../utils/pocketbase";
import { useUser } from "../../contexts/UserContext";
import styles from "./styles.module.css";

interface Paper {
    id: string;
    title: string;
    description: string;
    author: any;
}

const Dashboard: Component = () => {
    const { user, isVerified, setIsVerified } = useUser();

    const [papers, setPapers] = createStore<Paper[]>([]);

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

    onMount(async () => {
        const res = await pb.collection("papers").getFullList({
            sort: "-created", // sort by created in the reverse order (latest first)
            expand: "author",
        });

        for (let i = 0; i < res.length; i++) {
            setPapers([
                ...papers,
                {
                    id: res[i].id,
                    title: res[i].title,
                    description: res[i].description,
                    author: res[i].expand.author,
                },
            ]);
        }
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
                        <For each={papers}>
                            {(paper, i) => (
                                <A
                                    href={`/paper/${paper.id}`}
                                    class={styles.paper}
                                >
                                    <p
                                        style={{
                                            "font-size": "1.2rem",
                                            "font-weight": 800,
                                            width: "100%",
                                            "text-align": "left",
                                        }}
                                    >
                                        {paper.title}
                                    </p>
                                    <p
                                        style={{
                                            width: "100%",
                                            "text-align": "left",
                                        }}
                                    >
                                        {paper.description}
                                    </p>
                                    <p
                                        style={{
                                            width: "100%",
                                            "text-align": "right",
                                            "font-style": "italic",
                                        }}
                                    >
                                        {paper.author.username}
                                    </p>
                                </A>
                            )}
                        </For>
                    </div>
                </Show>
            </Show>
        </div>
    );
};

export default Dashboard;
