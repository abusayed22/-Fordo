import {Navbar} from "@/components/layout/Navbar";

export function GenaralLayout(props) {
    return (
        <>
            <Navbar />
            {props.children}
        </>
    )
}

