import '../../assets/Nav.css'

export const Navbar = () => {
    return (
        <div className="main_nav border-b-2">
            <ul className="w-[90%] mx-auto h-full flex justify-between items-center ">
                <li>
                    <a href="/">
                        <img src="/logo.png" alt="" width={"100px"}/>
                    </a>
                </li>
                <li>
                    <a href="/">
                        <div className="shine">UIVERSE</div>
                    </a>
                </li>
            </ul>
        </div>
    )
}