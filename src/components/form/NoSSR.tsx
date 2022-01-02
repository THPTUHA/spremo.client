import dynamic from "next/dynamic"

export const ReactQuillNoSSR = dynamic(
    () => import("react-quill"),
    { ssr: false }
)
