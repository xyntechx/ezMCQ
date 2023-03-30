import { A } from "@solidjs/router";
import { Component, createSignal, For, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Alert from "../../components/alert";
import { useUser } from "../../contexts/UserContext";
import { pb } from "../../utils/pocketbase";
import styles from "./styles.module.css";

interface QuestionProps {
    index: number;
    content: string;
    answerCount: number;
}

interface AnswerProps {
    id: number; // index of the answer in general (no duplicates in each paper) (general_index in database)
    index: number; // index of the answer in the question
    questionIndex: number; // index of the question the answer is linked to
    questionID: string; // id of question in database
    content: string;
    isCorrect: boolean;
}

const Create: Component = () => {
    const { user, isVerified } = useUser();

    const [isLoading, setIsLoading] = createSignal(false);
    const [successMessage, setSuccessMessage] = createSignal("");
    const [errorMessage, setErrorMessage] = createSignal("");

    const [title, setTitle] = createSignal("");
    const [description, setDescription] = createSignal("");

    const [questions, setQuestions] = createStore<QuestionProps[]>([
        {
            index: 0,
            content: "",
            answerCount: 2,
        },
    ]);

    const [answers, setAnswers] = createStore<AnswerProps[]>([
        {
            id: 0,
            index: 0,
            questionIndex: 0,
            questionID: "",
            content: "",
            isCorrect: true,
        },
        {
            id: 1,
            index: 1,
            questionIndex: 0,
            questionID: "",
            content: "",
            isCorrect: false,
        },
    ]);

    onMount(() => {
        if (!user()) window.location.href = "/auth";
        else if (!isVerified()) window.location.href = "/dashboard";
    });

    const addAnswer = (questionIndex: number) => {
        setAnswers([
            ...answers,
            {
                id: answers.length,
                index: questions[questionIndex].answerCount,
                questionIndex: questionIndex,
                questionID: "",
                content: "",
                isCorrect: false,
            },
        ]);

        setQuestions(
            (question) => question.index === questionIndex,
            "answerCount",
            (answerCount) => answerCount + 1
        );
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                index: questions.length,
                content: "",
                answerCount: 2,
            },
        ]);

        setAnswers([
            ...answers,
            {
                id: answers.length,
                index: 0,
                questionIndex: questions.length - 1,
                questionID: "",
                content: "",
                isCorrect: true,
            },
            {
                id: answers.length + 1,
                index: 1,
                questionIndex: questions.length - 1,
                questionID: "",
                content: "",
                isCorrect: false,
            },
        ]);
    };

    const createPaper = async () => {
        setIsLoading(true);

        if (!(title() && description())) {
            setErrorMessage(
                "Please ensure that title and description are filled up."
            );
            setIsLoading(false);
            return;
        }

        try {
            const newPaper = await pb.collection("papers").create({
                title: title(),
                description: description(),
                author: user().id,
            });

            for (let i = 0; i < questions.length; i++) {
                const newQuestion = await pb.collection("questions").create({
                    paper: newPaper.id,
                    content: questions[i].content,
                    index: questions[i].index,
                    answer_count: questions[i].answerCount,
                });

                setAnswers(
                    (answer) => answer.questionIndex === newQuestion.index,
                    "questionID",
                    newQuestion.id
                );
            }

            for (let i = 0; i < answers.length; i++) {
                const newAnswer = await pb.collection("answers").create({
                    content: answers[i].content,
                    is_correct: answers[i].isCorrect,
                    index: answers[i].index,
                    general_index: answers[i].id,
                    question: answers[i].questionID,
                });
            }

            setSuccessMessage("Paper successfully created!");
            setIsLoading(false);
            return;
        } catch (err) {
            setErrorMessage("An error has occurred.");
            setIsLoading(false);
            return;
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

            <header class={styles.nav}>
                <A href="/dashboard" class={styles.buttonText}>
                    &lt;
                </A>
                <p>Dashboard</p>
            </header>

            <div class={styles.topInputs}>
                <input
                    placeholder="Title..."
                    type="text"
                    value={title()}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                    class={styles.inputTitle}
                />
                <input
                    placeholder="Description..."
                    type="text"
                    value={description()}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                    class={styles.inputDesc}
                />
            </div>

            <For each={questions}>
                {(question, i) => (
                    <div class={styles.section}>
                        <input
                            placeholder={`Question ${question.index + 1}...`}
                            type="text"
                            value={question.content}
                            onInput={(e) =>
                                setQuestions(
                                    (question) => question.index === i(),
                                    "content",
                                    e.currentTarget.value
                                )
                            }
                            class={styles.input}
                            style={{ "font-weight": 800 }}
                        />
                        <For each={answers}>
                            {(answer, j) => (
                                <Show when={answer.questionIndex === i()}>
                                    <div class={styles.answerInputs}>
                                        <input
                                            placeholder={`Answer ${
                                                answer.index + 1
                                            }...`}
                                            type="text"
                                            value={answer.content}
                                            onInput={(e) =>
                                                setAnswers(
                                                    (answer) =>
                                                        answer.id === j(),
                                                    "content",
                                                    e.currentTarget.value
                                                )
                                            }
                                            class={styles.input}
                                        />
                                        <input
                                            type="checkbox"
                                            checked={answer.isCorrect}
                                            onChange={() =>
                                                setAnswers(
                                                    (answer) =>
                                                        answer.id === j(),
                                                    "isCorrect",
                                                    (isCorrect) => !isCorrect
                                                )
                                            }
                                            class={styles.checkbox}
                                        />
                                    </div>
                                </Show>
                            )}
                        </For>
                        <button
                            onClick={() => addAnswer(question.index)}
                            class={styles.button}
                        >
                            + New Answer
                        </button>
                    </div>
                )}
            </For>
            <button onClick={() => addQuestion()} class={styles.button}>
                + New Question
            </button>
            <button onClick={() => createPaper()} class={styles.button}>
                {isLoading() ? "Loading..." : "Create"}
            </button>
        </div>
    );
};

export default Create;
