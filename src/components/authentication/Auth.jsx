import './auth.css';
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import Loading from "../loading/Loading";
import { usePocket } from "../../context/PocketContext";

export default function Auth({ isOpen, closeModal }) {

    const { register, handleSubmit, reset } = useForm();
    const { login, user } = usePocket();

    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);

    async function onSubmit(data) {
        setIsLoading(true);
        setIsError(false);
        try {
            await login(data.email, data.password);
            reset();
        } catch (e) {
            setIsError(true);
            console.error("Login failed:", e.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="auth-container">
            {isError && <p>Invalid email or password</p>}
            <button className="cancel-auth-button" onClick={closeModal}>
                <IoMdClose className="modal-button"/>
            </button>
            <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-input-container">
                    <div className="form-input">
                        <label htmlFor="email" >Email</label>
                        <input className="form-input-style" type="text" name="email" {...register("email")}/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            name="password" 
                            className="form-input-style"
                            {...register("password")}
                            />
                    </div>
                </div>
                <div className="submit-button">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "LOADING" : "SIGN IN"}
                    </button>
                </div>
            </form>
            
        </div>
    )
}