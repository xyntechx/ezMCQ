import {
    createContext,
    createEffect,
    createSignal,
    JSX,
    useContext,
} from "solid-js";
import { pb } from "../utils/pocketbase";

interface Props {
    children: JSX.Element;
}

const UserContext = createContext();

export const UserProvider = (props: Props) => {
    const [user, setUser] = createSignal(pb.authStore.model);
    pb.authStore.onChange(() => setUser(pb.authStore.model));

    const [isVerified, setIsVerified] = createSignal(false);

    createEffect(() => {
        if (user()) {
            setIsVerified(
                localStorage.getItem("isVerified")
                    ? JSON.parse(localStorage.getItem("isVerified")!)
                    : user()!.verified
            );
        }
    });

    return (
        <UserContext.Provider
            value={{ user, setUser, isVerified, setIsVerified }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export const useUser = (): any => {
    return useContext(UserContext);
};
