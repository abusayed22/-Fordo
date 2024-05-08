import {GenaralLayout} from "@/components/layout/GenaralLayout";
import {Orders} from "@/components/table/Orders";
import {Test} from "@/components/Test";

export default function Home() {
    return (
        <GenaralLayout>
            <div className="sm:w-[90%] mx-auto">
                <Orders />
            </div>
    </GenaralLayout>
    );
}
