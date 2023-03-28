import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import styles from "./styles.module.css";

interface Props {
    successMessage: Accessor<string>;
    errorMessage: Accessor<string>;
    setSuccessMessage: (successMessage: string) => void;
    setErrorMessage: (errorMessage: string) => void;
}

const Alert: Component<Props> = ({
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
}) => {
    const [isDisplay, setIsDisplay] = createSignal(
        successMessage() || errorMessage() ? true : false
    );

    createEffect(() =>
        setIsDisplay(successMessage() || errorMessage() ? true : false)
    );

    createEffect(() => {
        if (!isDisplay()) {
            setSuccessMessage("");
            setErrorMessage("");
        }
    });

    return (
        <header
            class={styles.message}
            style={{
                display: isDisplay() ? "flex" : "none",
                "background-color":
                    (successMessage() && "#22c55eaa") ||
                    (errorMessage() && "#ef4444aa") ||
                    "transparent",
            }}
        >
            {(successMessage() && successMessage()) ||
                (errorMessage() && errorMessage())}{" "}
            <button onClick={() => setIsDisplay(false)} class={styles.close}>
                X
            </button>
        </header>
    );
};

export default Alert;
