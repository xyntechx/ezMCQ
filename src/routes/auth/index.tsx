import { Component, createSignal, onMount } from "solid-js";
import { pb } from "../../utils/pocketbase";
import { useUser } from "../../contexts/UserContext";
import styles from "./styles.module.css";
import Alert from "../../components/alert";

const Auth: Component = () => {
    const { user } = useUser();

    const [isSignup, setIsSignup] = createSignal(true);

    const [email, setEmail] = createSignal("");
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [password2, setPassword2] = createSignal("");

    const [isLoading, setIsLoading] = createSignal(false);

    const [successMessage, setSuccessMessage] = createSignal("");
    const [errorMessage, setErrorMessage] = createSignal("");

    onMount(() => {
        if (user()) window.location.href = "/dashboard";
    });

    const handleLogin = async (isLogin: boolean) => {
        setIsLoading(true);

        try {
            await pb
                .collection("users")
                .authWithPassword(username(), password());

            setIsLoading(false);

            if (isLogin) window.location.href = "/dashboard";
        } catch (err) {
            setErrorMessage("Invalid credentials!");
            setIsLoading(false);
        }
    };

    const handleSignup = async () => {
        setIsLoading(true);

        if (!(email() && username() && password())) {
            setErrorMessage("Please fill up every field.");
            setIsLoading(false);
            return;
        }

        if (password().length < 8 || password().length > 72) {
            setErrorMessage(
                "Password length must be between 8 and 72 characters"
            );
            setIsLoading(false);
            return;
        }

        if (password() !== password2()) {
            setErrorMessage("Please ensure that your passwords match.");
            setIsLoading(false);
            return;
        }

        try {
            const data = {
                username: username(),
                email: email(),
                password: password(),
                passwordConfirm: password2(),
            };

            const createdUser = await pb.collection("users").create(data);

            await handleLogin(false);
            await pb.collection("users").requestVerification(email());

            localStorage.removeItem("isVerified");

            setSuccessMessage(
                "Please check your email for the verification link! Teleporting you to your dashboard..."
            );

            setTimeout(() => (window.location.href = "/dashboard"), 3000);
        } catch (err) {
            setErrorMessage("An error has occurred!");
            setIsLoading(false);
        }
    };

    return (
        <div class={styles.container}>
            <Alert
                {...{
                    successMessage,
                    errorMessage,
                    setSuccessMessage,
                    setErrorMessage,
                }}
            />
            <h1>ezMCQ</h1>
            {isSignup() ? (
                <>
                    <input
                        placeholder="Email"
                        type="email"
                        onInput={(e) => setEmail(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <input
                        placeholder="Username"
                        type="text"
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <input
                        placeholder="Confirm Password"
                        type="password"
                        onInput={(e) => setPassword2(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <button
                        onClick={() => handleSignup()}
                        class={styles.button}
                    >
                        {isLoading() ? "Loading..." : "Sign Up"}
                    </button>
                    <sub class={styles.sub}>
                        Have an account?{" "}
                        <button
                            onClick={() => setIsSignup(false)}
                            class={styles.textBtn}
                        >
                            Log in
                        </button>{" "}
                        instead!
                    </sub>
                </>
            ) : (
                <>
                    <input
                        placeholder="Username"
                        type="text"
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        class={styles.input}
                    />
                    <button
                        onClick={() => handleLogin(true)}
                        class={styles.button}
                    >
                        {isLoading() ? "Loading..." : "Log In"}
                    </button>
                    <sub class={styles.sub}>
                        New to ezMCQ?{" "}
                        <button
                            onClick={() => setIsSignup(true)}
                            class={styles.textBtn}
                        >
                            Sign up
                        </button>{" "}
                        instead!
                    </sub>
                </>
            )}
        </div>
    );
};

export default Auth;
