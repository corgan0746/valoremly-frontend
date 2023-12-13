import { useNavigate } from "react-router-dom"
import { NotificationItem } from "./NotificationItem"

export const NotificationList = ({closeNotifications, notifications}) => {

    const navigate = useNavigate();

    const redirectFn = (str) => {
        closeNotifications();
        navigate(str);
    }

    if(notifications){
    return (
        <>
            {notifications.map((element, index) => <NotificationItem date={element.date} navigate={redirectFn} key={index} image={element.image} message={element.message} url={element.type}  />)}
        </>
    )
    }

}