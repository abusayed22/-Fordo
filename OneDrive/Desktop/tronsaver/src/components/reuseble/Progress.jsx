export const Progress = ({pro}) => {
    return (
        <>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                    className="bg-primary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${pro}%` }}
                >
                    {pro}%
                </div>
            </div>
        </>
    )
}