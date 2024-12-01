import { useEffect, useRef } from "react"
import { usePocket } from "../../context/PocketContext";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount({ isOpen, closeModal }) {
    
    const dialogRef = useRef(null);
    const { user, deleteAccount } = usePocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen] );

    const deleteAcc = async () => {
        try {
            await deleteAccount(user.id);
            console.log("Account deleted") 
            navigate('/');  
            location.reload();
        } catch (e) {
            console.error("Failed to delete account", e);
        }
    }

    return (
        <dialog ref={dialogRef} className="review-modal">
            <p className="header-name">Delete User</p>
            <p className="header-listen">Are you sure you want to delete your account?</p>
            <footer className="delete-container">
                <button onClick={closeModal} className="cancel-button">CANCEL</button>
                <button onClick={deleteAcc} className="delete-button">DELETE</button>
            </footer>
            <button className="modal-close" type="button" onClick={closeModal}>
                <IoMdClose className="modal-button" />
            </button>
        </dialog>
    )
}