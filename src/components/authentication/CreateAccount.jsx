import './createaccount.css';
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { usePocket } from "../../context/PocketContext";

export default function CreateAccount({ isOpen, closeModal }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);    
    
    const dialogRef = useRef(null);
    
    const { register: registerAcc, login } = usePocket();
    const { register, handleSubmit, reset, formState: { errors }, getValues, setError } = useForm();

    const isSubmitDisabled = isLoading || Object.keys(errors).length > 0;

    const handleCloseModal = () => {
        reset();
        setIsError(false);
        closeModal();
    }

    const checkUsernameTaken = async (username) => {
        try {
          const response = await fetch(`http://127.0.0.1:8090/api/collections/users/records?filter=username="${username}"`);
          const data = await response.json();
          
          if (data.totalItems > 0) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error checking username:", error);
          return false;
        }
    };
      

    const onSubmit = async (data) => {
        setIsLoading(true);
        setIsError(false);

        try {

            const isUsernameTaken = await checkUsernameTaken(data.username);
            if (isUsernameTaken) {
                setError("username", { type: "manual", message: "Username already exists"});
                setIsLoading(false);
                return;
            }
            // Register the user
            const response = await registerAcc(
                data.email,
                data.username,
                data.password,
                data.passwordConfirm
            );
            console.log("Registration success:", response);

            // Log in the user
            await login(data.email, data.password);
            console.log("Login success");

            reset();
            closeModal();
        } catch (error) {
            console.error("Error during registration:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className="create-wrapper">
            { isLoading && <p>Loading... </p>}
            {isError && <p>Error creating account. The email address might be taken</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="main-create-wrapper">
                    <p>JOIN RESONANCE</p>
                    <div className="input-container">
                        <label htmlFor="email">Email Address</label>
                        <input
                            name="email"
                            type="text"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <span>{errors.email.message}</span>}

                        <label htmlFor="username">Username</label>
                        <input
                            name="username"
                            type="text"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && <span style={{ color: "red" }}>{errors.username.message}</span>}

                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                        />
                        {errors.password && <span>{errors.password.message}</span>}

                        <label htmlFor="passwordConfirm">Confirm Password</label>
                        <input
                            name="passwordConfirm"
                            type="password"
                            {...register("passwordConfirm", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === getValues("password") || "Passwords do not match"
                            })}
                        />
                        {errors.passwordConfirm && <span>{errors.passwordConfirm.message}</span>}
                    </div>
                </div>
                <div className="submit-button">
                    <button type="submit" disabled={isSubmitDisabled}>
                        {isLoading ? "Creating Account..." : "SIGN UP"}
                    </button>
                </div>
                <div>
                    <button className="modal-close" type="button" onClick={handleCloseModal}>
                        <IoMdClose className="modal-button" />
                    </button>
                </div>
            </form>
        </dialog>
    );
}
