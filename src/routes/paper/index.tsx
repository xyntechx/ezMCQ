import { Component, createSignal, For, onMount, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { pb } from "../../utils/pocketbase";
import styles from "./styles.module.css";
import { createStore } from "solid-js/store";

interface Paper {
    title: string;
    description: string;
}

interface Question {
    id: string;
    index: number;
    content: string;
}

interface Answer {
    index: number;
    content: string;
    isCorrect: boolean;
    questionID: string;
}

interface Response {
    questionID: string;
    answerIndex?: number;
    correctAnswerIndex?: number;
}

const Paper: Component = () => {
    const paperID = useLocation().pathname.split("/")[2];

    const [paper, setPaper] = createStore<Paper>({
        title: "",
        description: "",
    });
    const [questions, setQuestions] = createStore<Question[]>([]);
    const [answers, setAnswers] = createStore<Answer[]>([]);

    const [responses, setResponses] = createStore<Response[]>([]);
    const [score, setScore] = createSignal(0);

    const [isLoading, setIsLoading] = createSignal(false);
    const [inProgress, setInProgress] = createSignal(true);

    onMount(async () => {
        const paperRes = await pb.collection("papers").getOne(paperID);

        setPaper({
            title: paperRes.title,
            description: paperRes.description,
        });

        const questionsRes = await pb.collection("questions").getFullList({
            filter: `paper = "${paperID}"`,
            sort: "index",
        });

        for (let i = 0; i < questionsRes.length; i++) {
            setQuestions([
                ...questions,
                {
                    id: questionsRes[i].id,
                    index: questionsRes[i].index,
                    content: questionsRes[i].content,
                },
            ]);

            setResponses([
                ...responses,
                {
                    questionID: questionsRes[i].id,
                    answerIndex: undefined,
                    correctAnswerIndex: undefined,
                },
            ]);

            const answersRes = await pb.collection("answers").getFullList({
                filter: `question = "${questionsRes[i].id}"`,
                sort: "general_index",
            });

            for (let j = 0; j < answersRes.length; j++) {
                setAnswers([
                    ...answers,
                    {
                        index: answersRes[j].index,
                        content: answersRes[j].content,
                        isCorrect: answersRes[j].is_correct,
                        questionID: questionsRes[i].id,
                    },
                ]);

                if (answersRes[j].is_correct) {
                    setResponses(
                        (response) =>
                            response.questionID === questionsRes[i].id,
                        "correctAnswerIndex",
                        answersRes[j].index
                    );
                }
            }
        }
    });

    const updateResponse = (answerIndex: number, questionID: string) => {
        setResponses(
            (response) => response.questionID === questionID,
            "answerIndex",
            answerIndex
        );
    };

    const submitResponse = () => {
        setIsLoading(true);

        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            if (response.answerIndex === response.correctAnswerIndex)
                setScore(score() + 1);
        }

        setIsLoading(false);
        setInProgress(false);
    };

    return (
        <div class={styles.container}>
            <header class={styles.nav}>
                <A href="/dashboard" class={styles.buttonText}>
                    &lt;
                </A>
                <p>Dashboard</p>
            </header>

            <div class={styles.top}>
                <h1>{paper.title}</h1>
                <p>{paper.description}</p>
            </div>

            <Show when={inProgress()}>
                <For each={questions}>
                    {(question, i) => (
                        <div class={styles.section}>
                            <p>
                                {question.index + 1}. {question.content}
                            </p>
                            <For each={answers}>
                                {(answer, j) => (
                                    <Show
                                        when={answer.questionID === question.id}
                                    >
                                        <button
                                            onClick={() =>
                                                updateResponse(
                                                    answer.index,
                                                    question.id
                                                )
                                            }
                                            class={styles.button}
                                            style={{
                                                "background-color":
                                                    responses[i()]
                                                        .answerIndex ===
                                                    answer.index
                                                        ? "var(--color-light)"
                                                        : "var(--color-sec-bg)",
                                                "font-weight":
                                                    responses[i()]
                                                        .answerIndex ===
                                                    answer.index
                                                        ? "800"
                                                        : "400",
                                            }}
                                        >
                                            {answer.content}
                                        </button>
                                    </Show>
                                )}
                            </For>
                        </div>
                    )}
                </For>
                <button
                    onClick={() => submitResponse()}
                    class={styles.submitButton}
                >
                    {isLoading() ? "Loading..." : "Submit"}
                </button>
            </Show>

            <Show when={!inProgress()}>
                <h1>
                    Score: {score()} / {questions.length}
                </h1>

                <For each={questions}>
                    {(question, i) => (
                        <div class={styles.section}>
                            <p>
                                {question.index + 1}. {question.content}
                            </p>
                            <For each={answers}>
                                {(answer, j) => (
                                    <Show
                                        when={answer.questionID === question.id}
                                    >
                                        <Show
                                            when={
                                                responses[i()].answerIndex ===
                                                    answer.index &&
                                                !answer.isCorrect
                                            }
                                        >
                                            <p
                                                class={styles.answer}
                                                style={{
                                                    "background-color":
                                                        "#ef4444aa",
                                                }}
                                            >
                                                {answer.content}
                                            </p>
                                        </Show>
                                        <Show when={answer.isCorrect}>
                                            <p
                                                class={styles.answer}
                                                style={{
                                                    "background-color":
                                                        "#22c55eaa",
                                                }}
                                            >
                                                {answer.content}
                                            </p>
                                        </Show>
                                        <Show
                                            when={
                                                responses[i()].answerIndex !==
                                                    answer.index &&
                                                !answer.isCorrect
                                            }
                                        >
                                            <p class={styles.answer}>
                                                {answer.content}
                                            </p>
                                        </Show>
                                    </Show>
                                )}
                            </For>
                        </div>
                    )}
                </For>
            </Show>
        </div>
    );
};

export default Paper;
