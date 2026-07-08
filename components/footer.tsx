import {APP_NAME} from "@/lib/constants";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t">
            <div className="p5 flex-center">
                {currentYear} {APP_NAME} Coffee. All Rights Reserved
            </div>
        </footer>
    )
}
 
export default Footer;